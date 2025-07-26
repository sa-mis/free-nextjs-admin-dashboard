'use client'

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/button/Button';
import ConsumableDashboard from '@/components/consumable/ConsumableDashboard';
import ConsumableTable from '@/components/consumable/ConsumableTable';
import ConsumableFormModal from '@/components/consumable/ConsumableFormModal';
import ConsumableAssignModal from '@/components/consumable/ConsumableAssignModal';
import ConsumableStockModal from '@/components/consumable/ConsumableStockModal';
import { consumableAPI } from '@/services/consumable';
import { Consumable, ConsumableAssignment, ConsumableStockMovement } from '@/types/consumable';

export default function ConsumablesPage() {
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConsumable, setEditingConsumable] = useState<Consumable | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null);
  const [formError, setFormError] = useState<string | undefined>();
  const [assignError, setAssignError] = useState<string | undefined>();
  const [stockError, setStockError] = useState<string | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);

  // Fetch consumables
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await consumableAPI.getAll({ page: pagination.page, limit: pagination.limit });
        console.log('Consumable API response:', res);
        // Handle the backend response structure: { success: true, data: [...], pagination: {...} }
        const consumablesData = res.data || [];
        const mappedConsumables = consumablesData.map((c: any) => ({
          ...c,
          code: c.consumable_tag || '',
          category: c.category_name || '',
          stock: c.stock_quantity || 0,
          status: c.status || 'active',
          unit: c.unit || '',
          location: c.location || '',
        }));
        setConsumables(mappedConsumables);
        setPagination(p => ({ ...p, total: res.pagination?.total || 0 }));
      } catch (e) {
        console.error('Error fetching consumables:', e);
        setConsumables([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [pagination.page, pagination.limit]);

  // CRUD Handlers
  const handleAdd = () => {
    setEditingConsumable(null);
    setModalOpen(true);
    setFormError(undefined);
  };
  const handleEdit = (consumable: Consumable) => {
    setEditingConsumable(consumable);
    setModalOpen(true);
    setFormError(undefined);
  };
  const handleDelete = async (consumable: Consumable) => {
    setLoading(true);
    try {
      await consumableAPI.delete(consumable.id);
      setConsumables(prev => prev.filter(c => c.id !== consumable.id));
      setPagination(p => ({ ...p, total: p.total - 1 }));
    } catch (e: any) {
      // handle error
    }
    setLoading(false);
  };
  const handleSave = async (data: Partial<Consumable>) => {
    setFormLoading(true);
    setFormError(undefined);
    try {
      if (editingConsumable) {
        await consumableAPI.update(editingConsumable.id, data);
      } else {
        await consumableAPI.create(data);
      }
      setModalOpen(false);
      setPagination(p => ({ ...p })); // trigger reload
    } catch (e: any) {
      setFormError(e.message || 'Error saving consumable');
    }
    setFormLoading(false);
  };

  // Assign/Stock Handlers
  const handleAssign = (consumable: Consumable) => {
    setSelectedConsumable(consumable);
    setAssignModalOpen(true);
    setAssignError(undefined);
  };
  const handleStock = (consumable: Consumable) => {
    setSelectedConsumable(consumable);
    setStockModalOpen(true);
    setStockError(undefined);
  };
  const handleAssignSubmit = async (data: Partial<ConsumableAssignment>) => {
    if (!selectedConsumable) return;
    setAssignLoading(true);
    setAssignError(undefined);
    try {
      await consumableAPI.assign(selectedConsumable.id, data);
      setAssignModalOpen(false);
    } catch (e: any) {
      setAssignError(e.message || 'Error assigning consumable');
    }
    setAssignLoading(false);
  };
  const handleStockSubmit = async (data: Partial<ConsumableStockMovement>) => {
    if (!selectedConsumable) return;
    setStockLoading(true);
    setStockError(undefined);
    try {
      await consumableAPI.addStockMovement(selectedConsumable.id, data);
      setStockModalOpen(false);
    } catch (e: any) {
      setStockError(e.message || 'Error saving stock movement');
    }
    setStockLoading(false);
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Consumables
        </h2>
        <Button onClick={handleAdd}>Add Consumable</Button>
      </div>
      <ConsumableDashboard data={consumables} />
      <ConsumableTable
        data={consumables}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAssign={handleAssign}
        onStock={handleStock}
      />
      <ConsumableFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingConsumable || {}}
        loading={formLoading}
        error={formError}
      />
      <ConsumableAssignModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onSubmit={handleAssignSubmit}
        loading={assignLoading}
        error={assignError}
      />
      <ConsumableStockModal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        onSubmit={handleStockSubmit}
        loading={stockLoading}
        error={stockError}
      />
    </div>
  );
} 