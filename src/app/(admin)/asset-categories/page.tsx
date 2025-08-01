'use client';

import { useState, useEffect } from 'react';
import { categoryAPI, AssetCategory } from '@/services/category';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import { AssetCategoryFormModal } from '@/components/asset-category/AssetCategoryFormModal';
import Button from '@/components/ui/button/Button';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

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