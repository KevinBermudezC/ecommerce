import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'sonner';
import { Shield, AtSign, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AdminAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, loading } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const hasRedirected = useRef(false);

  // Usar useEffect para manejar la navegación después del renderizado
  useEffect(() => {
    // Evitar múltiples redirecciones
    if (hasRedirected.current) return;
    
    // Solo redirigir si no estamos ya en una ruta admin y el usuario es admin
    if (isAuthenticated && !loading && user?.role === 'admin' && !location.pathname.includes('/admin/dashboard')) {
      hasRedirected.current = true;
      const lastVisitedPath = localStorage.getItem('adminLastPath') || '/admin/dashboard';
      
      // Pequeño retardo para evitar conflictos
      setTimeout(() => {
        navigate(lastVisitedPath, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, loading, user, navigate, location]);

  // Renderizado condicional sin navegación directa
  if (isAuthenticated && !loading) {
    if (user?.role === 'admin') {
      // Mostrar mensaje de carga mientras se redirige
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>Redirigiendo al panel de administración...</p>
          </div>
        </div>
      );
    } else {
      // Si está autenticado pero no es administrador, mostrar mensaje
      const goHome = () => {
        navigate('/', { replace: true });
      };
      
      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <Shield className="w-12 h-12 mx-auto text-destructive" />
              <CardTitle className="text-2xl">Acceso denegado</CardTitle>
              <CardDescription>
                No tienes permisos de administrador para acceder a esta sección.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={goHome}
              >
                Volver a la tienda
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(credentials.email, credentials.password);
      // La redirección se maneja en el useEffect cuando isAuthenticated cambie
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      toast.error('Credenciales inválidas. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center w-full mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Panel de Administración</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al panel de control
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={credentials.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full mt-4" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center">
                  Acceder <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminAuth; 