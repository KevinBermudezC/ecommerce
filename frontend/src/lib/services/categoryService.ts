import api from '@/utils/api';

export interface Category {
  id?: number;
  name: string;
  description?: string;
}

interface CategoriesResponse {
  categories: Category[];
  totalCount: number;
}

class CategoryService {
  async getCategories(page = 1, limit = 100): Promise<CategoriesResponse> {
    try {
      console.log('🔍 Iniciando getCategories con parámetros:', { page, limit });
      console.log('🔗 URL de la API:', import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api');
      
      const response = await api.get(`/categories?page=${page}&limit=${limit}`);
      console.log('✅ Respuesta de getCategories:', response.data);
      
      if (!response.data || !Array.isArray(response.data.categories)) {
        console.error('❌ Respuesta inválida de getCategories:', response.data);
        throw new Error('Formato de respuesta inválido');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error detallado en getCategories:', {
        error,
        response: error.response,
        request: error.request,
        message: error.message
      });
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
  }

  async createCategory(categoryData: Category): Promise<Category> {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  }

  async uploadCategoryImage(id: number, file: File): Promise<{ imageUrl: string }> {
    try {
      console.log(`Subiendo imagen para categoría con ID: ${id}`);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post(`/categories/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload image response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error subiendo imagen para categoría ${id}:`, error);
      throw error;
    }
  }
}

export default new CategoryService(); 