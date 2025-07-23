'use client'

import { useState } from 'react';
import AccessoryDashboard from '@/components/accessory/AccessoryDashboard';
import AccessoryTable from '@/components/accessory/AccessoryTable';
import AccessoryFormModal from '@/components/accessory/AccessoryFormModal';
import AccessoryAssignModal from '@/components/accessory/AccessoryAssignModal';
import AccessoryStockModal from '@/components/accessory/AccessoryStockModal';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function AccessoriesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

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
            onEdit={handleEdit}
            onAssign={handleAssign}
            onStockMovement={handleStock}
          />
          <AccessoryFormModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSuccess={() => setFormOpen(false)}
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