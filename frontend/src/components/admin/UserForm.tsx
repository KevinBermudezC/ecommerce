import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/lib/services/userService';
import userService from '@/lib/services/userService';

interface UserFormProps {
  userId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm = ({ userId, isOpen, onClose, onSuccess }: UserFormProps) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'USER'
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (isOpen && userId) {
      fetchUser();
    }
  }, [isOpen, userId]);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await userService.getUserById(userId!);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role
      });
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      toast.error('Error al cargar la información del usuario');
      setLoading(false);
      onClose();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }
    
    try {
      setSubmitting(true);
      
      await userService.updateUser(userId!, formData);
      toast.success('Usuario actualizado correctamente');
      
      onSuccess();
      setSubmitting(false);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      toast.error('Error al actualizar el usuario');
      setSubmitting(false);
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-lg mx-auto">
        <DrawerHeader className="border-b pb-4">
          <h2 className="text-lg font-semibold">
            Editar Usuario
          </h2>
        </DrawerHeader>
        
        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Nombre del usuario"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Email del usuario"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>
            </form>
          )}
        </div>
        
        <DrawerFooter className="border-t">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || loading}
            >
              {submitting ? 'Guardando...' : 'Actualizar'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserForm; 