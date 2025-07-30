import api from '@/lib/api';

export interface PmSchedule {
  id: number;
  name: string;
  description?: string;
  asset_id?: number;
  tool_id?: number;
  maintenance_type_id: number;
  frequency_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'custom';
  frequency_value: number;
  last_performed_date?: string;
  next_due_date: string;
  estimated_hours: number;
  estimated_cost: number;
  assigned_to?: number;
  responsible_division_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Associations
  asset?: {
    id: number;
    name: string;
  };
  tool?: {
    id: number;
    name: string;
  };
  maintenance_type?: {
    id: number;
    name: string;
  };
  assigned_user?: {
    id: number;
    name: string;
    email: string;
  };
  responsible_division?: {
    id: number;
    name: string;
  };
  tasks?: PmScheduleTask[];
}

export interface PmScheduleTask {
  id: number;
  pm_schedule_id: number;
  task_name: string;
  description?: string;
  estimated_hours: number;
  sequence_order: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface PmScheduleDashboard {
  total: number;
  active: number;
  inactive: number;
  overdue: number;
  upcoming: number;
  completed_this_month: number;
  frequency_breakdown: {
    daily: number;
    weekly: number;
    monthly: number;
    quarterly: number;
    semi_annual: number;
    annual: number;
    custom: number;
  };
}

export const pmScheduleAPI = {
  // Get all PM schedules
  getAll: async (params?: any): Promise<{ data: PmSchedule[]; total: number }> => {
    const response = await api.get('/api/pm-schedules', { params });
    return response.data;
  },

  // Get single PM schedule
  getById: async (id: number): Promise<PmSchedule> => {
    const response = await api.get(`/api/pm-schedules/${id}`);
    return response.data;
  },

  // Create PM schedule
  create: async (data: Partial<PmSchedule>): Promise<PmSchedule> => {
    const response = await api.post('/api/pm-schedules', data);
    return response.data;
  },

  // Update PM schedule
  update: async (id: number, data: Partial<PmSchedule>): Promise<PmSchedule> => {
    const response = await api.put(`/api/pm-schedules/${id}`, data);
    return response.data;
  },

  // Delete PM schedule
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/pm-schedules/${id}`);
  },

  // Get dashboard statistics
  getDashboard: async (): Promise<PmScheduleDashboard> => {
    const response = await api.get('/api/pm-schedules/dashboard');
    return response.data;
  },

  // Generate work order from PM schedule
  generateWorkOrder: async (id: number): Promise<any> => {
    const response = await api.post(`/api/pm-schedules/${id}/generate-work-order`);
    return response.data;
  },

  // Get PM schedule tasks
  getTasks: async (id: number): Promise<PmScheduleTask[]> => {
    const response = await api.get(`/api/pm-schedules/${id}/tasks`);
    return response.data;
  },

  // Add task to PM schedule
  addTask: async (id: number, task: Partial<PmScheduleTask>): Promise<PmScheduleTask> => {
    const response = await api.post(`/api/pm-schedules/${id}/tasks`, task);
    return response.data;
  },

  // Update PM schedule task
  updateTask: async (id: number, taskId: number, task: Partial<PmScheduleTask>): Promise<PmScheduleTask> => {
    const response = await api.put(`/api/pm-schedules/${id}/tasks/${taskId}`, task);
    return response.data;
  },

  // Delete PM schedule task
  deleteTask: async (id: number, taskId: number): Promise<void> => {
    await api.delete(`/api/pm-schedules/${id}/tasks/${taskId}`);
  },
}; 