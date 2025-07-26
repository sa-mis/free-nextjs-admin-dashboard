import api from '@/lib/api';

export const roleAPI = {
  getRoles: async (params: Record<string, any>) => {
    const search = new URLSearchParams(params).toString();
    const res = await api.get(`/api/roles${search ? `?${search}` : ''}`);
    return res.data;
  },

  createRole: async (data: Record<string, any>) => {
    const res = await api.post('/api/roles', data);
    return res.data;
  },

  updateRole: async (id: number, data: Record<string, any>) => {
    const res = await api.put(`/api/roles/${id}`, data);
    return res.data;
  },

  deleteRole: async (id: number) => {
    const res = await api.delete(`/api/roles/${id}`);
    return res.data;
  },

  getRoleById: async (id: number) => {
    const res = await api.get(`/api/roles/${id}`);
    return res.data;
  },

  assignPermissions: async (roleId: number, permissionIds: number[]) => {
    const res = await api.put(`/api/roles/${roleId}/permissions`, { permission_ids: permissionIds });
    return res.data;
  },

  getRolePermissions: async (roleId: number) => {
    const res = await api.get(`/api/roles/${roleId}/permissions`);
    return res.data;
  },

  getRoleDashboard: async () => {
    const res = await api.get('/api/roles/dashboard');
    return res.data;
  },
}; 