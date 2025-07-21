'use client'

import React, { useState } from 'react';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import Button from '@/components/ui/button/Button';
import AccessoryDashboard from '@/components/accessory/AccessoryDashboard';
import OrganizationFormModal from '@/components/organization/OrganizationFormModal';

// Placeholder data type and data
interface Accessory {
  id: number;
  name: string;
  code: string;
  category: string;
  brand: string;
  model: string;
  location: string;
  status: string;
}

const initialAccessories: Accessory[] = [
  { id: 1, name: 'Accessory 1', code: 'A001', category: 'Category 1', brand: 'Brand 1', model: 'Model 1', location: 'Warehouse', status: 'active' },
  { id: 2, name: 'Accessory 2', code: 'A002', category: 'Category 2', brand: 'Brand 2', model: 'Model 2', location: 'Office', status: 'inactive' },
];

const accessoryFields = [
  { name: 'name', label: 'Accessory Name', type: 'text', required: true, placeholder: 'Enter accessory name' },
  { name: 'code', label: 'Code', type: 'text', required: true, placeholder: 'Enter code' },
  { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'Enter category' },
  { name: 'brand', label: 'Brand', type: 'text', required: false, placeholder: 'Enter brand' },
  { name: 'model', label: 'Model', type: 'text', required: false, placeholder: 'Enter model' },
  { name: 'location', label: 'Location', type: 'text', required: false, placeholder: 'Enter location' },
  { name: 'status', label: 'Status', type: 'select', required: true, options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ] },
];

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<Accessory[]>(initialAccessories);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setIsModalOpen(true);
  };

  const handleDelete = (accessory: Accessory) => {
    setAccessories(prev => prev.filter(a => a.id !== accessory.id));
  };

  const handleAdd = () => {
    setEditingAccessory(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Accessory>) => {
    setIsSubmitting(true);
    if (editingAccessory) {
      setAccessories(prev => prev.map(a => a.id === editingAccessory.id ? { ...a, ...data } as Accessory : a));
    } else {
      setAccessories(prev => [...prev, { ...data, id: Date.now() } as Accessory]);
    }
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const columns = [
    { key: 'name', label: 'Accessory Name', filterable: true, searchable: true, exportable: true },
    { key: 'code', label: 'Code', filterable: true, searchable: true, exportable: true },
    { key: 'category', label: 'Category', filterable: true, searchable: true, exportable: true },
    { key: 'brand', label: 'Brand', filterable: true, searchable: true, exportable: true },
    { key: 'model', label: 'Model', filterable: true, searchable: true, exportable: true },
    { key: 'location', label: 'Location', filterable: true, searchable: true, exportable: true },
    { key: 'status', label: 'Status', filterable: true, searchable: true, exportable: true },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Accessories
        </h2>
        <Button onClick={handleAdd}>Add Accessory</Button>
      </div>
      <AccessoryDashboard data={accessories} />
      <AdvancedCustomTable
        data={accessories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="Add Accessory"
        isLoading={loading}
        title="Accessories Management"
      />
      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        title={editingAccessory ? 'Edit Accessory' : 'Add New Accessory'}
        fields={accessoryFields}
        initialData={editingAccessory || { status: 'active' }}
        isLoading={isSubmitting}
      />
    </div>
  );
} 