import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Componente para mostrar una orden
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OrderItem = ({ order }: { order: any }) => (
  <div className="mb-4 p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
    <div className="flex flex-wrap justify-between">
      <div>
        <p className="text-sm font-medium dark:text-white">Orden #{order.id}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{order.date}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium dark:text-white">${order.total.toFixed(2)}</p>
        <p className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</p>
      </div>
    </div>
    <Separator className="my-3 dark:bg-gray-700" />
    <div className="text-sm dark:text-gray-300">
      <p>Artículos: {order.items}</p>
    </div>
    <button className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
      Ver detalles
    </button>
  </div>
);

// Función para determinar el color basado en el estado de la orden
function getStatusColor(status: string) {
  switch (status) {
    case 'Entregado':
      return 'text-green-600 dark:text-green-400';
    case 'Enviado':
      return 'text-blue-600 dark:text-blue-400';
    case 'Procesando':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'Cancelado':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Datos simulados
  const mockOrders = [
    { id: '12345', date: '12 Jun 2023', total: 129.99, status: 'Entregado', items: 3 },
    { id: '12346', date: '28 May 2023', total: 89.50, status: 'Enviado', items: 2 },
    { id: '12347', date: '15 May 2023', total: 45.00, status: 'Procesando', items: 1 },
    { id: '12348', date: '1 Apr 2023', total: 150.75, status: 'Cancelado', items: 4 },
  ];

  const mockWishlist = [
    { id: 1, name: 'Zapatillas Deportivas', price: 99.99, image: '/product-1.jpg' },
    { id: 5, name: 'Vestido de Verano', price: 89.99, image: '/product-5.jpg' },
    { id: 8, name: 'Sudadera para Mujer', price: 69.99, image: '/product-8.jpg' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Por favor inicia sesión para ver tu perfil</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Usuario desde {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex justify-around bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
            <TabsTrigger value="info" className="flex-1 dark:text-white">
              Información Personal
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 dark:text-white">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex-1 dark:text-white">
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 dark:text-white">
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Información Personal</h2>
            <Separator className="mb-4 dark:bg-gray-700" />
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={user.name}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={user.email}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Agregar número telefónico"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        setIsEditing(false);
                      }, 1000);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre completo</h3>
                    <p className="mt-1 text-lg dark:text-white">{user.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Correo electrónico</h3>
                    <p className="mt-1 text-lg dark:text-white">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID de cuenta</h3>
                    <p className="mt-1 text-lg dark:text-white">{user.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</h3>
                    <p className="mt-1 text-lg dark:text-white text-gray-400">No especificado</p>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Editar información
                  </button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Mis Pedidos</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {mockOrders.length} pedidos
              </div>
            </div>
            <Separator className="mb-4 dark:bg-gray-700" />
            
            {mockOrders.map(order => (
              <OrderItem key={order.id} order={order} />
            ))}

            <div className="mt-6 text-center">
              <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Ver todos los pedidos
              </button>
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Mis Favoritos</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {mockWishlist.length} productos
              </div>
            </div>
            <Separator className="mb-4 dark:bg-gray-700" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWishlist.map(product => (
                <div key={product.id} className="border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-3">
                    <h3 className="font-medium dark:text-white">{product.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</p>
                    <div className="mt-2 flex space-x-2">
                      <button className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded">
                        Añadir al carrito
                      </button>
                      <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm rounded">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Configuración de la cuenta</h2>
            <Separator className="mb-6 dark:bg-gray-700" />
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 dark:text-white">Cambiar contraseña</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white px-3 py-2"
                    />
                  </div>
                  <div className="pt-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                      Actualizar contraseña
                    </button>
                  </div>
                </div>
              </div>
              
              <Separator className="dark:bg-gray-700" />
              
              <div>
                <h3 className="text-lg font-medium mb-3 dark:text-white">Preferencias de notificaciones</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Notificaciones por correo electrónico</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Ofertas y promociones</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Actualizaciones de pedidos</span>
                  </label>
                </div>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md">
                  Guardar preferencias
                </button>
              </div>
              
              <Separator className="dark:bg-gray-700" />
              
              <div>
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-3">Zona de peligro</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Las siguientes acciones son permanentes y no se pueden deshacer.
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md">
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}