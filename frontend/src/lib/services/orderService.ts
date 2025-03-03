import api from '@/utils/api';

export interface OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  productName?: string;
}

export interface Order {
  id?: number;
  userId: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
  userName?: string;
  userEmail?: string;
}

interface OrdersResponse {
  orders: Order[];
  totalCount: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  orderGrowth: number;
  revenueGrowth: number;
  recentOrders: Order[];
}

class OrderService {
  async getOrders(page = 1, limit = 10, status?: string): Promise<OrdersResponse> {
    try {
      let url = `/orders?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderById(id: number): Promise<Order> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
  }

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order ${id}:`, error);
      throw error;
    }
  }

  async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  }

  async getOrdersByUser(userId: number, page = 1, limit = 10): Promise<OrdersResponse> {
    try {
      const response = await api.get(`/users/${userId}/orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      throw error;
    }
  }
}

export default new OrderService(); 