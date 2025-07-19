import api from '@/lib/api';

export const companyService = {
  getAllCompanies: async () => {
    const response = await api.get('/api/companies');
    return response.data.data.companies;
  },

  getCompanyById: async (id: string) => {
    const response = await api.get(`/api/companies/${id}`);
    return response.data.data.company;
  },

  createCompany: async (companyData: any) => {
    const response = await api.post('/api/companies', companyData);
    return response.data.data.company;
  },

  updateCompany: async (id: string, companyData: any) => {
    const response = await api.patch(`/api/companies/${id}`, companyData);
    return response.data.data.company;
  },

  deleteCompany: async (id: string) => {
    await api.delete(`/api/companies/${id}`);
  },
};
