import api from '@/utils/api';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

interface UsersResponse {
  users: User[];
  totalCount: number;
}

class UserService {
  async getUsers(page = 1, limit = 10): Promise<UsersResponse> {
    try {
      const response = await api.get(`/users?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  async getUserStats(): Promise<{ 
    totalUsers: number, 
    newUsersThisMonth: number,
    userGrowth: number 
  }> {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  }
}

export default new UserService(); 