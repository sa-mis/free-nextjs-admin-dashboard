import api from '@/lib/api';

export const licenseAPI = {
  // Get all licenses
  getAll: async (params?: any) => {
    return api.get('/api/licenses', { params });
  },
  
  // Get single license by ID
  getById: async (license_id: number) => {
    return api.get(`/api/licenses/${license_id}`);
  },
  
  // Create new license
  create: async (data: any) => {
    return api.post('/api/licenses', data);
  },
  
  // Update license
  update: async (license_id: number, data: any) => {
    return api.put(`/api/licenses/${license_id}`, data);
  },

  // Delete license
  delete: async (license_id: number) => {
    return api.delete(`/api/licenses/${license_id}`);
  },

  // Get license dashboard data
  getDashboard: async () => {
    return api.get('/api/licenses/dashboard');
  },

  // Assign license to assets or users (bulk)
  assignLicense: async (license_id: number, data: { asset_ids?: number[]; user_ids?: number[]; assigned_date?: string; notes?: string; seats_assigned?: number }) => {
    return api.post(`/api/licenses/${license_id}/assign`, data);
  },

  // Unassign license from asset or user
  unassignLicense: async (assignment_id: number) => {
    return api.delete(`/api/licenses/assignment/${assignment_id}`);
  },

  // Get all assignments for a license (history)
  getAssignments: async (license_id: number, status?: string) => {
    return api.get(`/api/licenses/${license_id}/assignments`, { params: { status } });
  },
}; 