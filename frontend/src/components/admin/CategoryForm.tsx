import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FolderIcon } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@/lib/services/categoryService';
import categoryService from '@/lib/services/categoryService';

interface CategoryFormProps {
  categoryId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryForm = ({ categoryId, isOpen, onClose, onSuccess }: CategoryFormProps) => {
  const [formData, setFormData] = useState<Category>({
    name: '',
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (isOpen && categoryId) {
      fetchCategory();
    } else if (isOpen) {
      // Resetear el formulario para crear nueva categoría
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [isOpen, categoryId]);
  
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const category = await categoryService.getCategoryById(categoryId!);
      setFormData({
        name: category.name,
        description: category.description || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar la categoría:', error);
      toast.error('Error al cargar la información de la categoría');
      setLoading(false);
      onClose();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (categoryId) {
        await categoryService.updateCategory(categoryId, formData);
        toast.success('Categoría actualizada correctamente');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Categoría creada correctamente');
      }
      
      onSuccess();
      setSubmitting(false);
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      toast.error('Error al guardar la categoría');
      setSubmitting(false);
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-lg mx-auto">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
            <FolderIcon className="h-5 w-5" />
            {categoryId ? 'Editar Categoría' : 'Nueva Categoría'}
          </DrawerTitle>
          <DrawerDescription>
            {categoryId ? 'Modifica los datos de la categoría existente' : 'Completa el formulario para crear una nueva categoría'}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
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
                    placeholder="Nombre de la categoría"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    placeholder="Descripción de la categoría (opcional)"
                  />
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
              {submitting ? 'Guardando...' : categoryId ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryForm; 