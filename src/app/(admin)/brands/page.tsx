'use client';

import { useState, useEffect } from 'react';
import { Brand } from '@/services/asset';
import { assetAPI } from '@/services/asset';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';

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
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <select
              id="is_active"
              value={formData.is_active ? '1' : '0'}
              onChange={(e) => handleInputChange('is_active', e.target.value === '1')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
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
      const response = await assetAPI.getBrands();
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
        await assetAPI.updateBrand(selectedBrand.id, data);
      } else {
        await assetAPI.createBrand(data);
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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await assetAPI.deleteBrand(id);
        loadBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Brands
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Brand
        </Button>
      </div>

      <ComponentCard>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading brands...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Website</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{brand.code}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{brand.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{brand.description}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {brand.website ? (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {brand.website}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        brand.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {brand.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(brand)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(brand.id)}
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

      <BrandFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onSave={handleSave}
      />
    </div>
  );
} 