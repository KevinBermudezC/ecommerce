import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, BarChart } from "@tremor/react";
import { CreditCard, DollarSign, Users, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import userService from '@/lib/services/userService';
import orderService, { OrderStats, Order } from '@/lib/services/orderService';

const DashboardStats = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [userStats, setUserStats] = useState<{
    totalUsers: number;
    newUsersThisMonth: number;
    userGrowth: number;
  } | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [orderStatsData, userStatsData] = await Promise.all([
          orderService.getOrderStats(),
          userService.getUserStats()
        ]);
        
        setOrderStats(orderStatsData);
        setUserStats(userStatsData);
        setRecentOrders(orderStatsData.recentOrders || []);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast.error('Error al cargar las estadísticas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Sample chart data (replace with real data from API)
  const salesData = [
    { date: "Ene", sales: 4500 },
    { date: "Feb", sales: 5000 },
    { date: "Mar", sales: 6300 },
    { date: "Abr", sales: 7200 },
    { date: "May", sales: 6800 },
    { date: "Jun", sales: 8100 },
    { date: "Jul", sales: 9500 },
  ];

  const ordersData = [
    { date: "Ene", orders: 25 },
    { date: "Feb", orders: 33 },
    { date: "Mar", orders: 42 },
    { date: "Abr", orders: 50 },
    { date: "May", orders: 45 },
    { date: "Jun", orders: 55 },
    { date: "Jul", orders: 68 },
  ];

  const valueFormatter = (number: number) => {
    return `$${new Intl.NumberFormat('es-ES').format(number).toString()}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatOrderDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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

  const renderStat = (title: string, value: string | number, description: string, icon: React.ReactNode, trend: 'up' | 'down' | null, percent?: number) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend && (
            trend === 'up' ? (
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            )
          )}
          {percent !== undefined && (
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {percent}%
            </span>
          )}
          <span className="ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Panel de Control</h2>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          // Skeleton loaders for stats
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            {renderStat(
              "Ingresos Totales",
              formatCurrency(orderStats?.totalRevenue || 0),
              "comparado con el mes anterior",
              <DollarSign className="h-4 w-4 text-muted-foreground" />,
              orderStats && orderStats.revenueGrowth >= 0 ? 'up' : 'down',
              orderStats?.revenueGrowth
            )}
            
            {renderStat(
              "Pedidos",
              orderStats?.totalOrders || 0,
              "comparado con el mes anterior",
              <CreditCard className="h-4 w-4 text-muted-foreground" />,
              orderStats && orderStats.orderGrowth >= 0 ? 'up' : 'down',
              orderStats?.orderGrowth
            )}
            
            {renderStat(
              "Usuarios",
              userStats?.totalUsers || 0,
              "comparado con el mes anterior",
              <Users className="h-4 w-4 text-muted-foreground" />,
              userStats && userStats.userGrowth >= 0 ? 'up' : 'down',
              userStats?.userGrowth
            )}
            
            {renderStat(
              "Productos",
              123, // Replace with actual product count
              "productos activos",
              <Package className="h-4 w-4 text-muted-foreground" />,
              null
            )}
          </>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ventas</CardTitle>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTimeframe('day')}
                      className={`text-xs px-2 py-1 rounded ${timeframe === 'day' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    >
                      Día
                    </button>
                    <button 
                      onClick={() => setTimeframe('week')}
                      className={`text-xs px-2 py-1 rounded ${timeframe === 'week' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    >
                      Semana
                    </button>
                    <button 
                      onClick={() => setTimeframe('month')}
                      className={`text-xs px-2 py-1 rounded ${timeframe === 'month' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    >
                      Mes
                    </button>
                  </div>
                </div>
                <CardDescription>Ingresos en los últimos meses</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <AreaChart
                    data={salesData}
                    index="date"
                    categories={["sales"]}
                    colors={["indigo"]}
                    valueFormatter={valueFormatter}
                    showLegend={false}
                    className="h-[200px] dark:text-white"
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos</CardTitle>
                <CardDescription>Volumen de pedidos en los últimos meses</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <BarChart
                    data={ordersData}
                    index="date"
                    categories={["orders"]}
                    colors={["blue"]}
                    showLegend={false}
                    className="h-[200px]"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Los últimos pedidos recibidos en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6">No hay pedidos recientes</p>
                  ) : (
                    <div className="grid grid-cols-1 divide-y">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="py-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{order.userName || 'Usuario'}</p>
                            <p className="text-xs text-muted-foreground">
                              Pedido #{order.id} • {formatOrderDate(order.createdAt)}
                            </p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="font-medium">
                            {formatCurrency(order.total)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardStats; 