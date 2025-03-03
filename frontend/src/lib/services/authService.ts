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
    role?: string;
  };
  token?: string; // Make token optional since it might not be returned when using HTTP-only cookies
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/sign-in', credentials);
      // Guardar el token en localStorage si se recibe
      if (response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
      }
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
      // Guardar el token en localStorage si se recibe
      if (response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
      }
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error occurred');
    }
  },

  getCurrentUser: async (): Promise<AuthResponse | null> => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/sign-out');
      // Eliminar token del localStorage
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error during logout:', error);
      // Eliminar token de todas formas
      localStorage.removeItem('authToken');
    }
  }
};

export default authService;