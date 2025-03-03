import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function Error404() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center bg-background">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="h-1.5 w-12 bg-primary mx-auto my-6"></div>
          <h2 className="text-3xl font-semibold mb-3">Página no encontrada</h2>
          <p className="text-muted-foreground">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={goBack} 
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver atrás
          </Button>
          
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-4">
            ¿Buscabas algo específico? Prueba con estos enlaces populares:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="link" size="sm" asChild>
              <Link to="/products">Productos</Link>
            </Button>
            <Button variant="link" size="sm" asChild>
              <Link to="/cart">Carrito</Link>
            </Button>
            <Button variant="link" size="sm" asChild>
              <Link to="/auth?mode=login">Iniciar sesión</Link>
            </Button>
            <Button variant="link" size="sm" asChild>
              <Link to="/profile">Mi cuenta</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 