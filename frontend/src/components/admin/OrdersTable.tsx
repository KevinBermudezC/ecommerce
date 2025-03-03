import React, { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Order } from '@/lib/services/orderService';
import orderService from '@/lib/services/orderService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderDetailsModal } from './OrderDetails';

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders(currentPage, 10, statusFilter || undefined);
      
      let filteredOrders = response.orders;
      if (searchQuery) {
        filteredOrders = filteredOrders.filter(order => 
          (order.userEmail && order.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (order.id && order.id.toString().includes(searchQuery))
        );
      }
      
      setOrders(filteredOrders);
      setTotalPages(Math.ceil(response.totalCount / 10));
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      toast.error('Error al cargar las órdenes');
      setLoading(false);
    }
  };

  const handleViewDetails = (id: number) => {
    setSelectedOrderId(id);
    setIsDetailsOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PROCESSING':
        return 'Procesando';
      case 'SHIPPED':
        return 'Enviado';
      case 'DELIVERED':
        return 'Entregado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
      </div>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por ID o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border rounded-md"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </div>
        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="PROCESSING">Procesando</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-10 ml-auto" /></td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div>{order.userName || 'Usuario'}</div>
                        <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(order.id!)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <PackageCheck className="h-8 w-8 text-muted-foreground/50" />
                      <div>No se encontraron pedidos</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 flex justify-between items-center border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando página {currentPage} de {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage} 
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextPage} 
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <OrderDetailsModal 
        orderId={selectedOrderId}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onStatusChange={fetchOrders}
      />
    </div>
  );
};

export default OrdersTable; 