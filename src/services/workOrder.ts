import api from '@/lib/api';

export interface WorkOrder {
  id: number;
  title: string;
  description?: string;
  asset_id?: number;
  tool_id?: number;
  maintenance_type_id: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'approved' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  requested_by?: number;
  assigned_to?: number;
  responsible_division_id?: number;
  estimated_start_date?: string;
  estimated_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  estimated_hours: number;
  actual_hours?: number;
  estimated_cost: number;
  actual_cost?: number;
  location?: string;
  notes?: string;
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
  requested_user?: {
    id: number;
    name: string;
    email: string;
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
  tasks?: WorkOrderTask[];
}

export interface WorkOrderTask {
  id: number;
  work_order_id: number;
  task_name: string;
  description?: string;
  estimated_hours: number;
  actual_hours?: number;
  sequence_order: number;
  is_completed: boolean;
  completed_at?: string;
  completed_by?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderDashboard {
  total: number;
  draft: number;
  approved: number;
  scheduled: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  low_priority: number;
  medium_priority: number;
  high_priority: number;
  urgent_priority: number;
}

export const workOrderAPI = {
  // Get all work orders
  getAll: async (params?: any): Promise<{ data: WorkOrder[]; total: number }> => {
    const response = await api.get('/api/work-orders', { params });
    return response.data;
  },

  // Get single work order
  getById: async (id: number): Promise<WorkOrder> => {
    const response = await api.get(`/api/work-orders/${id}`);
    return response.data;
  },

  // Create work order
  create: async (data: Partial<WorkOrder>): Promise<WorkOrder> => {
    const response = await api.post('/api/work-orders', data);
    return response.data;
  },

  // Update work order
  update: async (id: number, data: Partial<WorkOrder>): Promise<WorkOrder> => {
    const response = await api.put(`/api/work-orders/${id}`, data);
    return response.data;
  },

  // Delete work order
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/work-orders/${id}`);
  },

  // Update work order status
  updateStatus: async (id: number, status: WorkOrder['status']): Promise<WorkOrder> => {
    const response = await api.patch(`/api/work-orders/${id}/status`, { status });
    return response.data;
  },

  // Get dashboard statistics
  getDashboard: async (): Promise<WorkOrderDashboard> => {
    const response = await api.get('/api/work-orders/dashboard');
    return response.data;
  },

  // Get work order tasks
  getTasks: async (id: number): Promise<WorkOrderTask[]> => {
    const response = await api.get(`/api/work-orders/${id}/tasks`);
    return response.data;
  },

  // Add task to work order
  addTask: async (id: number, task: Partial<WorkOrderTask>): Promise<WorkOrderTask> => {
    const response = await api.post(`/api/work-orders/${id}/tasks`, task);
    return response.data;
  },

  // Update work order task
  updateTask: async (id: number, taskId: number, task: Partial<WorkOrderTask>): Promise<WorkOrderTask> => {
    const response = await api.put(`/api/work-orders/${id}/tasks/${taskId}`, task);
    return response.data;
  },

  // Delete work order task
  deleteTask: async (id: number, taskId: number): Promise<void> => {
    await api.delete(`/api/work-orders/${id}/tasks/${taskId}`);
  },
}; 