import api from "@/lib/api";

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
  
export const categoryAPI = {
  getAll: async () => {
    const response = await api.get('/api/categories');
    return response.data;  
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },
  create: async (data: Partial<AssetCategory>) => {
    const response = await api.post('/api/categories', data);
    return response.data;
  },
  update: async (id: number, data: Partial<AssetCategory>) => {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/categories/${id}`);
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
    
    const response = await api.get(`/api/categories?${params.toString()}`);
    return response.data;
  },

  // Get category hierarchy
  getCategoryHierarchy: async () => {
    const response = await api.get('/api/categories/hierarchy');
    return response.data;
  },
}