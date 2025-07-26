import { Consumable, ConsumableAssignment, ConsumableStockMovement, ConsumableListResponse } from '@/types/consumable';
import api from '@/lib/api';

const consumableAPI = {
  async getAll(params?: Record<string, any>): Promise<ConsumableListResponse> {
    const response = await api.get('/api/consumables', { params });
    return response.data;
  },
  async getById(id: number): Promise<Consumable> {
    return api.get(`/api/consumables/${id}`);
  },
  async create(data: Partial<Consumable>): Promise<Consumable> {
    return api.post('/api/consumables', data);
  },
  async update(id: number, data: Partial<Consumable>): Promise<Consumable> {
    return api.put(`/api/consumables/${id}`, data);
  },
  async delete(id: number): Promise<void> {
    return api.delete(`/api/consumables/${id}`);
  },
  async assign(consumableId: number, data: Partial<ConsumableAssignment>): Promise<ConsumableAssignment> {
    return api.post(`/api/consumables/${consumableId}/assign`, data);
  },
  async getStockMovements(params?: Record<string, any>): Promise<ConsumableStockMovement[]> {
    return api.get('/api/consumables/stock-movements', { params });
  },
  async addStockMovement(consumableId: number, data: Partial<ConsumableStockMovement>): Promise<ConsumableStockMovement> {
    return api.post(`/api/consumables/${consumableId}/stock-movement`, data);
  },
  async getMinStockNotifications(): Promise<Consumable[]> {
    return api.get('/api/consumables/notifications/min-stock');
  },
};

export { consumableAPI }; 