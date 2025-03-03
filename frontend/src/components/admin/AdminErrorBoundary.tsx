import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Componente de límite de error para el panel de administración
 * que captura errores en sus componentes hijos y muestra una interfaz
 * de respaldo amigable adaptada al contexto de administración.
 */
class AdminErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error en el panel de administración:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  resetErrorBoundary = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Retornamos el componente AdminErrorUI ya que no podemos usar hooks
      // directamente en una clase de componente
      return (
        <AdminErrorUI 
          error={this.state.error} 
          errorInfo={this.state.errorInfo} 
          reset={this.resetErrorBoundary} 
        />
      );
    }

    return this.props.children;
  }
}

// Componente funcional para la UI de error que puede usar hooks
interface ErrorUIProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  reset: () => void;
}

const AdminErrorUI = ({ error, errorInfo, reset }: ErrorUIProps) => {
  // Usamos useNavigate para la navegación programática
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[500px] p-4 bg-background">
      <Card className="w-full max-w-lg border-destructive/30 shadow-lg">
        <CardHeader className="text-center border-b pb-4 bg-muted/50">
          <div className="mx-auto rounded-full bg-destructive/10 p-3 mb-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Error en el Panel de Administración</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Ha ocurrido un error inesperado en el panel de administración. Nuestro equipo técnico ha sido notificado.
            </p>
            
            {error && (
              <div className="text-sm p-3 border rounded bg-muted/50 overflow-auto">
                <p className="font-semibold text-destructive">{error.toString()}</p>
                {errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs opacity-70">
                      Detalles técnicos (para el administrador)
                    </summary>
                    <pre className="mt-2 text-xs whitespace-pre-wrap max-h-[200px] overflow-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Puede intentar recargar la página o navegar a otra sección del panel de administración.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-2">
          <Button variant="outline" onClick={goToHome} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Ir al inicio
          </Button>
          <Button variant="outline" onClick={goToDashboard} className="flex items-center gap-2">
            Ir al dashboard
          </Button>
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Componente wrapper que combina el error boundary con la navegación
const AdminErrorBoundary = ({ children, ...props }: Props) => {
  return (
    <AdminErrorBoundaryClass {...props}>
      {children}
    </AdminErrorBoundaryClass>
  );
};

export default AdminErrorBoundary; 