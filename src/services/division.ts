import api from '@/lib/api';

export const divisionService = {
  getAllDivisions: async () => {
    const response = await api.get('/api/divisions');
    return response.data.data.divisions;
  },

  getDivisionById: async (id: string) => {
    const response = await api.get(`/api/divisions/${id}`);
    return response.data.data.division;
  },

  createDivision: async (divisionData: any) => {
    const response = await api.post('/api/divisions', divisionData);
    return response.data.data.division;
  },

  updateDivision: async (id: string, divisionData: any) => {
    const response = await api.patch(`/api/divisions/${id}`, divisionData);
    return response.data.data.division;
  },

  deleteDivision: async (id: string) => {
    await api.delete(`/api/divisions/${id}`);
  },
};
