'use client';

import { useState, useEffect } from 'react';
import { AssetCategory } from '@/services/asset';
import { assetAPI } from '@/services/asset';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';

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
      const response = await assetAPI.getCategories();
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
        await assetAPI.updateCategory(selectedCategory.id, data);
      } else {
        await assetAPI.createCategory(data);
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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await assetAPI.deleteCategory(id);
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

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

      <ComponentCard>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Parent</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{category.code}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{category.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{category.description}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {category.parent_name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(category.id)}
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