import api from "@/lib/api";

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
  
export const modelAPI = {
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
    
    const response = await api.get(`/api/models?${params.toString()}`);
    return response.data;
  },

  // // Create model
  // createModel: async (data: Partial<Model>) => {
  //   const response = await api.post('/api/models', data);
  //   return response.data;
  // },

  // // Update model
  // updateModel: async (id: number, data: Partial<Model>) => {
  //   const response = await api.put(`/api/models/${id}`, data);
  //   return response.data;
  // },

  // // Delete model
  // deleteModel: async (id: number) => {
  //   const response = await api.delete(`/api/models/${id}`);
  //   return response.data;
  // },

  getAll: async () => {
    const response = await api.get('/api/models');
    return response.data;  
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/models/${id}`);
    return response.data;
  },
  create: async (data: Partial<Model>) => {
    const response = await api.post('/api/models', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Model>) => {
    const response = await api.put(`/api/models/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/models/${id}`);
    return response.data;
  },
  getModelsByBrand: async (brandId: number) => {
    const response = await api.get(`/api/models/brand/${brandId}`);
    return response.data;
  },
}