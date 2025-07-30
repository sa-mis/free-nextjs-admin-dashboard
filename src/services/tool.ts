import api from '@/lib/api';

export interface Tool {
  id: number;
  name: string;
  description?: string;
  serial_number?: string;
  model_number?: string;
  tool_category_id: number;
  brand_id?: number;
  model_id?: number;
  vendor_id?: number;
  assigned_to?: number;
  status: 'available' | 'in_use' | 'maintenance' | 'calibration' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  purchase_date?: string;
  warranty_expiry_date?: string;
  next_calibration_date?: string;
  next_maintenance_date?: string;
  location?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Associations
  tool_category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  model?: {
    id: number;
    name: string;
  };
  vendor?: {
    id: number;
    name: string;
  };
  assigned_user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ToolDashboard {
  total: number;
  available: number;
  in_use: number;
  maintenance: number;
  calibration: number;
  retired: number;
  excellent_condition: number;
  good_condition: number;
  fair_condition: number;
  poor_condition: number;
  upcoming_calibration: number;
  upcoming_maintenance: number;
}

export const toolAPI = {
  // Get all tools
  getAll: async (params?: any): Promise<{ data: Tool[]; total: number }> => {
    const response = await api.get('/api/tools', { params });
    return response.data;
  },

  // Get single tool
  getById: async (id: number): Promise<Tool> => {
    const response = await api.get(`/api/tools/${id}`);
    return response.data;
  },

  // Create tool
  create: async (data: Partial<Tool>): Promise<Tool> => {
    const response = await api.post('/api/tools', data);
    return response.data;
  },

  // Update tool
  update: async (id: number, data: Partial<Tool>): Promise<Tool> => {
    const response = await api.put(`/api/tools/${id}`, data);
    return response.data;
  },

  // Delete tool
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/tools/${id}`);
  },

  // Get dashboard statistics
  getDashboard: async (): Promise<ToolDashboard> => {
    const response = await api.get('/api/tools/dashboard');
    return response.data;
  },

  // Get tool calibration history
  getCalibrations: async (toolId: number): Promise<any[]> => {
    const response = await api.get(`/api/tools/${toolId}/calibrations`);
    return response.data;
  },

  // Get tool maintenance history
  getMaintenance: async (toolId: number): Promise<any[]> => {
    const response = await api.get(`/api/tools/${toolId}/maintenance`);
    return response.data;
  },
}; 