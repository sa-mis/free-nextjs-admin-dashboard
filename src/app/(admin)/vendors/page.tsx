'use client';

import { useState, useEffect } from 'react';
import { Vendor } from '@/services/asset';
import { assetAPI } from '@/services/asset';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';

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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        await assetAPI.deleteVendor(id);
        loadVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

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

      <ComponentCard>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading vendors...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Contact Person</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{vendor.code}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{vendor.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{vendor.contact_person}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{vendor.phone}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {vendor.email ? (
                        <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">
                          {vendor.email}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(vendor)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(vendor.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>

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