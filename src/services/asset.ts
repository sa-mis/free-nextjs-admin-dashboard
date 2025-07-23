import api from '@/lib/api';

export interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  description?: string;
  category_id?: number;
  brand_id?: number;
  model_id?: number;
  serial_number?: string;
  purchase_date?: string;
  purchase_order?: string;
  received_date?: string;
  purchase_price?: number;
  vendor_id?: number;
  warranty_start_date?: string;
  warranty_end_date?: string;
  location?: string;
  division_id?: number;
  assigned_to?: number;
  status: 'active' | 'inactive' | 'maintenance' | 'disposed';
  condition_status: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  created_at: string;
  updated_at: string;
  // Related data
  category_name?: string;
  brand_name?: string;
  model_name?: string;
  vendor_name?: string;
  division_name?: string;
  assigned_user_name?: string;
}

export interface AssetDashboardStats {
  total_assets: number;
  active_assets: number;
  maintenance_assets: number;
  inactive_assets: number;
  disposed_assets: number;
  excellent_condition: number;
  good_condition: number;
  fair_condition: number;
  poor_condition: number;
  total_value: number;
}

export interface AssetQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category_id?: number;
  division_id?: number;
  assigned_to?: number;
}

export const assetAPI = {
  // Get all assets
  getAll: async (query?: AssetQuery) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/api/assets?${params.toString()}`);
    return response.data;
  },

  // Get single asset
  getById: async (id: number) => {
    const response = await api.get(`/api/assets/${id}`);
    return response.data;
  },

  // Create asset
  create: async (data: Partial<Asset>) => {
    const response = await api.post('/api/assets', data);
    return response.data;
  },

  // Update asset
  update: async (id: number, data: Partial<Asset>) => {
    const response = await api.put(`/api/assets/${id}`, data);
    return response.data;
  },

  // Delete asset
  delete: async (id: number) => {
    const response = await api.delete(`/api/assets/${id}`);
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/api/assets/dashboard/stats');
    return response.data;
  },

  // Assign asset
  assign: async (id: number, data: { assigned_to: number }) => {
    const response = await api.patch(`/api/${id}/assign`, data);
    return response.data;
  },

  // Transfer asset
  transfer: async (id: number, data: { to_division_id: number; to_location: string; to_assigned_to: number; reason?: string }) => {
    const response = await api.post(`/api/${id}/transfer`, data);
    return response.data;
  },

  // Get asset history
  getHistory: async (id: number) => {
    const response = await api.get(`/api/${id}/history`);
    return response.data;
  }
}; 