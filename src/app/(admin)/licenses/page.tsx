'use client'

import React, { useState } from 'react';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import Button from '@/components/ui/button/Button';
import LicenseDashboard from '@/components/license/LicenseDashboard';
import OrganizationFormModal from '@/components/organization/OrganizationFormModal';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// Placeholder data type and data
interface License {
  id: number;
  license_key: string;
  software_name: string;
  version: string;
  license_type: 'perpetual' | 'subscription' | 'trial';
  seats_total: number;
  seats_used: number;
  purchase_date?: string;
  start_date?: string;
  end_date?: string;
  vendor_id: number;
  vendor_name?: string;
  purchase_price?: number;
  annual_cost?: number;
  notes?: string;
  status: 'active' | 'expired' | 'cancelled';
}

const initialLicenses: License[] = [
  { id: 1, license_key: 'ABC-123-XYZ', software_name: 'Office Suite', version: '2024', license_type: 'subscription', seats_total: 10, seats_used: 2, purchase_date: '', start_date: '', end_date: '', vendor_id: 1, vendor_name: 'Vendor A', purchase_price: 1000, annual_cost: 200, notes: '', status: 'active' },
  { id: 2, license_key: 'DEF-456-UVW', software_name: 'Antivirus', version: '2023', license_type: 'perpetual', seats_total: 50, seats_used: 10, purchase_date: '', start_date: '', end_date: '', vendor_id: 2, vendor_name: 'Vendor B', purchase_price: 5000, annual_cost: 0, notes: '', status: 'expired' },
];

const licenseFields = [
  { name: 'license_key', label: 'License Key', type: 'text', required: true, placeholder: 'Enter license key' },
  { name: 'software_name', label: 'Software Name', type: 'text', required: true, placeholder: 'Enter software name' },
  { name: 'version', label: 'Version', type: 'text', required: false, placeholder: 'Enter version' },
  { name: 'license_type', label: 'Type', type: 'select', required: true, options: [
    { value: 'subscription', label: 'Subscription' },
    { value: 'perpetual', label: 'Perpetual' },
    { value: 'trial', label: 'Trial' },
  ] },
  { name: 'seats_total', label: 'Seats Total', type: 'number', required: true, placeholder: 'Enter total seats' },
  { name: 'seats_used', label: 'Seats Used', type: 'number', required: false, placeholder: 'Enter used seats' },
  { name: 'purchase_date', label: 'Purchase Date', type: 'date', required: false },
  { name: 'start_date', label: 'Start Date', type: 'date', required: false },
  { name: 'end_date', label: 'End Date', type: 'date', required: false },
  { name: 'vendor_id', label: 'Vendor', type: 'number', required: false, placeholder: 'Enter vendor id' },
  { name: 'purchase_price', label: 'Purchase Price', type: 'number', required: false, placeholder: 'Enter purchase price' },
  { name: 'annual_cost', label: 'Annual Cost', type: 'number', required: false, placeholder: 'Enter annual cost' },
  { name: 'notes', label: 'Notes', type: 'textarea', required: false, placeholder: 'Enter notes' },
  { name: 'status', label: 'Status', type: 'select', required: true, options: [
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' },
  ] },
];

const columns = [
  { key: 'license_key', label: 'License Key', filterable: true, searchable: true, exportable: true },
  { key: 'software_name', label: 'Software Name', filterable: true, searchable: true, exportable: true },
  { key: 'version', label: 'Version', filterable: true, searchable: true, exportable: true },
  { key: 'license_type', label: 'Type', filterable: true, searchable: true, exportable: true },
  { key: 'seats_total', label: 'Seats Total', filterable: true, searchable: true, exportable: true },
  { key: 'seats_used', label: 'Seats Used', filterable: true, searchable: true, exportable: true },
  // { key: 'purchase_date', label: 'Purchase Date', filterable: true, searchable: true, exportable: true },
  { key: 'start_date', label: 'Start Date', filterable: true, searchable: true, exportable: true },
  { key: 'end_date', label: 'End Date', filterable: true, searchable: true, exportable: true },
  { key: 'vendor_name', label: 'Vendor', filterable: true, searchable: true, exportable: true },
  // { key: 'purchase_price', label: 'Purchase Price', filterable: true, searchable: true, exportable: true },
  // { key: 'annual_cost', label: 'Annual Cost', filterable: true, searchable: true, exportable: true },
  { key: 'notes', label: 'Notes', filterable: false, searchable: true, exportable: true },
  { key: 'status', label: 'Status', filterable: true, searchable: true, exportable: true },
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Licenses" />
      <div className="space-y-6">
        <ComponentCard title="Licenses">
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
          {/* <OrganizationFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSave}
            title={editingLicense ? 'Edit License' : 'Add New License'}
            fields={licenseFields}
            initialData={editingLicense || { status: 'active' }}
            isLoading={isSubmitting}
          /> */}
        </ComponentCard>
      </div>
    </div>
  );
} 