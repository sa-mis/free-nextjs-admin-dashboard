import api from '../lib/api';

// Company interfaces
export interface Company {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {}

// Department interfaces
export interface Department {
  id: number;
  company_id: number;
  code: string;
  name: string;
  manager_id: number | null;
  created_at: string;
  updated_at: string;
  company?: Company;
  manager?: User;
}

export interface CreateDepartmentData {
  company_id: number;
  code: string;
  name: string;
  manager_id?: number;
}

export interface UpdateDepartmentData extends Partial<CreateDepartmentData> {}

// Division interfaces
export interface Division {
  id: number;
  department_id: number;
  code: string;
  name: string;
  manager_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department?: Department;
  manager?: User;
}

export interface CreateDivisionData {
  department_id: number;
  code: string;
  name: string;
  manager_id?: number;
  is_active?: boolean;
}

export interface UpdateDivisionData extends Partial<CreateDivisionData> {}

// Employee interfaces
export interface Employee {
  id: number;
  user_id: number;
  code: string;
  first_name: string;
  last_name: string;
  phone: string;
  position: string;
  hire_date: string;
  termination_date: string | null;
  supervisor_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  supervisor?: Employee;
}

export interface CreateEmployeeData {
  user_id: number;
  code: string;
  first_name: string;
  last_name: string;
  phone: string;
  position: string;
  hire_date: string;
  termination_date?: string;
  supervisor_id?: number;
  is_active?: boolean;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {}

// User interface for relationships
export interface User {
  id: number;
  username: string;
  email: string;
  role_id: number | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// Company API
export const companyService = {
  getAll: async (): Promise<Company[]> => {
    try {
      const response = await api.get('/api/companies');
      console.log("API Response:", response); // Debug log
      // Handle different response structures
      const data = response.data?.companies || response.data?.data?.companies || response.data?.data || response.data || [];
      console.log("Processed data:", data); // Debug log
      return data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      // For development, return mock data if API fails
      if (error.response?.data?.message === "You are not logged in! Please log in to get access.") {
        console.log("Authentication required, returning mock data for development");
        return [
          {
            id: 1,
            code: "COMP001",
            name: "Sample Company 1",
            address: "123 Main St, City, Country",
            phone: "+1234567890",
            email: "info@samplecompany1.com",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          {
            id: 2,
            code: "COMP002", 
            name: "Sample Company 2",
            address: "456 Oak Ave, Town, Country",
            phone: "+0987654321",
            email: "info@samplecompany2.com",
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z"
          }
        ];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Company> => {
    const response = await api.get(`/api/companies/${id}`);
    return response.data;
  },

  create: async (data: CreateCompanyData): Promise<Company> => {
    const response = await api.post('/api/companies', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCompanyData): Promise<Company> => {
    const response = await api.put(`/api/companies/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/companies/${id}`);
  },
};

// Department API
export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await api.get('/api/departments');
      console.log("Department API Response:", response); // Debug log
      // Handle different response structures
      const data = response.data?.departments || response.data?.data?.departments || response.data?.data || response.data || [];
      console.log("Department processed data:", data); // Debug log
      return data;
    } catch (error: any) {
      console.error("Department API Error:", error.response?.data || error.message);
      // For development, return mock data if API fails
      if (error.response?.data?.message === "You are not logged in! Please log in to get access.") {
        console.log("Authentication required, returning mock department data for development");
        return [
          {
            id: 1,
            company_id: 1,
            code: "DEPT001",
            name: "Engineering",
            manager_id: 1,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            company: {
              id: 1,
              code: "COMP001",
              name: "Sample Company 1",
              address: "123 Main St, City, Country",
              phone: "+1234567890",
              email: "info@samplecompany1.com",
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z"
            }
          },
          {
            id: 2,
            company_id: 1,
            code: "DEPT002",
            name: "Marketing",
            manager_id: 2,
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z",
            company: {
              id: 1,
              code: "COMP001",
              name: "Sample Company 1",
              address: "123 Main St, City, Country",
              phone: "+1234567890",
              email: "info@samplecompany1.com",
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z"
            }
          }
        ];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Department> => {
    const response = await api.get(`/api/departments/${id}`);
    return response.data;
  },

  getByCompany: async (companyId: number): Promise<Department[]> => {
    const response = await api.get(`/api/companies/${companyId}/departments`);
    return response.data;
  },

  create: async (data: CreateDepartmentData): Promise<Department> => {
    const response = await api.post('/api/departments', data);
    return response.data;
  },

  update: async (id: number, data: UpdateDepartmentData): Promise<Department> => {
    const response = await api.put(`/api/departments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/departments/${id}`);
  },
};

// Division API
export const divisionService = {
  getAll: async (): Promise<Division[]> => {
    try {
      const response = await api.get('/api/divisions');
      console.log("Division API Response:", response); // Debug log
      // Handle different response structures
      const data = response.data?.divisions || response.data?.data?.divisions || response.data?.data || response.data || [];
      console.log("Division processed data:", data); // Debug log
      return data;
    } catch (error: any) {
      console.error("Division API Error:", error.response?.data || error.message);
      // For development, return mock data if API fails
      if (error.response?.data?.message === "You are not logged in! Please log in to get access.") {
        console.log("Authentication required, returning mock division data for development");
        return [
          {
            id: 1,
            department_id: 1,
            code: "DIV001",
            name: "Software Development",
            manager_id: 1,
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            department: {
              id: 1,
              company_id: 1,
              code: "DEPT001",
              name: "Engineering",
              manager_id: 1,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z"
            }
          },
          {
            id: 2,
            department_id: 2,
            code: "DIV002",
            name: "Digital Marketing",
            manager_id: 2,
            is_active: true,
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z",
            department: {
              id: 2,
              company_id: 1,
              code: "DEPT002",
              name: "Marketing",
              manager_id: 2,
              created_at: "2024-01-02T00:00:00Z",
              updated_at: "2024-01-02T00:00:00Z"
            }
          }
        ];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Division> => {
    const response = await api.get(`/api/divisions/${id}`);
    return response.data;
  },

  getByDepartment: async (departmentId: number): Promise<Division[]> => {
    const response = await api.get(`/api/departments/${departmentId}/divisions`);
    return response.data;
  },

  create: async (data: CreateDivisionData): Promise<Division> => {
    const response = await api.post('/api/divisions', data);
    return response.data;
  },

  update: async (id: number, data: UpdateDivisionData): Promise<Division> => {
    const response = await api.put(`/api/divisions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/divisions/${id}`);
  },
};

// Employee API
export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    try {
      const response = await api.get('/api/employees');
      console.log("Employee API Response:", response); // Debug log
      // Handle different response structures
      const data = response.data?.employees || response.data?.data?.employees || response.data?.data || response.data || [];
      console.log("Employee processed data:", data); // Debug log
      return data;
    } catch (error: any) {
      console.error("Employee API Error:", error.response?.data || error.message);
      // For development, return mock data if API fails
      if (error.response?.data?.message === "You are not logged in! Please log in to get access.") {
        console.log("Authentication required, returning mock employee data for development");
        return [
          {
            id: 1,
            user_id: 1,
            code: "EMP001",
            first_name: "John",
            last_name: "Doe",
            phone: "+1234567890",
            position: "Software Engineer",
            hire_date: "2024-01-01",
            termination_date: null,
            supervisor_id: null,
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            user: {
              id: 1,
              username: "johndoe",
              email: "john.doe@company.com",
              role_id: 1,
              is_active: true,
              last_login: "2024-01-01T00:00:00Z",
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z"
            }
          },
          {
            id: 2,
            user_id: 2,
            code: "EMP002",
            first_name: "Jane",
            last_name: "Smith",
            phone: "+0987654321",
            position: "Marketing Manager",
            hire_date: "2024-01-02",
            termination_date: null,
            supervisor_id: 1,
            is_active: true,
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z",
            user: {
              id: 2,
              username: "janesmith",
              email: "jane.smith@company.com",
              role_id: 2,
              is_active: true,
              last_login: "2024-01-02T00:00:00Z",
              created_at: "2024-01-02T00:00:00Z",
              updated_at: "2024-01-02T00:00:00Z"
            },
            supervisor: {
              id: 1,
              user_id: 1,
              code: "EMP001",
              first_name: "John",
              last_name: "Doe",
              phone: "+1234567890",
              position: "Software Engineer",
              hire_date: "2024-01-01",
              termination_date: null,
              supervisor_id: null,
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z"
            }
          }
        ];
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await api.get(`/api/employees/${id}`);
    return response.data;
  },

  create: async (data: CreateEmployeeData): Promise<Employee> => {
    const response = await api.post('/api/employees', data);
    return response.data;
  },

  update: async (id: number, data: UpdateEmployeeData): Promise<Employee> => {
    const response = await api.put(`/api/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/employees/${id}`);
  },

  getByDivision: async (divisionId: number): Promise<Employee[]> => {
    const response = await api.get(`/api/divisions/${divisionId}/employees`);
    return response.data;
  },
};

// User API for dropdowns
export const userService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get('/api/users');
      console.log("User API Response:", response); // Debug log
      // Handle different response structures
      const data = response.data?.users || response.data?.data?.users || response.data?.data || response.data || [];
      console.log("User processed data:", data); // Debug log
      return data;
    } catch (error: any) {
      console.error("User API Error:", error.response?.data || error.message);
      // For development, return mock data if API fails
      if (error.response?.data?.message === "You are not logged in! Please log in to get access.") {
        console.log("Authentication required, returning mock user data for development");
        return [
          {
            id: 1,
            username: "johndoe",
            email: "john.doe@company.com",
            role_id: 1,
            is_active: true,
            last_login: "2024-01-01T00:00:00Z",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          {
            id: 2,
            username: "janesmith",
            email: "jane.smith@company.com",
            role_id: 2,
            is_active: true,
            last_login: "2024-01-02T00:00:00Z",
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z"
          },
          {
            id: 3,
            username: "bobwilson",
            email: "bob.wilson@company.com",
            role_id: 1,
            is_active: true,
            last_login: "2024-01-03T00:00:00Z",
            created_at: "2024-01-03T00:00:00Z",
            updated_at: "2024-01-03T00:00:00Z"
          }
        ];
      }
      throw error;
    }
  },

  getActive: async (): Promise<User[]> => {
    try {
      const response = await api.get('/api/users?is_active=true');
      console.log("Active User API Response:", response); // Debug log
      // Handle different response structures
      const data = response.data?.users || response.data?.data || response.data || [];
      console.log("Active User processed data:", data); // Debug log
      return data;
    } catch (error: any) {
      console.error("Active User API Error:", error.response?.data || error.message);
      // For development, return mock data if API fails
      if (error.response?.data?.message === "You are not logged in! Please log in to get access.") {
        console.log("Authentication required, returning mock active user data for development");
        return [
          {
            id: 1,
            username: "johndoe",
            email: "john.doe@company.com",
            role_id: 1,
            is_active: true,
            last_login: "2024-01-01T00:00:00Z",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          {
            id: 2,
            username: "janesmith",
            email: "jane.smith@company.com",
            role_id: 2,
            is_active: true,
            last_login: "2024-01-02T00:00:00Z",
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z"
          }
        ];
      }
      throw error;
    }
  },
}; 