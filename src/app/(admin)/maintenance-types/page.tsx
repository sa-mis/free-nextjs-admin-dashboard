"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { maintenanceTypeAPI, MaintenanceType } from '@/services/maintenanceType';
import { useModal } from '@/hooks/useModal';
import MaintenanceTypeFormModal from '@/components/maintenance-type/MaintenanceTypeFormModal';
import MaintenanceTypeDashboard from '@/components/maintenance-type/MaintenanceTypeDashboard';
import Button from '@/components/ui/button/Button';
import PlusIcon from '@/icons/plus.svg';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

const MaintenanceTypesPage: React.FC = () => {
  const { loading: authLoading, hasPermission } = usePageAuth('maintenance-type.view');
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaintenanceType, setSelectedMaintenanceType] = useState<MaintenanceType | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchMaintenanceTypes();
  }, []);

  const fetchMaintenanceTypes = async () => {
    try {
      setLoading(true);
      const response = await maintenanceTypeAPI.getAll();
      setMaintenanceTypes(response.data);
    } catch (error) {
      console.error('Error fetching maintenance types:', error);
      toast.error('Failed to fetch maintenance types');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedMaintenanceType(null);
    openModal();
  };

  const handleEdit = (maintenanceType: MaintenanceType) => {
    setSelectedMaintenanceType(maintenanceType);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this maintenance type?')) {
      return;
    }

    try {
      await maintenanceTypeAPI.delete(id);
      toast.success('Maintenance type deleted successfully');
      fetchMaintenanceTypes();
    } catch (error) {
      console.error('Error deleting maintenance type:', error);
      toast.error('Failed to delete maintenance type');
    }
  };

  const handleSubmit = async (data: Partial<MaintenanceType>) => {
    try {
      if (selectedMaintenanceType) {
        await maintenanceTypeAPI.update(selectedMaintenanceType.id, data);
        toast.success('Maintenance type updated successfully');
      } else {
        await maintenanceTypeAPI.create(data);
        toast.success('Maintenance type created successfully');
      }
      closeModal();
      fetchMaintenanceTypes();
    } catch (error) {
      console.error('Error saving maintenance type:', error);
      toast.error('Failed to save maintenance type');
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Maintenance Types
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage maintenance type definitions for the PM system
        </p>
      </div>

      <div className="mb-6">
        <MaintenanceTypeDashboard />
      </div>

      <div className="mb-6">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Add Maintenance Type
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Maintenance Types List
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {maintenanceTypes.map((maintenanceType) => (
                    <tr key={maintenanceType.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {maintenanceType.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {maintenanceType.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          maintenanceType.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {maintenanceType.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(maintenanceType.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(maintenanceType)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(maintenanceType.id)}
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

      <MaintenanceTypeFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        maintenanceType={selectedMaintenanceType}
      />
    </div>
  );
};

export default MaintenanceTypesPage; 