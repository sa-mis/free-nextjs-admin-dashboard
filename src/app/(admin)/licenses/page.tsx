'use client'

import React, { useState } from 'react';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import Button from '@/components/ui/button/Button';
import LicenseDashboard from '@/components/license/LicenseDashboard';
import OrganizationFormModal from '@/components/organization/OrganizationFormModal';

// Placeholder data type and data
interface License {
  id: number;
  license_key: string;
  software_name: string;
  version: string;
  license_type: string;
  seats_total: number;
  vendor: string;
  status: string;
}

const initialLicenses: License[] = [
  { id: 1, license_key: 'ABC-123-XYZ', software_name: 'Office Suite', version: '2024', license_type: 'subscription', seats_total: 10, vendor: 'Vendor A', status: 'active' },
  { id: 2, license_key: 'DEF-456-UVW', software_name: 'Antivirus', version: '2023', license_type: 'perpetual', seats_total: 50, vendor: 'Vendor B', status: 'expired' },
];

const licenseFields = [
  { name: 'license_key', label: 'License Key', type: 'text', required: true, placeholder: 'Enter license key' },
  { name: 'software_name', label: 'Software Name', type: 'text', required: true, placeholder: 'Enter software name' },
  { name: 'version', label: 'Version', type: 'text', required: false, placeholder: 'Enter version' },
  { name: 'license_type', label: 'Type', type: 'text', required: true, placeholder: 'Enter type' },
  { name: 'seats_total', label: 'Seats', type: 'number', required: true, placeholder: 'Enter seats' },
  { name: 'vendor', label: 'Vendor', type: 'text', required: false, placeholder: 'Enter vendor' },
  { name: 'status', label: 'Status', type: 'select', required: true, options: [
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
  ] },
];

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (license: License) => {
    setEditingLicense(license);
    setIsModalOpen(true);
  };

  const handleDelete = (license: License) => {
    setLicenses(prev => prev.filter(l => l.id !== license.id));
  };

  const handleAdd = () => {
    setEditingLicense(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<License>) => {
    setIsSubmitting(true);
    if (editingLicense) {
      setLicenses(prev => prev.map(l => l.id === editingLicense.id ? { ...l, ...data } as License : l));
    } else {
      setLicenses(prev => [...prev, { ...data, id: Date.now() } as License]);
    }
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const columns = [
    { key: 'license_key', label: 'License Key', filterable: true, searchable: true, exportable: true },
    { key: 'software_name', label: 'Software Name', filterable: true, searchable: true, exportable: true },
    { key: 'version', label: 'Version', filterable: true, searchable: true, exportable: true },
    { key: 'license_type', label: 'Type', filterable: true, searchable: true, exportable: true },
    { key: 'seats_total', label: 'Seats', filterable: true, searchable: true, exportable: true },
    { key: 'vendor', label: 'Vendor', filterable: true, searchable: true, exportable: true },
    { key: 'status', label: 'Status', filterable: true, searchable: true, exportable: true },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Licenses
        </h2>
        <Button onClick={handleAdd}>Add License</Button>
      </div>
      <LicenseDashboard data={licenses} />
      <AdvancedCustomTable
        data={licenses}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="Add License"
        isLoading={loading}
        title="Licenses Management"
      />
      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        title={editingLicense ? 'Edit License' : 'Add New License'}
        fields={licenseFields}
        initialData={editingLicense || { status: 'active' }}
        isLoading={isSubmitting}
      />
    </div>
  );
} 