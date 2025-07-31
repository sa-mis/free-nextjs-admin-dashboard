"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PmSchedule } from '@/services/pmSchedule';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import TextArea from '../form/input/TextArea';
import Select from '../form/Select';

interface PmScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PmSchedule>) => void;
  pmSchedule: PmSchedule | null;
}

interface FormData {
  name: string;
  description: string;
  asset_id: number;
  tool_id: number;
  maintenance_type_id: number;
  frequency_type: PmSchedule['frequency_type'];
  frequency_value: number;
  estimated_hours: number;
  estimated_cost: number;
  assigned_to: number;
  responsible_division_id: number;
  is_active: boolean;
}

const PmScheduleFormModal: React.FC<PmScheduleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  pmSchedule,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const frequencyType = watch('frequency_type');

  useEffect(() => {
    if (isOpen) {
      if (pmSchedule) {
        reset({
          name: pmSchedule.name,
          description: pmSchedule.description || '',
          asset_id: pmSchedule.asset_id || 0,
          tool_id: pmSchedule.tool_id || 0,
          maintenance_type_id: pmSchedule.maintenance_type_id,
          frequency_type: pmSchedule.frequency_type,
          frequency_value: pmSchedule.frequency_value,
          estimated_hours: pmSchedule.estimated_hours,
          estimated_cost: pmSchedule.estimated_cost,
          assigned_to: pmSchedule.assigned_to || 0,
          responsible_division_id: pmSchedule.responsible_division_id || 0,
          is_active: pmSchedule.is_active,
        });
      } else {
        reset({
          name: '',
          description: '',
          asset_id: 0,
          tool_id: 0,
          maintenance_type_id: 0,
          frequency_type: 'monthly',
          frequency_value: 1,
          estimated_hours: 0,
          estimated_cost: 0,
          assigned_to: 0,
          responsible_division_id: 0,
          is_active: true,
        });
      }
    }
  }, [isOpen, pmSchedule, reset]);

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {pmSchedule ? 'Edit PM Schedule' : 'Add PM Schedule'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <InputField
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name?.message}
              hint={errors.name?.message}
              placeholder="Enter PM schedule name"
            />
          </div>

          <div>
            <Label htmlFor="maintenance_type_id">Maintenance Type *</Label>
            <Select
              id="maintenance_type_id"
              {...register('maintenance_type_id', { required: 'Maintenance type is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Maintenance Type</option>
              {/* TODO: Load maintenance types from API */}
            </Select>
            {errors.maintenance_type_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maintenance_type_id.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="asset_id">Asset</Label>
            <Select
              id="asset_id"
              {...register('asset_id')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Asset (Optional)</option>
              {/* TODO: Load assets from API */}
            </Select>
          </div>

          <div>
            <Label htmlFor="tool_id">Tool</Label>
            <Select
              id="tool_id"
              {...register('tool_id')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Tool (Optional)</option>
              {/* TODO: Load tools from API */}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="frequency_type">Frequency Type</Label>
            <Select
              id="frequency_type"
              {...register('frequency_type')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semi_annual">Semi-Annual</option>
              <option value="annual">Annual</option>
              <option value="custom">Custom</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="frequency_value">Frequency Value</Label>
            <InputField
              id="frequency_value"
              type="number"
              min="1"
              {...register('frequency_value', { 
                required: 'Frequency value is required',
                min: { value: 1, message: 'Value must be at least 1' }
              })}
              error={!!errors.frequency_value?.message}
              hint={errors.frequency_value?.message}
              placeholder="Enter frequency value"
            />
          </div>

          <div>
            <Label htmlFor="estimated_hours">Estimated Hours</Label>
            <InputField
              id="estimated_hours"
              type="number"
              step={0.5}
              min="0"
              {...register('estimated_hours', { 
                required: 'Estimated hours is required',
                min: { value: 0, message: 'Hours must be at least 0' }
              })}
              error={!!errors.estimated_hours?.message}
              hint={errors.estimated_hours?.message}
              placeholder="Enter estimated hours"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="assigned_to">Assigned To</Label>
            <Select
              id="assigned_to"
              {...register('assigned_to')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select User (Optional)</option>
              {/* TODO: Load users from API */}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            {...register('description')}
            rows={3}
            // className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter description (optional)"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="is_active">Active Status</Label>
          <Switch
            id="is_active"
            {...register('is_active')}
            defaultChecked={pmSchedule?.is_active ?? true}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              pmSchedule ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

export default PmScheduleFormModal; 