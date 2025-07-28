import api from '@/lib/api';

export const serviceRequestAPI = {
  // Get all service requests with filtering
  getServiceRequests: async (params: Record<string, any>) => {
    const search = new URLSearchParams(params).toString();
    const res = await api.get(`/api/service-requests${search ? `?${search}` : ''}`);
    return res.data;
  },

  // Get single service request
  getServiceRequest: async (id: number) => {
    const res = await api.get(`/api/service-requests/${id}`);
    return res.data;
  },

  // Create new service request
  createServiceRequest: async (data: Record<string, any>) => {
    const res = await api.post('/api/service-requests', data);
    return res.data;
  },

  // Update service request
  updateServiceRequest: async (id: number, data: Record<string, any>) => {
    const res = await api.put(`/api/service-requests/${id}`, data);
    return res.data;
  },

  // Delete/Cancel service request
  deleteServiceRequest: async (id: number) => {
    const res = await api.delete(`/api/service-requests/${id}`);
    return res.data;
  },

  // Assign service request
  assignServiceRequest: async (id: number, data: Record<string, any>) => {
    const res = await api.put(`/api/service-requests/${id}/assign`, data);
    return res.data;
  },

  // Change status
  changeStatus: async (id: number, data: Record<string, any>) => {
    const res = await api.put(`/api/service-requests/${id}/status`, data);
    return res.data;
  },

  // Add comment
  addComment: async (id: number, data: Record<string, any>) => {
    const res = await api.post(`/api/service-requests/${id}/comments`, data);
    return res.data;
  },

  // Get activities
  getActivities: async (id: number) => {
    const res = await api.get(`/api/service-requests/${id}/activities`);
    return res.data;
  },

  // Upload attachment
  uploadAttachment: async (id: number, data: FormData) => {
    const res = await api.post(`/api/service-requests/${id}/attachments`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Get attachments
  getAttachments: async (id: number) => {
    const res = await api.get(`/api/service-requests/${id}/attachments`);
    return res.data;
  },

  // Generate work order
  generateWorkOrder: async (id: number) => {
    const res = await api.post(`/api/service-requests/${id}/generate-work-order`);
    return res.data;
  },

  // Get dashboard data
  getDashboard: async () => {
    const res = await api.get('/api/service-requests/dashboard');
    return res.data;
  },
};

export const serviceCategoryAPI = {
  // Get all service categories
  getServiceCategories: async (params: Record<string, any>) => {
    const search = new URLSearchParams(params).toString();
    const res = await api.get(`/api/service-categories${search ? `?${search}` : ''}`);
    return res.data;
  },

  // Get single service category
  getServiceCategory: async (id: number) => {
    const res = await api.get(`/api/service-categories/${id}`);
    return res.data;
  },

  // Create new service category
  createServiceCategory: async (data: Record<string, any>) => {
    const res = await api.post('/api/service-categories', data);
    return res.data;
  },

  // Update service category
  updateServiceCategory: async (id: number, data: Record<string, any>) => {
    const res = await api.put(`/api/service-categories/${id}`, data);
    return res.data;
  },

  // Delete service category
  deleteServiceCategory: async (id: number) => {
    const res = await api.delete(`/api/service-categories/${id}`);
    return res.data;
  },
}; 