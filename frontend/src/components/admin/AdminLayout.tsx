import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { Moon, Sun, Home, Menu, Package, Tag, ShoppingCart, Users, BarChart2, Settings, LogOut, Loader2, Palette } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminErrorBoundary from './AdminErrorBoundary';

const AdminLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Guardar la ruta actual en localStorage, solo para rutas de administración que no sean login
  useEffect(() => {
    setMounted(true);
    if (location.pathname.startsWith('/admin/') && !location.pathname.includes('/admin/login')) {
      localStorage.setItem('adminLastPath', location.pathname);
    }
  }, [location.pathname]);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleLogout = () => {
    // Limpiar el estado antes de cerrar sesión
    localStorage.removeItem('adminLastPath');
    logout();
    // Navegar usando replace para evitar una navegación adicional en el historial
    navigate('/auth?mode=login', { replace: true });
  };

  // Si la aplicación está cargando, mostrar pantalla de carga
  if (loading && !mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Panel Admin</h2>
        <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="px-2 py-4 space-y-1">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin/dashboard') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          
          <Link 
            to="/admin/products" 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin/products') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Package className="mr-2 h-4 w-4" />
            Productos
          </Link>
          
          <Link 
            to="/admin/categories" 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin/categories') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Tag className="mr-2 h-4 w-4" />
            Categorías
          </Link>
          
          <Link 
            to="/admin/orders" 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin/orders') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Pedidos
          </Link>
          
          <Link 
            to="/admin/users" 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin/users') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Users className="mr-2 h-4 w-4" />
            Usuarios
          </Link>
          
          <Link 
            to="/admin/settings" 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin/settings') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>

          <Link 
            to="/admin/site-config" 
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname.startsWith('/admin/site-config') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Palette className="mr-2 h-4 w-4" />
            Personalización
          </Link>
        </nav>
      </ScrollArea>
      
      <div className="p-4 space-y-2 border-t">
        <Link 
          to="/" 
          className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="mr-2 h-4 w-4" />
          Volver a la tienda
        </Link>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar para escritorio (siempre visible en md+) */}
      <aside className="hidden md:block md:w-64 h-full border-r">
        <SidebarContent />
      </aside>

      {/* Área de contenido principal */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header móvil (solo visible en móvil) */}
        <header className="md:hidden flex items-center justify-between border-b h-14 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center">
            {/* Sheet para menú móvil */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="ml-3 font-semibold">Panel de Administración</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        {/* Contenido de la página actual con scroll propio - envuelto en ErrorBoundary */}
        <div className="flex-1 overflow-auto">
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 