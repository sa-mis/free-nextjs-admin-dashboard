import api from '@/lib/api';

export const userAPI = {
  getUsers: async (params: Record<string, any>) => {
    const search = new URLSearchParams(params).toString();
    const res = await api.get(`/api/users${search ? `?${search}` : ''}`);
    return res.data;
  },

  createUser: async (data: Record<string, any>) => {
    const res = await api.post('/api/users', data);
    return res.data;
  },

  updateUser: async (id: number, data: Record<string, any>) => {
    const res = await api.put(`/api/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: number) => {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  },

  getUserById: async (id: number) => {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  },

  assignRole: async (userId: number, roleId: number) => {
    const res = await api.put(`/api/users/${userId}/role`, { role_id: roleId });
    return res.data;
  },

  getUserDashboard: async () => {
    const res = await api.get('/api/users/dashboard');
    return res.data;
  },
}; 