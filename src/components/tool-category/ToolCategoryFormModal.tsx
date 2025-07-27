"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToolCategory } from '@/services/toolCategory';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';

interface ToolCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ToolCategory>) => void;
  toolCategory: ToolCategory | null;
}

interface FormData {
  name: string;
  description: string;
  requires_calibration: boolean;
  calibration_frequency_days: number;
  requires_maintenance: boolean;
  maintenance_frequency_days: number;
  is_active: boolean;
}

const ToolCategoryFormModal: React.FC<ToolCategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  toolCategory,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const requiresCalibration = watch('requires_calibration');
  const requiresMaintenance = watch('requires_maintenance');

  useEffect(() => {
    if (isOpen) {
      if (toolCategory) {
        reset({
          name: toolCategory.name,
          description: toolCategory.description || '',
          requires_calibration: toolCategory.requires_calibration,
          calibration_frequency_days: toolCategory.calibration_frequency_days || 0,
          requires_maintenance: toolCategory.requires_maintenance,
          maintenance_frequency_days: toolCategory.maintenance_frequency_days || 0,
          is_active: toolCategory.is_active,
        });
      } else {
        reset({
          name: '',
          description: '',
          requires_calibration: false,
          calibration_frequency_days: 0,
          requires_maintenance: false,
          maintenance_frequency_days: 0,
          is_active: true,
        });
      }
    }
  }, [isOpen, toolCategory, reset]);

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
          {toolCategory ? 'Edit Tool Category' : 'Add Tool Category'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name">Name *</Label>
          <InputField
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            placeholder="Enter tool category name"
          />
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_calibration">Requires Calibration</Label>
            <Switch
              id="requires_calibration"
              {...register('requires_calibration')}
              defaultChecked={toolCategory?.requires_calibration ?? false}
            />
          </div>

          {requiresCalibration && (
            <div>
              <Label htmlFor="calibration_frequency_days">Calibration Frequency (days)</Label>
              <InputField
                id="calibration_frequency_days"
                type="number"
                {...register('calibration_frequency_days', { 
                  required: requiresCalibration ? 'Calibration frequency is required' : false,
                  min: { value: 1, message: 'Frequency must be at least 1 day' }
                })}
                error={errors.calibration_frequency_days?.message}
                placeholder="Enter frequency in days"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_maintenance">Requires Maintenance</Label>
            <Switch
              id="requires_maintenance"
              {...register('requires_maintenance')}
              defaultChecked={toolCategory?.requires_maintenance ?? false}
            />
          </div>

          {requiresMaintenance && (
            <div>
              <Label htmlFor="maintenance_frequency_days">Maintenance Frequency (days)</Label>
              <InputField
                id="maintenance_frequency_days"
                type="number"
                {...register('maintenance_frequency_days', { 
                  required: requiresMaintenance ? 'Maintenance frequency is required' : false,
                  min: { value: 1, message: 'Frequency must be at least 1 day' }
                })}
                error={errors.maintenance_frequency_days?.message}
                placeholder="Enter frequency in days"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="is_active">Active Status</Label>
          <Switch
            id="is_active"
            {...register('is_active')}
            defaultChecked={toolCategory?.is_active ?? true}
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
              toolCategory ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

export default ToolCategoryFormModal; 