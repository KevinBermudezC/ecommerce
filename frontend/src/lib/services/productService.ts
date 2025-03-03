import api from '@/utils/api';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
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
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData: Product): Promise<Product> {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }

  async uploadProductImage(id: number, file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post(`/products/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for product ${id}:`, error);
      throw error;
    }
  }
}

export default new ProductService(); 