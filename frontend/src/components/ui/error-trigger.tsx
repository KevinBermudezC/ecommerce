import { useState, useEffect } from 'react';
import { Button } from './button';
import { AlertCircle } from 'lucide-react';

interface ErrorTriggerProps {
  errorMessage?: string;
  label?: string;
  delay?: number; // Retardo en milisegundos antes de lanzar el error
}

/**
 * Componente que permite provocar errores controlados para probar los Error Boundaries
 */
export function ErrorTrigger({ 
  errorMessage = "Este es un error forzado para probar el Error Boundary", 
  label = "Forzar error", 
  delay = 0 
}: ErrorTriggerProps) {
  const [shouldError, setShouldError] = useState(false);

  useEffect(() => {
    if (shouldError) {
      // Opcionalmente aplicar un retraso antes de lanzar el error
      const timer = setTimeout(() => {
        throw new Error(errorMessage);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [shouldError, errorMessage, delay]);

  const triggerError = () => {
    setShouldError(true);
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={triggerError}
      className="gap-2"
    >
      <AlertCircle className="h-4 w-4" />
      {label}
    </Button>
  );
} 