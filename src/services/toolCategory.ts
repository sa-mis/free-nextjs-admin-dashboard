import api from '@/lib/api';

export interface ToolCategory {
  id: number;
  name: string;
  description?: string;
  requires_calibration: boolean;
  calibration_frequency_days?: number;
  requires_maintenance: boolean;
  maintenance_frequency_days?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tools_count?: number;
}

export interface ToolCategoryDashboard {
  total: number;
  active: number;
  inactive: number;
  with_calibration: number;
  with_maintenance: number;
}

export const toolCategoryAPI = {
  // Get all tool categories
  getAll: async (params?: any): Promise<{ data: ToolCategory[]; total: number }> => {
    const response = await api.get('/tool-categories', { params });
    return response.data;
  },

  // Get single tool category
  getById: async (id: number): Promise<ToolCategory> => {
    const response = await api.get(`/tool-categories/${id}`);
    return response.data;
  },

  // Create tool category
  create: async (data: Partial<ToolCategory>): Promise<ToolCategory> => {
    const response = await api.post('/tool-categories', data);
    return response.data;
  },

  // Update tool category
  update: async (id: number, data: Partial<ToolCategory>): Promise<ToolCategory> => {
    const response = await api.put(`/tool-categories/${id}`, data);
    return response.data;
  },

  // Delete tool category
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tool-categories/${id}`);
  },

  // Get dashboard statistics
  getDashboard: async (): Promise<ToolCategoryDashboard> => {
    const response = await api.get('/tool-categories/dashboard');
    return response.data;
  },
}; 