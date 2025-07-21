'use client'

import React, { useState } from 'react';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import Button from '@/components/ui/button/Button';
import ConsumableDashboard from '@/components/consumable/ConsumableDashboard';
import OrganizationFormModal from '@/components/organization/OrganizationFormModal';

// Placeholder data type and data
interface Consumable {
  id: number;
  name: string;
  code: string;
  category: string;
  unit: string;
  location: string;
  stock: number;
  status: string;
}

const initialConsumables: Consumable[] = [
  { id: 1, name: 'Consumable 1', code: 'C001', category: 'Category 1', unit: 'Box', location: 'Warehouse', stock: 100, status: 'in_stock' },
  { id: 2, name: 'Consumable 2', code: 'C002', category: 'Category 2', unit: 'Pack', location: 'Office', stock: 0, status: 'out_of_stock' },
];

const consumableFields = [
  { name: 'name', label: 'Consumable Name', type: 'text', required: true, placeholder: 'Enter consumable name' },
  { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'Enter code' },
  { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'Enter category' },
  { name: 'unit', label: 'Unit', type: 'text', required: true, placeholder: 'Enter unit' },
  { name: 'location', label: 'Location', type: 'text', required: false, placeholder: 'Enter location' },
  { name: 'stock', label: 'Stock', type: 'number', required: true, placeholder: 'Enter stock' },
  { name: 'status', label: 'Status', type: 'select', required: true, options: [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ] },
];

export default function ConsumablesPage() {
  const [consumables, setConsumables] = useState<Consumable[]>(initialConsumables);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConsumable, setEditingConsumable] = useState<Consumable | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (consumable: Consumable) => {
    setEditingConsumable(consumable);
    setIsModalOpen(true);
  };

  const handleDelete = (consumable: Consumable) => {
    setConsumables(prev => prev.filter(c => c.id !== consumable.id));
  };

  const handleAdd = () => {
    setEditingConsumable(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Consumable>) => {
    setIsSubmitting(true);
    if (editingConsumable) {
      setConsumables(prev => prev.map(c => c.id === editingConsumable.id ? { ...c, ...data } as Consumable : c));
    } else {
      setConsumables(prev => [...prev, { ...data, id: Date.now() } as Consumable]);
    }
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const columns = [
    { key: 'name', label: 'Consumable Name', filterable: true, searchable: true, exportable: true },
    { key: 'code', label: 'Code', filterable: true, searchable: true, exportable: true },
    { key: 'category', label: 'Category', filterable: true, searchable: true, exportable: true },
    { key: 'unit', label: 'Unit', filterable: true, searchable: true, exportable: true },
    { key: 'location', label: 'Location', filterable: true, searchable: true, exportable: true },
    { key: 'stock', label: 'Stock', filterable: true, searchable: true, exportable: true },
    { key: 'status', label: 'Status', filterable: true, searchable: true, exportable: true },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Consumables
        </h2>
        <Button onClick={handleAdd}>Add Consumable</Button>
      </div>
      <ConsumableDashboard data={consumables} />
      <AdvancedCustomTable
        data={consumables}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="Add Consumable"
        isLoading={loading}
        title="Consumables Management"
      />
      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        title={editingConsumable ? 'Edit Consumable' : 'Add New Consumable'}
        fields={consumableFields}
        initialData={editingConsumable || { status: 'in_stock' }}
        isLoading={isSubmitting}
      />
    </div>
  );
} 