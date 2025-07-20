import api from '@/lib/api';

export const departmentService = {
  getAllDepartments: async () => {
    const response = await api.get('/api/departments');
    return response.data.data.departments;
  },

  getDepartmentById: async (id: string) => {
    const response = await api.get(`/api/departments/${id}`);
    return response.data.data.department;
  },

  createDepartment: async (departmentData: any) => {
    const response = await api.post('/api/departments', departmentData);
    return response.data.data.department;
  },

  updateDepartment: async (id: string, departmentData: any) => {
    const response = await api.patch(`/api/departments/${id}`, departmentData);
    return response.data.data.department;
  },

  deleteDepartment: async (id: string) => {
    await api.delete(`/api/departments/${id}`);
  },
};
