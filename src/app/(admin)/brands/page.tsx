'use client';

import { useState, useEffect } from 'react';
import { brandAPI, Brand } from '@/services/brand';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  onSave: (data: Partial<Brand>) => void;
}

function BrandFormModal({
  isOpen,
  onClose,
  brand,
  onSave
}: BrandFormModalProps) {
  const [formData, setFormData] = useState<Partial<Brand>>({
    code: '',
    name: '',
    description: '',
    website: '',
    contact_info: '',
    is_active: true
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        code: brand.code,
        name: brand.name,
        description: brand.description || '',
        website: brand.website || '',
        contact_info: brand.contact_info || '',
        is_active: brand.is_active
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        website: '',
        contact_info: '',
        is_active: true
      });
    }
  }, [brand]);

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
          {brand ? 'Edit Brand' : 'Add New Brand'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Brand Code</Label>
              <InputField
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter brand code"
              />
            </div>
            <div>
              <Label htmlFor="name">Brand Name</Label>
              <InputField
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter brand description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <InputField
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="contact_info">Contact Info</Label>
              <InputField
                id="contact_info"
                value={formData.contact_info}
                onChange={(e) => handleInputChange('contact_info', e.target.value)}
                placeholder="Enter contact information"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="is_active">Status</Label>
            <Select
              id="is_active"
              value={formData.is_active ? '1' : '0'}
              onChange={(value) => handleInputChange('is_active', value === '1')}
              // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button>
              {brand ? 'Update Brand' : 'Create Brand'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default function BrandsPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('brand.view');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await brandAPI.getBrands();
      setBrands(response.data);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Brand>) => {
    try {
      if (selectedBrand) {
        await brandAPI.update(selectedBrand.id, data);
      } else {
        await brandAPI.create(data);
      }
      setIsModalOpen(false);
      setSelectedBrand(null);
      loadBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await brandAPI.delete(brand.id);
        loadBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  const columns = [
    { key: 'code', label: 'Code', filterable: true, searchable: true, exportable: true },
    { key: 'name', label: 'Name', filterable: true, searchable: true, exportable: true },
    { key: 'description', label: 'Description', filterable: true, searchable: true, exportable: true },
    { key: 'website', label: 'Website', filterable: true, searchable: true, exportable: true, render: (value: string) => value ? (<a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a>) : '-' },
    { key: 'is_active', label: 'Status', filterable: true, searchable: true, exportable: true, render: (value: boolean) => value ? (<span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</span>) : (<span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</span>) },
  ];

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Brands" />
      <div className="space-y-6">
        <ComponentCard title="Brands">
      {/* <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Brands
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Brand
        </Button>
      </div> */}

      <AdvancedCustomTable
        data={brands}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => { setSelectedBrand(null); setIsModalOpen(true); }}
        addButtonText="Add Brand"
        isLoading={loading}
        title="Brands Management"
      />

      <BrandFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onSave={handleSave}
      />
      </ComponentCard>
      </div>
    </div>
  );
} 