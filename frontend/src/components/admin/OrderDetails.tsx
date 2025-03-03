import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, AlertTriangle, Ban } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

import orderService, { Order } from '@/lib/services/orderService';

// Definir OrderStatus ya que no está exportado directamente del servicio
type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Estructura modificada para coincidir con los datos esperados
interface OrderItemExtended {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

interface OrderExtended extends Omit<Order, 'items'> {
  orderNumber?: string;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  items: OrderItemExtended[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
}

// Props para la versión modal/drawer
interface OrderModalProps {
  orderId?: number;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: () => Promise<void>;
}

// Versión basada en rutas (usando useParams)
const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  return <OrderDetailsContent orderIdString={orderId} navigateBack={() => navigate('/admin/orders')} />;
};

// Versión modal/drawer (recibiendo props)
const OrderDetailsModal = ({ orderId, isOpen, onClose, onStatusChange }: OrderModalProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[90vh] sm:h-[85vh]">
        <div className="px-4 py-6 max-h-full overflow-auto">
          <OrderDetailsContent 
            orderIdString={orderId?.toString()} 
            navigateBack={onClose}
            onStatusChangeCallback={onStatusChange}
            isModal
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// Componente interno compartido para mostrar los detalles
interface OrderDetailsContentProps {
  orderIdString?: string;
  navigateBack: () => void;
  onStatusChangeCallback?: () => Promise<void>;
  isModal?: boolean;
}

const OrderDetailsContent = ({ 
  orderIdString, 
  navigateBack,
  onStatusChangeCallback,
  isModal = false
}: OrderDetailsContentProps) => {
  const [order, setOrder] = useState<OrderExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        if (orderIdString) {
          // Convertir orderId a número para coincidir con la API
          const numericId = parseInt(orderIdString, 10);
          if (isNaN(numericId)) {
            throw new Error('ID de pedido inválido');
          }
          
          // Obtener datos del pedido
          const data = await orderService.getOrderById(numericId);
          
          // Adaptación al formato extendido (simulado para este ejemplo)
          // En un caso real, estos datos vendrían de la API
          const extendedData: OrderExtended = {
            ...data,
            orderNumber: `ORD-${data.id}`,
            subtotal: data.total * 0.79, // Simulado
            taxAmount: data.total * 0.21, // Simulado
            shippingCost: 4.99, // Simulado
            items: data.items?.map(item => ({
              ...item,
              id: item.id || 0,
              unitPrice: item.price,
              product: {
                id: item.productId,
                name: item.productName || `Producto #${item.productId}`,
                imageUrl: undefined
              }
            })) || [],
            shippingAddress: {
              fullName: data.userName || 'Cliente',
              street: 'Dirección de envío',
              city: 'Ciudad',
              postalCode: '12345',
              country: 'España',
              phone: '123456789'
            },
            user: {
              id: data.userId,
              name: data.userName || 'Cliente',
              email: data.userEmail || 'cliente@example.com',
              createdAt: data.createdAt || new Date().toISOString()
            }
          };
          
          setOrder(extendedData);
          setNewStatus(data.status as OrderStatus);
        }
      } catch (error) {
        console.error('Error al obtener el pedido:', error);
        toast.error('No se pudo cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderIdString]);

  const handleStatusChange = async () => {
    if (!order || !newStatus) return;
    
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(order.id!, newStatus as OrderStatus);
      toast.success('Estado del pedido actualizado correctamente');
      
      // Actualizar los datos locales
      setOrder(prev => prev ? { ...prev, status: newStatus as OrderStatus } : null);
      
      // Si estamos en modo modal y hay una función de callback, invocarla
      if (isModal && onStatusChangeCallback) {
        await onStatusChangeCallback();
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado del pedido');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'PROCESSING':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'DELIVERED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PROCESSING':
        return 'En proceso';
      case 'SHIPPED':
        return 'Enviado';
      case 'DELIVERED':
        return 'Entregado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4">
        <Button 
          variant="ghost"
          onClick={navigateBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a pedidos
        </Button>
        <div className="mt-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500" />
          <h2 className="mt-4 text-2xl font-bold">Pedido no encontrado</h2>
          <p className="mt-2 text-muted-foreground">
            El pedido que estás buscando no existe o no tienes permisos para verlo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button 
            variant="ghost"
            onClick={navigateBack}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a pedidos
          </Button>
          <h1 className="text-2xl font-bold">Pedido #{order.orderNumber || order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Realizado el {formatDate(order.createdAt || '')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 self-start">
          <div className="flex items-center space-x-2">
            {getStatusIcon(order.status)}
            <Badge variant="outline" className={`${getStatusColor(order.status)} border-none`}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Productos</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex space-x-4">
                      <div className="h-16 w-16 rounded-md bg-secondary overflow-hidden">
                        {item.product.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-secondary">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(item.quantity * item.unitPrice)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dirección de envío</h2>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold">Resumen</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impuestos</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Actualizar estado</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Estado del pedido
                  </label>
                  <Select 
                    value={newStatus} 
                    onValueChange={(value) => setNewStatus(value as OrderStatus)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="PROCESSING">En proceso</SelectItem>
                      <SelectItem value="SHIPPED">Enviado</SelectItem>
                      <SelectItem value="DELIVERED">Entregado</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full"
                  disabled={order.status === newStatus || updating || !newStatus}
                  onClick={handleStatusChange}
                >
                  {updating ? 'Actualizando...' : 'Actualizar estado'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Información del cliente</h2>
              <div className="space-y-1">
                <p className="font-medium">{order.user.name || 'Cliente'}</p>
                <p>{order.user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Cliente desde {formatDate(order.user.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
export { OrderDetailsModal }; 