"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { toolAPI, Tool } from '@/services/tool';
import { useModal } from '@/hooks/useModal';
import ToolFormModal from '@/components/tool/ToolFormModal';
import ToolDashboard from '@/components/tool/ToolDashboard';
import Button from '@/components/ui/button/Button';
import PlusIcon from '@/icons/plus.svg';

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await toolAPI.getAll();
      setTools(response.data);
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast.error('Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTool(null);
    openModal();
  };

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tool?')) {
      return;
    }

    try {
      await toolAPI.delete(id);
      toast.success('Tool deleted successfully');
      fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
    }
  };

  const handleSubmit = async (data: Partial<Tool>) => {
    try {
      if (selectedTool) {
        await toolAPI.update(selectedTool.id, data);
        toast.success('Tool updated successfully');
      } else {
        await toolAPI.create(data);
        toast.success('Tool created successfully');
      }
      closeModal();
      fetchTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      toast.error('Failed to save tool');
    }
  };

  const getStatusColor = (status: Tool['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_use':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'calibration':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'retired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getConditionColor = (condition: Tool['condition']) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage tool inventory with calibration and maintenance tracking
        </p>
      </div>

      <div className="mb-6">
        <ToolDashboard />
      </div>

      <div className="mb-6">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Add Tool
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tools List
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
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Next Calibration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Next Maintenance
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {tool.name}
                          </div>
                          {tool.serial_number && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              S/N: {tool.serial_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {tool.tool_category?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tool.status)}`}>
                          {tool.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(tool.condition)}`}>
                          {tool.condition.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {tool.next_calibration_date ? new Date(tool.next_calibration_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {tool.next_maintenance_date ? new Date(tool.next_maintenance_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(tool)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tool.id)}
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

      <ToolFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        tool={selectedTool}
      />
    </div>
  );
};

export default ToolsPage; 