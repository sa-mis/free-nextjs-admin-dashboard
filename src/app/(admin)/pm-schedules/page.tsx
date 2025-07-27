"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { pmScheduleAPI, PmSchedule } from '@/services/pmSchedule';
import { useModal } from '@/hooks/useModal';
import PmScheduleFormModal from '@/components/pm-schedule/PmScheduleFormModal';
import PmScheduleDashboard from '@/components/pm-schedule/PmScheduleDashboard';
import Button from '@/components/ui/button/Button';
import PlusIcon from '@/icons/plus.svg';

const PmSchedulesPage: React.FC = () => {
  const [pmSchedules, setPmSchedules] = useState<PmSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPmSchedule, setSelectedPmSchedule] = useState<PmSchedule | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchPmSchedules();
  }, []);

  const fetchPmSchedules = async () => {
    try {
      setLoading(true);
      const response = await pmScheduleAPI.getAll();
      setPmSchedules(response.data);
    } catch (error) {
      console.error('Error fetching PM schedules:', error);
      toast.error('Failed to fetch PM schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPmSchedule(null);
    openModal();
  };

  const handleEdit = (pmSchedule: PmSchedule) => {
    setSelectedPmSchedule(pmSchedule);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this PM schedule?')) {
      return;
    }

    try {
      await pmScheduleAPI.delete(id);
      toast.success('PM schedule deleted successfully');
      fetchPmSchedules();
    } catch (error) {
      console.error('Error deleting PM schedule:', error);
      toast.error('Failed to delete PM schedule');
    }
  };

  const handleSubmit = async (data: Partial<PmSchedule>) => {
    try {
      if (selectedPmSchedule) {
        await pmScheduleAPI.update(selectedPmSchedule.id, data);
        toast.success('PM schedule updated successfully');
      } else {
        await pmScheduleAPI.create(data);
        toast.success('PM schedule created successfully');
      }
      closeModal();
      fetchPmSchedules();
    } catch (error) {
      console.error('Error saving PM schedule:', error);
      toast.error('Failed to save PM schedule');
    }
  };

  const handleGenerateWorkOrder = async (id: number) => {
    try {
      await pmScheduleAPI.generateWorkOrder(id);
      toast.success('Work order generated successfully');
      fetchPmSchedules();
    } catch (error) {
      console.error('Error generating work order:', error);
      toast.error('Failed to generate work order');
    }
  };

  const getStatusColor = (nextDueDate: string) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    } else if (diffDays <= 7) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getStatusText = (nextDueDate: string) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'OVERDUE';
    } else if (diffDays <= 7) {
      return 'DUE SOON';
    } else {
      return 'ON SCHEDULE';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          PM Schedules
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage preventive maintenance schedules and generate work orders
        </p>
      </div>

      <div className="mb-6">
        <PmScheduleDashboard />
      </div>

      <div className="mb-6">
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Add PM Schedule
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            PM Schedules List
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
                      Asset/Tool
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Maintenance Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Next Due
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pmSchedules.map((pmSchedule) => (
                    <tr key={pmSchedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {pmSchedule.name}
                          </div>
                          {pmSchedule.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {pmSchedule.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {pmSchedule.asset?.name || pmSchedule.tool?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {pmSchedule.maintenance_type?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {pmSchedule.frequency_value} {pmSchedule.frequency_type}
                        {pmSchedule.frequency_value > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(pmSchedule.next_due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pmSchedule.next_due_date)}`}>
                          {getStatusText(pmSchedule.next_due_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {pmSchedule.assigned_user?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleGenerateWorkOrder(pmSchedule.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                          title="Generate Work Order"
                        >
                          Generate WO
                        </button>
                        <button
                          onClick={() => handleEdit(pmSchedule)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pmSchedule.id)}
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

      <PmScheduleFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        pmSchedule={selectedPmSchedule}
      />
    </div>
  );
};

export default PmSchedulesPage; 