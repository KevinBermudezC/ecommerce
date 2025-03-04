import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FolderIcon, Upload, X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/lib/services/categoryService';
import categoryService from '@/lib/services/categoryService';

interface CategoryFormProps {
  categoryId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryForm = ({ categoryId, isOpen, onClose, onSuccess }: CategoryFormProps) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    image: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const initializeForm = async () => {
    if (categoryId) {
      try {
        setLoading(true);
        const category = await categoryService.getCategoryById(categoryId);
        setFormData({
          name: category.name,
          description: category.description || '',
          image: category.image || ''
        });
        if (category.image) {
          setImagePreview(category.image);
        }
      } catch (error) {
        console.error('Error al cargar la categoría:', error);
        toast.error('Error al cargar los datos de la categoría');
      } finally {
        setLoading(false);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        image: ''
      });
      setImageFile(null);
      setImagePreview(null);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      initializeForm();
    }
  }, [isOpen, categoryId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    setImageFile(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }
    
    try {
      setSubmitting(true);
      let finalCategory;
      
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        image: formData.image || ''
      };
      
      if (categoryId) {
        finalCategory = await categoryService.updateCategory(categoryId, categoryData);
        toast.success('Categoría actualizada correctamente');
      } else {
        finalCategory = await categoryService.createCategory(categoryData);
        toast.success('Categoría creada correctamente');
      }
      
      // Si hay una nueva imagen, subirla
      if (imageFile && finalCategory && finalCategory.id) {
        try {
          const imageResponse = await categoryService.uploadCategoryImage(finalCategory.id, imageFile);
          toast.success('Imagen subida correctamente');
        } catch (imageError) {
          console.error('Error al subir la imagen:', imageError);
          toast.error('Categoría creada pero hubo un error al subir la imagen');
        }
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      toast.error('Error al guardar la categoría');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent className="max-w-lg mx-auto">
          <div className="p-4">
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderIcon className="h-5 w-5" />
              {categoryId ? 'Editar Categoría' : 'Nueva Categoría'}
            </DrawerTitle>
            <DrawerDescription>
              {categoryId
                ? 'Modifica los detalles de la categoría existente'
                : 'Completa los detalles para crear una nueva categoría'}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Nombre de la categoría"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Descripción de la categoría (opcional)"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Imagen de la categoría
              </label>
              
              <div className="border rounded-md p-4 bg-muted/30">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-contain rounded-md bg-white/80 dark:bg-black/20" 
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 h-48 border-2 border-dashed rounded-md border-muted-foreground/25 cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground/70 mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Arrastra una imagen o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      PNG, JPG o GIF (max. 2MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          <DrawerFooter className="border-t">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Guardando...' : categoryId ? 'Guardar cambios' : 'Crear categoría'}
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryForm; 