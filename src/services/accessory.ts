import api from '@/lib/api';

export async function getAccessoryDashboard() {
  const res = await api.get('/api/accessories/dashboard');
  return res.data;
}

export async function getAccessories(params: Record<string, any>) {
  const search = new URLSearchParams(params).toString();
  const res = await api.get(`/api/accessories${search ? `?${search}` : ''}`);
  return res.data;
}

export async function createAccessory(data: Record<string, any>) {
  const res = await api.post('/api/accessories', data);
  return res.data;
}

export async function updateAccessory(id: number, data: Record<string, any>) {
  const res = await api.put(`/api/accessories/${id}`, data);
  return res.data;
}

export async function deleteAccessory(id: number) {
  const res = await api.delete(`/api/accessories/${id}`);
  return res.data;
}

export async function assignAccessory(accessory_id: number, data: Record<string, any>) {
  const res = await api.post(`/api/accessories/${accessory_id}/assign`, data);
  return res.data;
}

export async function addStockMovement(accessory_id: number, data: Record<string, any>) {
  const res = await api.post(`/api/accessories/${accessory_id}/stock-movement`, data);
  return res.data;
}

export async function getAccessoryAssignments(accessory_id: number) {
  const res = await api.get(`/api/accessories/${accessory_id}/assignments`);
  return res.data;
}

export async function getStockMovements(accessory_id: number) {
  const res = await api.get(`/api/accessories/${accessory_id}/stock-movements`);
  return res.data;
} 