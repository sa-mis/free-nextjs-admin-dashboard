import api from '@/lib/api';

export const accessoryAPI = {
  getAccessoryDashboard: async () => {
    const res = await api.get('/api/accessories/dashboard');
    return res.data;
  },

  getAccessories: async (params: Record<string, any>) => {
    const search = new URLSearchParams(params).toString();
    const res = await api.get(`/api/accessories${search ? `?${search}` : ''}`);
    return res.data;
  },

  createAccessory: async (data: Record<string, any>) => {
    const res = await api.post('/api/accessories', data);
    return res.data;
  },

  updateAccessory: async (id: number, data: Record<string, any>) => {
    const res = await api.put(`/api/accessories/${id}`, data);
    return res.data;
  },

  deleteAccessory: async (id: number) => {
    const res = await api.delete(`/api/accessories/${id}`);
    return res.data;
  },


  assignAccessory: async (accessory_id: number, data: Record<string, any>) => {
    const res = await api.post(`/api/accessories/${accessory_id}/assign`, data);
    return res.data;
  },


  addStockMovement: async (accessory_id: number, data: Record<string, any>) => {
    const res = await api.post(`/api/accessories/${accessory_id}/stock-movement`, data);
    return res.data;
  },

  getAccessoryAssignments: async (accessory_id: number) => {
    const res = await api.get(`/api/accessories/${accessory_id}/assignments`);
    return res.data;
  },

  getStockMovements: async (accessory_id: number) => {
    const res = await api.get(`/api/accessories/${accessory_id}/stock-movements`);
    return res.data;
  },
}