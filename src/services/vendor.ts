import api from "@/lib/api";

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
  
export const vendorAPI = {
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
    
    const response = await api.get(`/api/vendors?${params.toString()}`);
    return response.data;
  },

  // // Create vendor
  // createVendor: async (data: Partial<Vendor>) => {
  //   const response = await api.post('/api/vendors', data);
  //   return response.data;
  // },

  // // Update vendor
  // updateVendor: async (id: number, data: Partial<Vendor>) => {
  //   const response = await api.put(`/api/vendors/${id}`, data);
  //   return response.data;
  // },

  // // Delete vendor
  // deleteVendor: async (id: number) => {
  //   const response = await api.delete(`/api/vendors/${id}`);
  //   return response.data;
  // },

  getAll: async () => {
    const response = await api.get('/api/vendors');
    return response.data;  
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/vendors/${id}`);
    return response.data;
  },
  create: async (data: Partial<Vendor>) => {
    const response = await api.post('/api/vendors', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Vendor>) => {
    const response = await api.put(`/api/vendors/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/vendors/${id}`);
    return response.data;
  },
}