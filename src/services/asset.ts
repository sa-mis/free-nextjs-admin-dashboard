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

export interface AssetCategory {
  id: number;
  code?: string;
  name: string;
  description?: string;
  parent_id?: number;
  parent_name?: string;
  asset_count: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  code?: string;
  name: string;
  description?: string;
  website?: string;
  contact_info?: string;
  is_active: boolean;
  model_count: number;
  asset_count: number;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: number;
  brand_id: number;
  code?: string;
  name: string;
  description?: string;
  specifications?: any;
  is_active: boolean;
  brand_name?: string;
  asset_count: number;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: number;
  code?: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_id?: string;
  asset_count: number;
  brand_count: number;
  created_at: string;
  updated_at: string;
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

  // Get asset categories
  getCategories: async (query?: any) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/api/assets/categories?${params.toString()}`);
    return response.data;
  },

  // Get category hierarchy
  getCategoryHierarchy: async () => {
    const response = await api.get('/api/assets/categories/hierarchy');
    return response.data;
  },

  // Get brands
  getBrands: async (query?: any) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/api/assets/brands?${params.toString()}`);
    return response.data;
  },

  // Get models by brand
  getModelsByBrand: async (brandId: number) => {
    const response = await api.get(`/api/assets/brands/${brandId}/models`);
    return response.data;
  },

  // Get vendors
  getVendors: async (query?: any) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/api/assets/vendors?${params.toString()}`);
    return response.data;
  },

  // Get all models
  getModels: async (query?: any) => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/api/assets/models?${params.toString()}`);
    return response.data;
  },

  // Create category
  createCategory: async (data: Partial<AssetCategory>) => {
    const response = await api.post('/api/assets/categories', data);
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, data: Partial<AssetCategory>) => {
    const response = await api.put(`/api/assets/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number) => {
    const response = await api.delete(`/api/assets/categories/${id}`);
    return response.data;
  },

  // Create brand
  createBrand: async (data: Partial<Brand>) => {
    const response = await api.post('/api/assets/brands', data);
    return response.data;
  },

  // Update brand
  updateBrand: async (id: number, data: Partial<Brand>) => {
    const response = await api.put(`/api/assets/brands/${id}`, data);
    return response.data;
  },

  // Delete brand
  deleteBrand: async (id: number) => {
    const response = await api.delete(`/api/assets/brands/${id}`);
    return response.data;
  },

  // Create model
  createModel: async (data: Partial<Model>) => {
    const response = await api.post('/api/assets/models', data);
    return response.data;
  },

  // Update model
  updateModel: async (id: number, data: Partial<Model>) => {
    const response = await api.put(`/api/assets/models/${id}`, data);
    return response.data;
  },

  // Delete model
  deleteModel: async (id: number) => {
    const response = await api.delete(`/api/assets/models/${id}`);
    return response.data;
  },

  // Create vendor
  createVendor: async (data: Partial<Vendor>) => {
    const response = await api.post('/api/assets/vendors', data);
    return response.data;
  },

  // Update vendor
  updateVendor: async (id: number, data: Partial<Vendor>) => {
    const response = await api.put(`/api/assets/vendors/${id}`, data);
    return response.data;
  },

  // Delete vendor
  deleteVendor: async (id: number) => {
    const response = await api.delete(`/api/assets/vendors/${id}`);
    return response.data;
  },

  // Assign asset
  assign: async (id: number, data: { assigned_to: number }) => {
    const response = await api.patch(`/api/assets/${id}/assign`, data);
    return response.data;
  },

  // Transfer asset
  transfer: async (id: number, data: { to_division_id: number; to_location: string; to_assigned_to: number; reason?: string }) => {
    const response = await api.post(`/api/assets/${id}/transfer`, data);
    return response.data;
  },

  // Get asset history
  getHistory: async (id: number) => {
    const response = await api.get(`/api/assets/${id}/history`);
    return response.data;
  }
}; 