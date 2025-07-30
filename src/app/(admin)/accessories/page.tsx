'use client'

import { useEffect, useState, useCallback } from 'react';
import AccessoryDashboard from '@/components/accessory/AccessoryDashboard';
import AccessoryTable from '@/components/accessory/AccessoryTable';
import AccessoryFormModal from '@/components/accessory/AccessoryFormModal';
import AccessoryAssignModal from '@/components/accessory/AccessoryAssignModal';
import AccessoryStockModal from '@/components/accessory/AccessoryStockModal';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { accessoryAPI } from '@/services/accessory';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

export default function AccessoriesPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('accessory.view');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

  // New state for table data
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state (if needed)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Fetch function
  const fetchAccessories = useCallback(async () => {
    setLoading(true);
    const res = await accessoryAPI.getAccessories({ page: pagination.page, limit: pagination.limit });
    setAccessories(res.data);
    setPagination(prev => ({ ...prev, total: res.pagination.total }));
    setLoading(false);
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  const handleEdit = (accessory: any) => {
    setSelected(accessory);
    setFormOpen(true);
  };
  const handleCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };
  const handleAssign = (accessory: any) => {
    setSelected(accessory);
    setAssignOpen(true);
  };
  const handleStock = (accessory: any) => {
    setSelected(accessory);
    setStockOpen(true);
  };

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;

  return (
    <div>
      <PageBreadcrumb pageTitle="Accessories" />
      <div className="space-y-6">
        <ComponentCard title="Accessories">
          <AccessoryDashboard />
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Accessories</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreate}>Add Accessory</button>
          </div>
          <AccessoryTable
            data={accessories}
            loading={loading}
            pagination={pagination}
            setPagination={setPagination}
            onEdit={handleEdit}
            onAssign={handleAssign}
            onStockMovement={handleStock}
            reload={fetchAccessories}
          />
          <AccessoryFormModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSuccess={() => {
              fetchAccessories();
              setFormOpen(false);
            }}
            initialData={selected}
          />
          <AccessoryAssignModal
            open={assignOpen}
            onClose={() => setAssignOpen(false)}
            onSuccess={() => setAssignOpen(false)}
            accessory={selected}
          />
          <AccessoryStockModal
            open={stockOpen}
            onClose={() => setStockOpen(false)}
            onSuccess={() => setStockOpen(false)}
            accessory={selected}
          />
        </ComponentCard>
      </div>
    </div>
  );
} 