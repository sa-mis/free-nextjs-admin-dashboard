'use client';

import { useState, useEffect } from 'react';
import { Asset } from '@/services/asset';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { assetAPI } from '@/services/asset';
import { categoryAPI } from '@/services/category';
import { brandAPI } from '@/services/brand';
import { vendorAPI } from '@/services/vendor';
import { userService } from '@/services/organization';
import { modelAPI } from '@/services/model';
import TextArea from '../form/input/TextArea';
import Select from '../form/Select';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSave: (data: Partial<Asset>) => void;
  divisions: any[];
  categories: any[];
  brands: any[];
  vendors: any[];
}

export function AssetFormModal({
  isOpen,
  onClose,
  asset,
  onSave,
  divisions,
  categories,
  brands,
  vendors
}: AssetFormModalProps) {
  const [formData, setFormData] = useState<Partial<Asset>>({
    asset_tag: '',
    name: '',
    description: '',
    category_id: undefined,
    brand_id: undefined,
    model_id: undefined,
    serial_number: '',
    purchase_date: '',
    purchase_order: '',
    received_date: '',
    purchase_price: undefined,
    vendor_id: undefined,
    warranty_start_date: '',
    warranty_end_date: '',
    location: '',
    division_id: undefined,
    assigned_to: undefined,
    status: 'active',
    condition_status: 'good',
    notes: ''
  });
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        asset_tag: asset.asset_tag,
        name: asset.name,
        description: asset.description || '',
        category_id: asset.category_id,
        brand_id: asset.brand_id,
        model_id: asset.model_id,
        serial_number: asset.serial_number || '',
        purchase_date: asset.purchase_date || '',
        purchase_order: asset.purchase_order || '',
        received_date: asset.received_date || '',
        purchase_price: asset.purchase_price,
        vendor_id: asset.vendor_id,
        warranty_start_date: asset.warranty_start_date || '',
        warranty_end_date: asset.warranty_end_date || '',
        location: asset.location || '',
        division_id: asset.division_id,
        assigned_to: asset.assigned_to,
        status: asset.status,
        condition_status: asset.condition_status,
        notes: asset.notes || ''
      });
    } else {
      setFormData({
        asset_tag: '',
        name: '',
        description: '',
        category_id: undefined,
        brand_id: undefined,
        model_id: undefined,
        serial_number: '',
        purchase_date: '',
        purchase_order: '',
        received_date: '',
        purchase_price: undefined,
        vendor_id: undefined,
        warranty_start_date: '',
        warranty_end_date: '',
        location: '',
        division_id: undefined,
        assigned_to: undefined,
        status: 'active',
        condition_status: 'good',
        notes: ''
      });
    }
  }, [asset]);

  useEffect(() => {
    if (formData.brand_id) {
      loadModels(formData.brand_id);
    } else {
      setModels([]);
    }
  }, [formData.brand_id]);

  const loadModels = async (brandId: number) => {
    try {
      const response = await modelAPI.getModelsByBrand(brandId);
      setModels(response.data);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  function cleanAccessoryPayload(form: any) {
    // List all related dropdown fields that should be integer or null
    const fields = ['brand_id', 'model_id', 'vendor_id', 'category_id'];
    const cleaned = { ...form };
    fields.forEach((field) => {
      if (cleaned[field] === '' || cleaned[field] === undefined) {
        cleaned[field] = null;
      } else {
        cleaned[field] = Number(cleaned[field]);
      }
    });
    return cleaned;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Clean date fields: convert empty string or invalid date to null
      const cleanData: Record<string, any> = { ...formData };
      [
        'purchase_date',
        'received_date',
        'warranty_start_date',
        'warranty_end_date'
      ].forEach((field) => {
        if (!cleanData[field] || cleanData[field] === '' || cleanData[field] === 'Invalid date') {
          cleanData[field] = null;
        }
      });
      await onSave(cleanData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {asset ? 'Edit Asset' : 'Add New Asset'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset_tag">
                Asset Tag <span className="text-error-500 ml-1">*</span>
              </Label>
              <InputField
                id="asset_tag"
                value={formData.asset_tag}
                onChange={(e) => handleInputChange('asset_tag', e.target.value)}
                placeholder="Enter asset tag"
              />
            </div>
            <div>
              <Label htmlFor="name">
                Asset Name <span className="text-error-500 ml-1">*</span>
              </Label>
              <InputField
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter asset name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter asset description"
            />
          </div>

          {/* Category and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category_id">Category</Label>
              <Select
                id="category_id"
                value={formData.category_id || ''}
                onChange={(value) => handleInputChange('category_id', value ? parseInt(value.toString()) : undefined)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="brand_id">Brand</Label>
              <Select
                id="brand_id"
                value={formData.brand_id || ''}
                onChange={(value) => handleInputChange('brand_id', value ? parseInt(value.toString()) : undefined)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Model and Serial Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model_id">Model</Label>
              <Select
                value={formData.model_id || ''}
                onChange={(value) => handleInputChange('model_id', value ? parseInt(value.toString()) : undefined)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.brand_id}
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="serial_number">Serial Number</Label>
              <InputField
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => handleInputChange('serial_number', e.target.value)}
                placeholder="Enter serial number"
              />
            </div>
          </div>

          {/* Purchase Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <InputField
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleInputChange('purchase_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="purchase_order">Purchase Order</Label>
              <InputField
                id="purchase_order"
                value={formData.purchase_order}
                onChange={(e) => handleInputChange('purchase_order', e.target.value)}
                placeholder="Enter PO number"
              />
            </div>
            <div>
              <Label htmlFor="purchase_price">Purchase Price</Label>
              <InputField
                id="purchase_price"
                type="number"
                step={0.01}
                value={formData.purchase_price || ''}
                onChange={(e) => handleInputChange('purchase_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* Vendor and Warranty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vendor_id">Vendor</Label>
              <Select
                id="vendor_id"
                value={formData.vendor_id || ''}
                onChange={(value) => handleInputChange('vendor_id', value ? parseInt(value.toString()) : undefined)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="warranty_start_date">Warranty Start</Label>
              <InputField
                id="warranty_start_date"
                type="date"
                value={formData.warranty_start_date}
                onChange={(e) => handleInputChange('warranty_start_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="warranty_end_date">Warranty End</Label>
              <InputField
                id="warranty_end_date"
                type="date"
                value={formData.warranty_end_date}
                onChange={(e) => handleInputChange('warranty_end_date', e.target.value)}
              />
            </div>
          </div>

          {/* Location and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <InputField
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="division_id">Division</Label>
              <Select
                id="division_id"
                value={formData.division_id || ''}
                onChange={(value) => handleInputChange('division_id', value ? parseInt(value.toString()) : undefined)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Status and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="disposed">Disposed</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition_status">Condition</Label>
              <Select
                id="condition_status"
                value={formData.condition_status}
                onChange={(value) => handleInputChange('condition_status', value)}
                // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <TextArea
              value={formData.notes}
              onChange={(value) => handleInputChange('notes', value)}
              // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter additional notes"
            />
          </div>

          {/* Form Actions */}
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
            >
              {loading ? 'Saving...' : (asset ? 'Update Asset' : 'Create Asset')}
            </Button>
          </div>
        </form>


      </div>
    </Modal>
  );
} 