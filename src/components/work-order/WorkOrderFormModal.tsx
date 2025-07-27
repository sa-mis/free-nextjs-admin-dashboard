"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { WorkOrder } from '@/services/workOrder';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';

interface WorkOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<WorkOrder>) => void;
  workOrder: WorkOrder | null;
}

interface FormData {
  title: string;
  description: string;
  asset_id: number;
  tool_id: number;
  maintenance_type_id: number;
  priority: WorkOrder['priority'];
  status: WorkOrder['status'];
  assigned_to: number;
  responsible_division_id: number;
  estimated_start_date: string;
  estimated_end_date: string;
  estimated_hours: number;
  estimated_cost: number;
  location: string;
  notes: string;
}

const WorkOrderFormModal: React.FC<WorkOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workOrder,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (isOpen) {
      if (workOrder) {
        reset({
          title: workOrder.title,
          description: workOrder.description || '',
          asset_id: workOrder.asset_id || 0,
          tool_id: workOrder.tool_id || 0,
          maintenance_type_id: workOrder.maintenance_type_id,
          priority: workOrder.priority,
          status: workOrder.status,
          assigned_to: workOrder.assigned_to || 0,
          responsible_division_id: workOrder.responsible_division_id || 0,
          estimated_start_date: workOrder.estimated_start_date || '',
          estimated_end_date: workOrder.estimated_end_date || '',
          estimated_hours: workOrder.estimated_hours,
          estimated_cost: workOrder.estimated_cost,
          location: workOrder.location || '',
          notes: workOrder.notes || '',
        });
      } else {
        reset({
          title: '',
          description: '',
          asset_id: 0,
          tool_id: 0,
          maintenance_type_id: 0,
          priority: 'medium',
          status: 'draft',
          assigned_to: 0,
          responsible_division_id: 0,
          estimated_start_date: '',
          estimated_end_date: '',
          estimated_hours: 0,
          estimated_cost: 0,
          location: '',
          notes: '',
        });
      }
    }
  }, [isOpen, workOrder, reset]);

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={workOrder ? 'Edit Work Order' : 'Add Work Order'}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <InputField
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
              error={errors.title?.message}
              placeholder="Enter work order title"
            />
          </div>

          <div>
            <Label htmlFor="maintenance_type_id">Maintenance Type *</Label>
            <select
              id="maintenance_type_id"
              {...register('maintenance_type_id', { required: 'Maintenance type is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Maintenance Type</option>
              {/* TODO: Load maintenance types from API */}
            </select>
            {errors.maintenance_type_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maintenance_type_id.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="asset_id">Asset</Label>
            <select
              id="asset_id"
              {...register('asset_id')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Asset (Optional)</option>
              {/* TODO: Load assets from API */}
            </select>
          </div>

          <div>
            <Label htmlFor="tool_id">Tool</Label>
            <select
              id="tool_id"
              {...register('tool_id')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Tool (Optional)</option>
              {/* TODO: Load tools from API */}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              {...register('priority')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <Label htmlFor="assigned_to">Assigned To</Label>
            <select
              id="assigned_to"
              {...register('assigned_to')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select User (Optional)</option>
              {/* TODO: Load users from API */}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estimated_start_date">Estimated Start Date</Label>
            <InputField
              id="estimated_start_date"
              type="date"
              {...register('estimated_start_date')}
            />
          </div>

          <div>
            <Label htmlFor="estimated_end_date">Estimated End Date</Label>
            <InputField
              id="estimated_end_date"
              type="date"
              {...register('estimated_end_date')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="estimated_hours">Estimated Hours</Label>
            <InputField
              id="estimated_hours"
              type="number"
              step="0.5"
              {...register('estimated_hours', { 
                required: 'Estimated hours is required',
                min: { value: 0, message: 'Hours must be at least 0' }
              })}
              error={errors.estimated_hours?.message}
              placeholder="Enter estimated hours"
            />
          </div>

          <div>
            <Label htmlFor="estimated_cost">Estimated Cost</Label>
            <InputField
              id="estimated_cost"
              type="number"
              step="0.01"
              {...register('estimated_cost', { 
                required: 'Estimated cost is required',
                min: { value: 0, message: 'Cost must be at least 0' }
              })}
              error={errors.estimated_cost?.message}
              placeholder="Enter estimated cost"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <InputField
              id="location"
              type="text"
              {...register('location')}
              placeholder="Enter location"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter description (optional)"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter notes (optional)"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              workOrder ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WorkOrderFormModal; 