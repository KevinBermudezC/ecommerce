import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Package, Upload, X } from 'lucide-react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
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

interface ApiErrorResponse {
  message: string;
  success: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const initializeForm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar categorías
      console.log('🔄 Intentando cargar categorías...');
      const response = await categoryService.getCategories(1, 100);
      console.log('✅ Categorías cargadas:', response);
      
      if (!response.categories || !Array.isArray(response.categories)) {
        throw new Error('No se recibieron categorías válidas del servidor');
      }
      
      setCategories(response.categories);
      
      // Si es un nuevo producto y hay categorías disponibles, seleccionar la primera por defecto
      if (!productId && response.categories.length > 0) {
        setFormData(prev => ({
          ...prev,
          categoryId: response.categories[0].id
        }));
      }
      
      // Si es edición, cargar el producto
      if (productId) {
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
      } else {
        // Resetear el formulario para nuevo producto
        setFormData({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          categoryId: response.categories[0]?.id || 0,
          image: ''
        });
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (err) {
      console.error('❌ Error al inicializar el formulario:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else if (err instanceof AxiosError) {
        const errorData = err.response?.data as ApiErrorResponse;
        setError(errorData?.message || err.message || 'Error al cargar los datos necesarios');
      } else {
        setError('Error al cargar los datos necesarios. Por favor, intenta de nuevo.');
      }
      
      toast.error('Error al cargar los datos necesarios');
      
      // Si es un error de red y no hemos intentado más de 3 veces, reintentamos
      if (err instanceof AxiosError && err.message === 'Network Error' && retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          console.log('🔄 Reintentando cargar datos...');
          initializeForm();
        }, 1000 * retryCount); // Espera progresiva
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      setRetryCount(0); // Resetear contador de reintentos
      initializeForm();
    }
  }, [isOpen, productId]);
  
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
    
    console.log("🔍 Iniciando envío del formulario con estos datos:", {
      name: formData.name,
      price: formData.price,
      stock: formData.stock,
      categoryId: formData.categoryId,
      description: formData.description?.length,
      tieneImagen: !!imageFile
    });
    
    // Validaciones básicas
    if (!formData.name?.trim()) {
      console.log("❌ Error: Nombre del producto vacío");
      toast.error('El nombre del producto es obligatorio');
      return;
    }
    
    if (formData.price === undefined || formData.price <= 0) {
      console.log("❌ Error: Precio inválido:", formData.price);
      toast.error('El precio debe ser mayor que 0');
      return;
    }
    
    if (formData.stock === undefined || formData.stock < 0) {
      console.log("❌ Error: Stock inválido:", formData.stock);
      toast.error('El stock no puede ser negativo');
      return;
    }
    
    if (!formData.categoryId) {
      console.log("❌ Error: Categoría no seleccionada");
      toast.error('Debes seleccionar una categoría');
      return;
    }
    
    try {
      console.log("🔄 Estableciendo estado submitting=true");
      setSubmitting(true);
      console.log("📊 Datos del formulario completos:", formData);
      console.log("📊 Tipo de precio:", typeof formData.price);
      console.log("📊 Tipo de stock:", typeof formData.stock);
      
      // Verificación más estricta de tipos
      if (typeof formData.price !== 'number' || typeof formData.stock !== 'number') {
        console.log("⚠️ Conversión forzada de tipos requerida");
      }
      
      // Adaptamos los datos para que coincidan con lo que espera el backend
      const productData = {
        ...formData,
        category_id: Number(formData.categoryId), // Forzar conversión a número
        categoryId: Number(formData.categoryId), // Mantener ambos campos para compatibilidad
        // Asegurarnos de que price y stock sean números
        price: Number(formData.price), // Más seguro que parseFloat
        stock: Number(formData.stock), // Más seguro que parseInt
      };
      
      // Verificación adicional después de la conversión
      console.log("🔍 Verificación de tipos después de la conversión:", {
        price: typeof productData.price, 
        stock: typeof productData.stock,
        category_id: typeof productData.category_id
      });
      
      console.log("📤 Datos adaptados para enviar al backend:", productData);
      console.log("📤 Token de autenticación presente:", !!localStorage.getItem('authToken'));
      
      let finalProduct;
      
      if (productId) {
        // Actualizar producto existente
        console.log("🔄 Actualizando producto existente con ID:", productId);
        finalProduct = await productService.updateProduct(productId, productData);
        console.log("✅ Producto actualizado:", finalProduct);
        toast.success('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        console.log("🆕 Creando nuevo producto...");
        try {
          finalProduct = await productService.createProduct(productData as Product);
          console.log("✅ Producto creado con éxito:", finalProduct);
          toast.success('Producto creado correctamente');
        } catch (createError) {
          console.error("⚠️ Error específico en createProduct:", createError);
          throw createError; // Re-lanzamos para que lo capture el catch principal
        }
      }
      
      // Si hay una nueva imagen, subirla
      if (imageFile && finalProduct && finalProduct.id) {
        console.log("🖼️ Subiendo imagen para producto ID:", finalProduct.id);
        try {
          const imageResponse = await productService.uploadProductImage(finalProduct.id, imageFile);
          console.log("✅ Imagen subida correctamente:", imageResponse);
          toast.success('Imagen subida correctamente');
        } catch (imageError) {
          console.error("⚠️ Error al subir la imagen:", imageError);
          toast.error('Producto creado pero hubo un error al subir la imagen');
          // No detenemos el flujo si falla la subida de la imagen
        }
      }
      
      console.log("✅ Proceso completado exitosamente");
      
      // Asegurarse de completar todas las tareas antes de cerrar
      // Primero actualizamos el estado de submitting
      setSubmitting(false);
      
      // Luego notificamos al componente padre y cerramos el modal
      console.log("🔄 Llamando a onSuccess()");
      onSuccess();
      
      // Luego limpiamos el formulario para la próxima vez
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) { // Tipando error como any para evitar errores de TypeScript
      console.error('❌ Error al guardar el producto:', error);
      console.log("❌ Tipo de error:", typeof error);
      console.log("❌ Error es instancia de Error:", error instanceof Error);
      
      if (error.response) {
        console.log("❌ Status del error:", error.response.status);
        console.log("❌ Datos de la respuesta:", error.response.data);
        console.log("❌ Headers de la respuesta:", error.response.headers);
      } else if (error.request) {
        console.log("❌ Error de request - no se recibió respuesta:", error.request);
      } else {
        console.log("❌ Error al configurar la solicitud:", error.message);
      }
      
      // Mostramos un mensaje de error más descriptivo si está disponible
      if (error.response && error.response.data && error.response.data.message) {
        console.log("❌ Mensaje de error del servidor:", error.response.data.message);
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.message) {
        console.log("❌ Mensaje de error general:", error.message);
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('Error desconocido al guardar el producto');
      }
      
      // Siempre asegurarnos de resetear el estado de envío
      console.log("🔄 Estableciendo estado submitting=false después del error");
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
          <DrawerTitle className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            {productId ? 'Editar Producto' : 'Nuevo Producto'}
          </DrawerTitle>
          <DrawerDescription>
            {productId ? 'Modifica los datos del producto existente' : 'Completa el formulario para crear un nuevo producto'}
          </DrawerDescription>
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
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Intentar de nuevo
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No hay categorías disponibles. Debes crear al menos una categoría antes de poder crear productos.</p>
              <Button onClick={onClose}>
                Entendido
              </Button>
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
              disabled={submitting || loading || categories.length === 0 || !!error}
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