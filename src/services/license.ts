import api from '@/lib/api';

export const licenseAPI = {
  // ...other license API methods...
  create: async (data: any) => {
    return api.post('/api/licenses', data);
  },
  
  update: async (license_id: number, data: any) => {
    return api.put(`/api/licenses/${license_id}`, data);
  },

  // Assign license to assets or users (bulk)
  assignLicense: async (license_id: number, data: { asset_ids?: number[]; user_ids?: number[]; assigned_date?: string; notes?: string }) => {
    return api.post(`/api/licenses/${license_id}/assign`, data);
  },

  // Unassign license from asset or user
  unassignLicense: async (assignment_id: number) => {
    return api.delete(`/api/licenses/assignment/${assignment_id}`);
  },

  // Get all assignments for a license (history)
  getAssignments: async (license_id: number) => {
    return api.get(`/api/licenses/${license_id}/assignments`);
  },
}; 