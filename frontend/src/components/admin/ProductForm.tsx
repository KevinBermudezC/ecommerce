import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Package, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/lib/services/productService';
import productService from '@/lib/services/productService';
import { Category } from '@/lib/services/categoryService';
import categoryService from '@/lib/services/categoryService';

interface ProductFormProps {
  productId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ productId, isOpen, onClose, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    image: ''
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      
      if (productId) {
        fetchProduct();
      } else {
        // Resetear el formulario para crear nuevo producto
        setFormData({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          categoryId: 0,
          image: ''
        });
        setImageFile(null);
        setImagePreview(null);
      }
    }
  }, [isOpen, productId]);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories(1, 100);
      setCategories(response.categories);
      
      // Si es un nuevo producto y hay categorías disponibles, seleccionar la primera por defecto
      if (!productId && response.categories.length > 0 && !formData.categoryId) {
        setFormData(prev => ({
          ...prev,
          categoryId: response.categories[0].id
        }));
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar las categorías');
    }
  };
  
  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const product = await productService.getProductById(productId);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        image: product.image || ''
      });
      
      if (product.image) {
        setImagePreview(product.image);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      toast.error('Error al cargar la información del producto');
      setLoading(false);
      onClose();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Manejar campos numéricos
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    
    // Validaciones básicas
    if (!formData.name?.trim()) {
      toast.error('El nombre del producto es obligatorio');
      return;
    }
    
    if (formData.price === undefined || formData.price <= 0) {
      toast.error('El precio debe ser mayor que 0');
      return;
    }
    
    if (formData.stock === undefined || formData.stock < 0) {
      toast.error('El stock no puede ser negativo');
      return;
    }
    
    if (!formData.categoryId) {
      toast.error('Debes seleccionar una categoría');
      return;
    }
    
    try {
      setSubmitting(true);
      
      let finalProduct = { ...formData } as Product;
      
      if (productId) {
        // Actualizar producto existente
        finalProduct = await productService.updateProduct(productId, formData);
        toast.success('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        finalProduct = await productService.createProduct(formData as Product);
        toast.success('Producto creado correctamente');
      }
      
      // Si hay una nueva imagen, subirla
      if (imageFile && finalProduct.id) {
        await productService.uploadProductImage(finalProduct.id, imageFile);
        toast.success('Imagen subida correctamente');
      }
      
      onSuccess();
      setSubmitting(false);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      toast.error('Error al guardar el producto');
      setSubmitting(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-4xl mx-auto">
        <DrawerHeader className="border-b pb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            {productId ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
        </DrawerHeader>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="Nombre del producto"
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
                      className="w-full p-2 border rounded-md min-h-[120px]"
                      placeholder="Descripción del producto (opcional)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium mb-1">
                        Precio <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium mb-1">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        No hay categorías disponibles. Por favor, crea una categoría primero.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Imagen del producto
                    </label>
                    
                    <div className="border rounded-md p-4 bg-muted/30">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-64 object-contain rounded-md bg-white/80 dark:bg-black/20" 
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
                        <div className="flex flex-col items-center justify-center p-6 h-64 border-2 border-dashed rounded-md border-muted-foreground/25">
                          <Upload className="h-10 w-10 text-muted-foreground/70 mb-2" />
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
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-md p-4 mt-4">
                    <h3 className="text-sm font-medium mb-2">Resumen</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Precio:</span>
                        <span className="font-medium">{formatPrice(formData.price || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stock:</span>
                        <span className="font-medium">{formData.stock || 0} unidades</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categoría:</span>
                        <span className="font-medium">
                          {formData.categoryId ? 
                            categories.find(c => c.id === formData.categoryId)?.name || 'No seleccionada' 
                            : 'No seleccionada'}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        <span className={`font-medium ${formData.stock && formData.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formData.stock && formData.stock > 0 ? 'En stock' : 'Agotado'}
                        </span>
                      </div>
                    </div>
                  </div>
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
              type="submit"
              form="product-form"
              disabled={submitting || loading || categories.length === 0}
            >
              {submitting ? 'Guardando...' : productId ? 'Actualizar producto' : 'Crear producto'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductForm; 