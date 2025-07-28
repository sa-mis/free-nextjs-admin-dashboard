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
    console.log('assignPermissions called with roleId:', roleId);
    console.log('assignPermissions called with permissionIds:', permissionIds);
    
    // Ensure roleId is a number
    const roleIdNum = parseInt(roleId.toString());
    if (isNaN(roleIdNum)) {
      throw new Error('Invalid role ID');
    }
    
    // Ensure permissionIds is an array of numbers
    const permissionIdsNum = permissionIds.map(id => parseInt(id.toString())).filter(id => !isNaN(id));
    
    const payload = { permission_ids: permissionIdsNum };
    console.log('assignPermissions payload:', payload);
    console.log('assignPermissions payload type:', typeof payload);
    console.log('assignPermissions payload JSON:', JSON.stringify(payload));
    
    const res = await api.put(`/api/roles/${roleIdNum}/permissions`, payload);
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