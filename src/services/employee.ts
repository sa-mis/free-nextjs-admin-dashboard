import api from '@/lib/api';

export const employeeService = {
  getAllEmployees: async () => {
    const response = await api.get('/api/employees');
    return response.data.data.employees;
  },

  getEmployeeById: async (id: string) => {
    const response = await api.get(`/api/employees/${id}`);
    return response.data.data.employee;
  },

  createEmployee: async (employeeData: any) => {
    const response = await api.post('/api/employees', employeeData);
    return response.data.data.employee;
  },

  updateEmployee: async (id: string, employeeData: any) => {
    const response = await api.patch(`/api/employees/${id}`, employeeData);
    return response.data.data.employee;
  },

  deleteEmployee: async (id: string) => {
    await api.delete(`/api/employees/${id}`);
  },
};
