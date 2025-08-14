'use client';

import { useState, useEffect } from 'react';
import { Model, Brand } from '@/services/asset';
import { assetAPI } from '@/services/asset';
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
import { modelAPI } from '@/services/model';
import { brandAPI } from '@/services/brand';

interface ModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model | null;
  onSave: (data: Partial<Model>) => void;
  brands: Brand[];
}

function ModelFormModal({
  isOpen,
  onClose,
  model,
  onSave,
  brands
}: ModelFormModalProps) {
  const [formData, setFormData] = useState<Partial<Model>>({
    brand_id: undefined,
    code: '',
    name: '',
    description: '',
    specifications: '',
    is_active: true
  });

  useEffect(() => {
    if (model) {
      setFormData({
        brand_id: model.brand_id,
        code: model.code,
        name: model.name,
        description: model.description || '',
        specifications: model.specifications || '',
        is_active: model.is_active
      });
    } else {
      setFormData({
        brand_id: undefined,
        code: '',
        name: '',
        description: '',
        specifications: '',
        is_active: true
      });
    }
  }, [model]);

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
          {model ? 'Edit Model' : 'Add New Model'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand_id">Brand</Label>
              <Select
                id="brand_id"
                value={formData.brand_id || ''}
                onChange={(value) => handleInputChange('brand_id', value ? parseInt(value) : undefined)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="code">Model Code</Label>
              <InputField
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter model code"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Model Name</Label>
            <InputField
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter model name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter model description"
            />
          </div>

          <div>
            <Label htmlFor="specifications">Specifications</Label>
            <TextArea
              id="specifications"
              value={formData.specifications}
              onChange={(value) => handleInputChange('specifications', value)}
              // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter model specifications (JSON format)"
            />
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
              {model ? 'Update Model' : 'Create Model'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default function ModelsPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('model.view');
  const [models, setModels] = useState<Model[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  useEffect(() => {
    loadModels();
    loadBrands();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const response = await modelAPI.getModels();
      setModels(response.data);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await brandAPI.getBrands();
      setBrands(response.data);
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const handleSave = async (data: Partial<Model>) => {
    try {
      if (selectedModel) {
        await modelAPI.update(selectedModel.id, data);
      } else {
        await modelAPI.create(data);
      }
      setIsModalOpen(false);
      setSelectedModel(null);
      loadModels();
    } catch (error) {
      console.error('Error saving model:', error);
    }
  };

  const handleEdit = (model: Model) => {
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  const handleDelete = async (model: Model) => {
    if (confirm('Are you sure you want to delete this model?')) {
      try {
        await modelAPI.delete(model.id);
        loadModels();
      } catch (error) {
        console.error('Error deleting model:', error);
      }
    }
  };

  const columns = [
    { key: 'code', label: 'Code', filterable: true, searchable: true, exportable: true },
    { key: 'name', label: 'Name', filterable: true, searchable: true, exportable: true },
    { key: 'brand_name', label: 'Brand', filterable: true, searchable: true, exportable: true },
    { key: 'description', label: 'Description', filterable: true, searchable: true, exportable: true },
    { key: 'is_active', label: 'Status', filterable: true, searchable: true, exportable: true, render: (value: boolean) => value ? (<span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</span>) : (<span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</span>) },
  ];

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Models" />
      <div className="space-y-6">
        <ComponentCard title="Models">
      {/* <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Models
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Model
        </Button>
      </div> */}

      <AdvancedCustomTable
        data={models}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => { setSelectedModel(null); setIsModalOpen(true); }}
        addButtonText="Add Model"
        isLoading={loading}
        title="Models Management"
      />

      <ModelFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModel(null);
        }}
        model={selectedModel}
        onSave={handleSave}
        brands={brands}
      />
      </ComponentCard>
      </div>
    </div>
  );
} 