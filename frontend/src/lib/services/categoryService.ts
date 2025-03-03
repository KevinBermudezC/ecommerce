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
      const response = await api.get(`/categories?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
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
}

export default new CategoryService(); 