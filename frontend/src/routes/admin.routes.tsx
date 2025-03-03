import { Navigate } from 'react-router';
import AdminLayout from '../components/admin/AdminLayout';
import AdminAuth from '../components/admin/AdminAuth';
import DashboardStats from '../components/admin/DashboardStats';
import ProductsTable from '../components/admin/ProductsTable';
import ProductForm from '../components/admin/ProductForm';
import CategoriesTable from '../components/admin/CategoriesTable';
import CategoryForm from '../components/admin/CategoryForm';
import OrdersTable from '../components/admin/OrdersTable';
import OrderDetails from '../components/admin/OrderDetails';
import UsersTable from '../components/admin/UsersTable';
import UserForm from '../components/admin/UserForm';
import SettingsPanel from '../components/admin/SettingsPanel';
import { useAuth } from '@/lib/useAuth';
import { ReactNode } from 'react';

// Componente protector para rutas de administrador
const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Si aún está cargando, no hacemos nada
  if (loading) return null;
  
  // Si no está autenticado o no es admin, redirigir a la página de login admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Si pasa todas las verificaciones, mostrar el contenido
  return <>{children}</>;
};

// Componente para redireccionar a la última ruta visitada o al dashboard por defecto
const AdminRedirect = () => {
  // Recuperar la última página visitada desde localStorage o usar dashboard por defecto
  const lastVisitedPath = localStorage.getItem('adminLastPath') || '/admin/dashboard';
  return <Navigate to={lastVisitedPath} replace />;
};

const adminRoutes = {
  path: 'admin',
  children: [
    {
      path: 'login',
      element: <AdminAuth />
    },
    {
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <AdminRedirect />
        },
        {
          path: 'dashboard',
          element: (
            <AdminRoute>
              <DashboardStats />
            </AdminRoute>
          )
        },
        // Rutas para productos
        {
          path: 'products',
          children: [
            {
              index: true,
              element: (
                <AdminRoute>
                  <ProductsTable />
                </AdminRoute>
              )
            },
            {
              path: 'new',
              element: (
                <AdminRoute>
                  <ProductForm isOpen={true} onClose={() => {}} onSuccess={() => {}} />
                </AdminRoute>
              )
            },
            {
              path: 'edit/:productId',
              element: (
                <AdminRoute>
                  <ProductForm isOpen={true} onClose={() => {}} onSuccess={() => {}} />
                </AdminRoute>
              )
            }
          ]
        },
        // Rutas para categorías
        {
          path: 'categories',
          children: [
            {
              index: true,
              element: (
                <AdminRoute>
                  <CategoriesTable />
                </AdminRoute>
              )
            },
            {
              path: 'new',
              element: (
                <AdminRoute>
                  <CategoryForm isOpen={true} onClose={() => {}} onSuccess={() => {}} />
                </AdminRoute>
              )
            },
            {
              path: 'edit/:categoryId',
              element: (
                <AdminRoute>
                  <CategoryForm isOpen={true} onClose={() => {}} onSuccess={() => {}} />
                </AdminRoute>
              )
            }
          ]
        },
        // Rutas para pedidos
        {
          path: 'orders',
          children: [
            {
              index: true,
              element: (
                <AdminRoute>
                  <OrdersTable />
                </AdminRoute>
              )
            },
            {
              path: ':orderId',
              element: (
                <AdminRoute>
                  <OrderDetails />
                </AdminRoute>
              )
            }
          ]
        },
        // Rutas para usuarios
        {
          path: 'users',
          children: [
            {
              index: true,
              element: (
                <AdminRoute>
                  <UsersTable />
                </AdminRoute>
              )
            },
            {
              path: 'edit/:userId',
              element: (
                <AdminRoute>
                  <UserForm isOpen={true} onClose={() => {}} onSuccess={() => {}} />
                </AdminRoute>
              )
            }
          ]
        },
        {
          path: 'settings',
          element: (
            <AdminRoute>
              <SettingsPanel />
            </AdminRoute>
          )
        }
      ]
    }
  ]
};

export default adminRoutes; 