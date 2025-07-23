import api from "@/lib/api";

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
  
export const brandAPI = {
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
    
    const response = await api.get(`/api/brands?${params.toString()}`);
    return response.data;
  },

  // Get models by brand
  getModelsByBrand: async (brandId: number) => {
    const response = await api.get(`/api/brands/${brandId}/models`);
    return response.data;
  },

  // // Create brand
  // createBrand: async (data: Partial<Brand>) => {
  //   const response = await api.post('/api/brands', data);
  //   return response.data;
  // },

  // // Update brand
  // updateBrand: async (id: number, data: Partial<Brand>) => {
  //   const response = await api.put(`/api/brands/${id}`, data);
  //   return response.data;
  // },

  // // Delete brand
  // deleteBrand: async (id: number) => {
  //   const response = await api.delete(`/api/brands/${id}`);
  //   return response.data;
  // },

  getAll: async () => {
    const response = await api.get('/api/brands');
    return response.data;  
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/brands/${id}`);
    return response.data;
  },
  create: async (data: Partial<Brand>) => {
    const response = await api.post('/api/brands', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Brand>) => {
    const response = await api.put(`/api/brands/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/brands/${id}`);
    return response.data;
  },
}