import axios from 'axios';
import api from '@/utils/api';
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token?: string; // Make token optional since it might not be returned when using HTTP-only cookies
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/sign-in', credentials);
      // No need to store token in localStorage as backend uses HTTP-only cookies
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/sign-up', userData);
      // No need to store token in localStorage as backend uses HTTP-only cookies
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error occurred');
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get current user');
      }
      throw new Error('Network error occurred');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/sign-out');
      // No need to remove token from localStorage as backend handles cookie expiration
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};

export default authService;