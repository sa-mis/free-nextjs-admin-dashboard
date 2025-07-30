"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MaintenanceType } from '@/services/maintenanceType';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';

interface MaintenanceTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MaintenanceType>) => void;
  maintenanceType: MaintenanceType | null;
}

interface FormData {
  name: string;
  description: string;
  is_active: boolean;
}

const MaintenanceTypeFormModal: React.FC<MaintenanceTypeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  maintenanceType,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (isOpen) {
      if (maintenanceType) {
        reset({
          name: maintenanceType.name,
          description: maintenanceType.description || '',
          is_active: maintenanceType.is_active,
        });
      } else {
        reset({
          name: '',
          description: '',
          is_active: true,
        });
      }
    }
  }, [isOpen, maintenanceType, reset]);

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
    <Modal isOpen={isOpen} onClose={onClose} title={maintenanceType ? 'Edit Maintenance Type' : 'Add Maintenance Type'}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {maintenanceType ? 'Edit Maintenance Type' : 'Add Maintenance Type'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Name *</Label>
            <InputField
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name?.message}
              placeholder="Enter maintenance type name"
              min={undefined}
              max={undefined}
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

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active Status</Label>
            <Switch
              label=""
              defaultChecked={maintenanceType?.is_active ?? true}
              onChange={(checked) => {
                setValue('is_active', checked);
              }}
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
                maintenanceType ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MaintenanceTypeFormModal; 