import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';

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
 * Componente de límite de error que captura errores en sus componentes hijos
 * y muestra una interfaz de respaldo amigable en lugar de que la aplicación se rompa.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
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
      // Puedes renderizar cualquier UI personalizada para el error
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI predeterminada de error
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md border-destructive/50">
            <CardHeader className="text-center border-b pb-4">
              <div className="mx-auto rounded-full bg-destructive/10 p-3 mb-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Algo salió mal</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                </p>
                {this.state.error && (
                  <div className="text-sm p-2 border rounded bg-muted/50 overflow-auto">
                    <p className="font-semibold">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs opacity-70">Detalles técnicos</summary>
                        <pre className="mt-2 text-xs whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 pt-2">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Ir al inicio
              </Button>
              <Button onClick={this.resetErrorBoundary}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    // Si no hay error, renderiza los componentes hijos normalmente
    return this.props.children;
  }
}

export { ErrorBoundary }; 