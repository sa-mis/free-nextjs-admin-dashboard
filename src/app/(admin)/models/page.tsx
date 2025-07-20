'use client';

import { useState, useEffect } from 'react';
import { Model, Brand } from '@/services/asset';
import { assetAPI } from '@/services/asset';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';

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
              <select
                id="brand_id"
                value={formData.brand_id || ''}
                onChange={(e) => handleInputChange('brand_id', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
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
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter model description"
            />
          </div>

          <div>
            <Label htmlFor="specifications">Specifications</Label>
            <textarea
              id="specifications"
              value={formData.specifications}
              onChange={(e) => handleInputChange('specifications', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter model specifications (JSON format)"
            />
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
              {model ? 'Update Model' : 'Create Model'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default function ModelsPage() {
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
      const response = await assetAPI.getModels();
      setModels(response.data);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await assetAPI.getBrands();
      setBrands(response.data);
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const handleSave = async (data: Partial<Model>) => {
    try {
      if (selectedModel) {
        await assetAPI.updateModel(selectedModel.id, data);
      } else {
        await assetAPI.createModel(data);
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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this model?')) {
      try {
        await assetAPI.deleteModel(id);
        loadModels();
      } catch (error) {
        console.error('Error deleting model:', error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Models
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Model
        </Button>
      </div>

      <ComponentCard>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading models...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Brand</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{model.code}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{model.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{model.brand_name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{model.description}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        model.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {model.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(model)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(model.id)}
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
    </div>
  );
} 