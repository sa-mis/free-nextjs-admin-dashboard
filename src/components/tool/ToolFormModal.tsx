"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Tool } from '@/services/tool';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';

interface ToolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Tool>) => void;
  tool: Tool | null;
}

interface FormData {
  name: string;
  description: string;
  serial_number: string;
  model_number: string;
  tool_category_id: number;
  brand_id: number;
  model_id: number;
  vendor_id: number;
  assigned_to: number;
  status: Tool['status'];
  condition: Tool['condition'];
  purchase_date: string;
  warranty_expiry_date: string;
  location: string;
  notes: string;
  is_active: boolean;
}

const ToolFormModal: React.FC<ToolFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tool,
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
      if (tool) {
        reset({
          name: tool.name,
          description: tool.description || '',
          serial_number: tool.serial_number || '',
          model_number: tool.model_number || '',
          tool_category_id: tool.tool_category_id,
          brand_id: tool.brand_id || 0,
          model_id: tool.model_id || 0,
          vendor_id: tool.vendor_id || 0,
          assigned_to: tool.assigned_to || 0,
          status: tool.status,
          condition: tool.condition,
          purchase_date: tool.purchase_date || '',
          warranty_expiry_date: tool.warranty_expiry_date || '',
          location: tool.location || '',
          notes: tool.notes || '',
          is_active: tool.is_active,
        });
      } else {
        reset({
          name: '',
          description: '',
          serial_number: '',
          model_number: '',
          tool_category_id: 0,
          brand_id: 0,
          model_id: 0,
          vendor_id: 0,
          assigned_to: 0,
          status: 'available',
          condition: 'excellent',
          purchase_date: '',
          warranty_expiry_date: '',
          location: '',
          notes: '',
          is_active: true,
        });
      }
    }
  }, [isOpen, tool, reset]);

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
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {tool ? 'Edit Tool' : 'Add New Tool'}
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
              placeholder="Enter tool name"
              min={undefined}
              max={undefined}
            />
            {errors.name?.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="tool_category_id">Category *</Label>
            <select
              id="tool_category_id"
              {...register('tool_category_id', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Category</option>
              {/* TODO: Load categories from API */}
            </select>
            {errors.tool_category_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tool_category_id.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="serial_number">Serial Number</Label>
            <InputField
              id="serial_number"
              type="text"
              {...register('serial_number')}
              placeholder="Enter serial number"
              min={undefined}
              max={undefined}
            />
          </div>

          <div>
            <Label htmlFor="model_number">Model Number</Label>
            <InputField
              id="model_number"
              type="text"
              {...register('model_number')}
              placeholder="Enter model number"
              min={undefined}
              max={undefined}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="calibration">Calibration</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <select
              id="condition"
              {...register('condition')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <InputField
              id="purchase_date"
              type="date"
              {...register('purchase_date')}
              min={undefined}
              max={undefined}
            />
          </div>

          <div>
            <Label htmlFor="warranty_expiry_date">Warranty Expiry Date</Label>
            <InputField
              id="warranty_expiry_date"
              type="date"
              {...register('warranty_expiry_date')}
              min={undefined}
              max={undefined}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <InputField
            id="location"
            type="text"
            {...register('location')}
            placeholder="Enter tool location"
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

        <div className="flex items-center justify-between">
          <Label htmlFor="is_active">Active Status</Label>
          <Switch
            label=""
            defaultChecked={tool?.is_active ?? true}
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
              tool ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

export default ToolFormModal; 