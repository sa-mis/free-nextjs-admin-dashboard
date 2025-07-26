import api from '@/lib/api';

export const permissionAPI = {
  getPermissions: async (params: Record<string, any>) => {
    const search = new URLSearchParams(params).toString();
    const res = await api.get(`/api/permissions${search ? `?${search}` : ''}`);
    return res.data;
  },

  createPermission: async (data: Record<string, any>) => {
    const res = await api.post('/api/permissions', data);
    return res.data;
  },

  updatePermission: async (id: number, data: Record<string, any>) => {
    const res = await api.put(`/api/permissions/${id}`, data);
    return res.data;
  },

  deletePermission: async (id: number) => {
    const res = await api.delete(`/api/permissions/${id}`);
    return res.data;
  },

  getPermissionById: async (id: number) => {
    const res = await api.get(`/api/permissions/${id}`);
    return res.data;
  },

  getPermissionDashboard: async () => {
    const res = await api.get('/api/permissions/dashboard');
    return res.data;
  },
}; 