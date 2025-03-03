import api from '@/utils/api';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  category_id?: number;
  image?: string;
  category?: {
    id: number;
    name: string;
  };
}

interface ProductsResponse {
  products: Product[];
  totalCount: number;
}

interface BackendResponse {
  success: boolean;
  message: string;
  data: any;
}

class ProductService {
  async getProducts(page = 1, limit = 10, categoryId?: number, search?: string): Promise<ProductsResponse> {
    try {
      let url = `/products?page=${page}&limit=${limit}`;
      
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      console.log('Fetching products with URL:', url);
      const response = await api.get(url);
      console.log('Products response:', response.data);
      
      if (response.data.success && response.data.data) {
        return {
          products: response.data.data,
          totalCount: response.data.totalCount || response.data.data.length
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      console.log(`Fetching product with ID: ${id}`);
      const response = await api.get(`/products/${id}`);
      console.log('Product response:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData: Product): Promise<Product> {
    try {
      // Validación previa
      if (!productData.name) {
        console.error('❌ Error: Falta el nombre del producto');
        throw new Error('El nombre del producto es obligatorio');
      }
      if (productData.price === undefined || isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
        console.error('❌ Error: Precio inválido:', productData.price);
        throw new Error('El precio debe ser un número mayor que 0');
      }
      if (productData.stock === undefined || isNaN(Number(productData.stock)) || Number(productData.stock) < 0) {
        console.error('❌ Error: Stock inválido:', productData.stock);
        throw new Error('El stock debe ser un número no negativo');
      }
      if (!productData.categoryId && !productData.category_id) {
        console.error('❌ Error: Falta la categoría');
        throw new Error('La categoría es obligatoria');
      }

      // Asegurar que los datos son del tipo correcto
      const formattedData = {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        categoryId: Number(productData.categoryId || productData.category_id),
        category_id: Number(productData.categoryId || productData.category_id)
      };

      console.log('🚀 Iniciando createProduct con datos:', formattedData);
      console.log('🔍 Tipos de datos enviados:', {
        name: typeof formattedData.name,
        price: typeof formattedData.price,
        stock: typeof formattedData.stock,
        categoryId: typeof formattedData.categoryId,
        category_id: typeof formattedData.category_id
      });
      
      console.log('🔗 URL de la API:', import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api');
      
      try {
        const response = await api.post('/products', formattedData);
        console.log('✅ Respuesta createProduct completa:', response);
        console.log('✅ Status de la respuesta:', response.status);
        console.log('✅ Datos de respuesta createProduct:', response.data);
        
        if (response.data.success && response.data.data) {
          console.log('✅ Producto creado exitosamente, devolviendo data:', response.data.data);
          return response.data.data;
        } else if (response.data) {
          console.warn('⚠️ Respuesta inesperada del servidor:', response.data);
          if (response.data.success === false && response.data.message) {
            throw new Error(response.data.message);
          }
          return response.data;
        } else {
          console.error('❌ No se recibieron datos del servidor');
          throw new Error('No se recibieron datos del servidor');
        }
      } catch (apiError: any) {
        console.error('❌ Error específico durante la llamada API:', apiError);
        
        if (apiError.response) {
          console.error('❌ Respuesta de error del servidor:', {
            status: apiError.response.status,
            data: apiError.response.data,
            headers: apiError.response.headers
          });
          
          // Mostrar mensaje específico del servidor si está disponible
          if (apiError.response.data && apiError.response.data.message) {
            throw new Error(apiError.response.data.message);
          }
        } else if (apiError.request) {
          console.error('❌ No se recibió respuesta del servidor:', apiError.request);
          throw new Error('No se recibió respuesta del servidor. Verifica tu conexión a internet.');
        } else {
          console.error('❌ Error en la configuración de la solicitud:', apiError.message);
        }
        
        throw apiError;
      }
    } catch (error: unknown) {
      console.error('❌ Error general en createProduct:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: any, status: number } };
        console.error('❌ Datos detallados del error:', axiosError.response.data);
        console.error('❌ Estado HTTP del error:', axiosError.response.status);
      }
      throw error;
    }
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    try {
      console.log(`🔄 Iniciando updateProduct para ID ${id} con datos:`, productData);
      console.log('🔍 Tipos de datos enviados:', {
        name: typeof productData.name,
        price: typeof productData.price,
        stock: typeof productData.stock,
        categoryId: typeof productData.categoryId,
        category_id: typeof productData.category_id
      });
      
      const response = await api.put(`/products/${id}`, productData);
      console.log('✅ Respuesta updateProduct completa:', response);
      console.log('✅ Status de la respuesta:', response.status);
      console.log('✅ Datos de respuesta updateProduct:', response.data);
      
      if (response.data.success && response.data.data) {
        console.log('✅ Producto actualizado exitosamente, devolviendo data:', response.data.data);
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      console.log(`Deleting product with ID: ${id}`);
      const response = await api.delete(`/products/${id}`);
      console.log('Delete product response:', response.data);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }

  async uploadProductImage(id: number, file: File): Promise<{ imageUrl: string }> {
    try {
      console.log(`Uploading image for product with ID: ${id}`);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post(`/products/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload image response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for product ${id}:`, error);
      throw error;
    }
  }
}

export default new ProductService(); 