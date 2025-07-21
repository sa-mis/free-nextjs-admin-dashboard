'use client';

import { useState, useEffect } from 'react';
import { Vendor } from '@/services/asset';
import { assetAPI } from '@/services/asset';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';

interface VendorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onSave: (data: Partial<Vendor>) => void;
}

function VendorFormModal({
  isOpen,
  onClose,
  vendor,
  onSave
}: VendorFormModalProps) {
  const [formData, setFormData] = useState<Partial<Vendor>>({
    code: '',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    tax_id: ''
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        code: vendor.code,
        name: vendor.name,
        contact_person: vendor.contact_person || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        address: vendor.address || '',
        tax_id: vendor.tax_id || ''
      });
    } else {
      setFormData({
        code: '',
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        tax_id: ''
      });
    }
  }, [vendor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {vendor ? 'Edit Vendor' : 'Add New Vendor'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Vendor Code</Label>
              <InputField
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter vendor code"
              />
            </div>
            <div>
              <Label htmlFor="name">Vendor Name</Label>
              <InputField
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter vendor name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <InputField
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                placeholder="Enter contact person name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <InputField
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <InputField
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter vendor address"
            />
          </div>

          <div>
            <Label htmlFor="tax_id">Tax ID</Label>
            <InputField
              id="tax_id"
              value={formData.tax_id}
              onChange={(e) => handleInputChange('tax_id', e.target.value)}
              placeholder="Enter tax ID"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button>
              {vendor ? 'Update Vendor' : 'Create Vendor'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await assetAPI.getVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Vendor>) => {
    try {
      if (selectedVendor) {
        await assetAPI.updateVendor(selectedVendor.id, data);
      } else {
        await assetAPI.createVendor(data);
      }
      setIsModalOpen(false);
      setSelectedVendor(null);
      loadVendors();
    } catch (error) {
      console.error('Error saving vendor:', error);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleDelete = async (vendor: Vendor) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        await assetAPI.deleteVendor(vendor.id);
        loadVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

  const columns = [
    { key: 'code', label: 'Code', filterable: true, searchable: true, exportable: true },
    { key: 'name', label: 'Name', filterable: true, searchable: true, exportable: true },
    { key: 'contact_person', label: 'Contact Person', filterable: true, searchable: true, exportable: true },
    { key: 'phone', label: 'Phone', filterable: true, searchable: true, exportable: true },
    { key: 'email', label: 'Email', filterable: true, searchable: true, exportable: true, render: (value: string) => value ? (<a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>) : '-' },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Vendors
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Vendor
        </Button>
      </div>

      <AdvancedCustomTable
        data={vendors}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => { setSelectedVendor(null); setIsModalOpen(true); }}
        addButtonText="Add Vendor"
        isLoading={loading}
        title="Vendors Management"
      />

      <VendorFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVendor(null);
        }}
        vendor={selectedVendor}
        onSave={handleSave}
      />
    </div>
  );
} 