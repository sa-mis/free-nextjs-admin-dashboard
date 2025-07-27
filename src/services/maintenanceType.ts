import api from '@/lib/api';

export interface MaintenanceType {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTypeDashboard {
  total: number;
  active: number;
  inactive: number;
}

export const maintenanceTypeAPI = {
  // Get all maintenance types
  getAll: async (params?: any): Promise<{ data: MaintenanceType[]; total: number }> => {
    const response = await api.get('/maintenance-types', { params });
    return response.data;
  },

  // Get single maintenance type
  getById: async (id: number): Promise<MaintenanceType> => {
    const response = await api.get(`/maintenance-types/${id}`);
    return response.data;
  },

  // Create maintenance type
  create: async (data: Partial<MaintenanceType>): Promise<MaintenanceType> => {
    const response = await api.post('/maintenance-types', data);
    return response.data;
  },

  // Update maintenance type
  update: async (id: number, data: Partial<MaintenanceType>): Promise<MaintenanceType> => {
    const response = await api.put(`/maintenance-types/${id}`, data);
    return response.data;
  },

  // Delete maintenance type
  delete: async (id: number): Promise<void> => {
    await api.delete(`/maintenance-types/${id}`);
  },

  // Get dashboard statistics
  getDashboard: async (): Promise<MaintenanceTypeDashboard> => {
    const response = await api.get('/maintenance-types/dashboard');
    return response.data;
  },
}; 