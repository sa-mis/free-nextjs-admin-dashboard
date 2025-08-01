'use client';

import { useState, useEffect } from 'react';
import { AssetCategory } from '@/services/category';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';

interface AssetCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AssetCategory | null;
  onSave: (data: Partial<AssetCategory>) => void;
  categories: AssetCategory[];
}

export function AssetCategoryFormModal({
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
            <TextArea
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              rows={3}
              placeholder="Enter category description"
            />
          </div>

          <div>
            <Label htmlFor="parent_id">Parent Category</Label>
            <Select
              id="parent_id"
              value={formData.parent_id || ''}
              onChange={(value) => handleInputChange('parent_id', value ? parseInt(value.toString()) : undefined)}
              placeholder="Select parent category"
            >
              <option value="">No Parent</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
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
              {category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 