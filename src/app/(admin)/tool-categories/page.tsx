"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { toolCategoryAPI, ToolCategory } from '@/services/toolCategory';
import { useModal } from '@/hooks/useModal';
import ToolCategoryFormModal from '@/components/tool-category/ToolCategoryFormModal';
import ToolCategoryDashboard from '@/components/tool-category/ToolCategoryDashboard';
import Button from '@/components/ui/button/Button';
import PlusIcon from '@/icons/plus.svg';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

const ToolCategoriesPage: React.FC = () => {
  const { loading: authLoading, hasPermission } = usePageAuth('tool_category.view');
  const [toolCategories, setToolCategories] = useState<ToolCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedToolCategory, setSelectedToolCategory] = useState<ToolCategory | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchToolCategories();
  }, []);

  const fetchToolCategories = async () => {
    try {
      setLoading(true);
      const response = await toolCategoryAPI.getAll();
      setToolCategories(response.data);
    } catch (error) {
      console.error('Error fetching tool categories:', error);
      toast.error('Failed to fetch tool categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedToolCategory(null);
    openModal();
  };

  const handleEdit = (toolCategory: ToolCategory) => {
    setSelectedToolCategory(toolCategory);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tool category?')) {
      return;
    }

    try {
      await toolCategoryAPI.delete(id);
      toast.success('Tool category deleted successfully');
      fetchToolCategories();
    } catch (error) {
      console.error('Error deleting tool category:', error);
      toast.error('Failed to delete tool category');
    }
  };

  const handleSubmit = async (data: Partial<ToolCategory>) => {
    try {
      if (selectedToolCategory) {
        await toolCategoryAPI.update(selectedToolCategory.id, data);
        toast.success('Tool category updated successfully');
      } else {
        await toolCategoryAPI.create(data);
        toast.success('Tool category created successfully');
      }
      closeModal();
      fetchToolCategories();
    } catch (error) {
      console.error('Error saving tool category:', error);
      toast.error('Failed to save tool category');
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tool Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage tool categories with calibration and maintenance requirements
        </p>
      </div>

      <div className="mb-6">
        <ToolCategoryDashboard />
      </div>

      <div className="mb-6">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Add Tool Category
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tool Categories List
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Calibration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Maintenance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tools Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {toolCategories.map((toolCategory) => (
                    <tr key={toolCategory.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {toolCategory.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {toolCategory.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          toolCategory.requires_calibration
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {toolCategory.requires_calibration ? 'Required' : 'Not Required'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          toolCategory.requires_maintenance
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {toolCategory.requires_maintenance ? 'Required' : 'Not Required'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {toolCategory.tools_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          toolCategory.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {toolCategory.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(toolCategory)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(toolCategory.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ToolCategoryFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        toolCategory={selectedToolCategory}
      />
    </div>
  );
};

export default ToolCategoriesPage; 