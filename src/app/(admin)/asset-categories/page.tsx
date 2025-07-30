'use client';

import { useState, useEffect } from 'react';
import { categoryAPI, AssetCategory } from '@/services/category';
// import { assetAPI } from '@/services/asset';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

interface AssetCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AssetCategory | null;
  onSave: (data: Partial<AssetCategory>) => void;
  categories: AssetCategory[];
}

function AssetCategoryFormModal({
  isOpen,
  onClose,
  category,
  onSave,
  categories
}: AssetCategoryFormModalProps) {
  const [formData, setFormData] = useState<Partial<AssetCategory>>({
    code: '',
    name: '',
    description: '',
    parent_id: undefined
  });

  useEffect(() => {
    if (category) {
      setFormData({
        code: category.code,
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        parent_id: undefined
      });
    }
  }, [category]);

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
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Category Code</Label>
              <InputField
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter category code"
              />
            </div>
            <div>
              <Label htmlFor="name">Category Name</Label>
              <InputField
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter category name"
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
              placeholder="Enter category description"
            />
          </div>

          <div>
            <Label htmlFor="parent_id">Parent Category</Label>
            <select
              id="parent_id"
              value={formData.parent_id || ''}
              onChange={(e) => handleInputChange('parent_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Parent</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
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
              {category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default function AssetCategoriesPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('asset.view');
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<AssetCategory>) => {
    try {
      if (selectedCategory) {
        await categoryAPI.update(selectedCategory.id, data);
      } else {
        await categoryAPI.create(data);
      }
      setIsModalOpen(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: AssetCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: AssetCategory) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(category.id);
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const columns = [
    { key: 'code', label: 'Code', filterable: true, searchable: true, exportable: true },
    { key: 'name', label: 'Name', filterable: true, searchable: true, exportable: true },
    { key: 'description', label: 'Description', filterable: true, searchable: true, exportable: true },
    { key: 'parent_name', label: 'Parent', filterable: true, searchable: true, exportable: true },
  ];

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;
  
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Asset Categories
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>

      <AdvancedCustomTable
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => { setSelectedCategory(null); setIsModalOpen(true); }}
        addButtonText="Add Category"
        isLoading={loading}
        title="Asset Categories Management"
      />

      <AssetCategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSave={handleSave}
        categories={categories}
      />
    </div>
  );
} 