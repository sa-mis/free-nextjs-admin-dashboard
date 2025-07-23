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
  const [users, setUsers] = useState<any[]>([]);
  const [showAssign, setShowAssign] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{ auditLogs: any[]; transfers: any[] }>({ auditLogs: [], transfers: [] });
  const [assignUserId, setAssignUserId] = useState<number | undefined>(undefined);
  const [transferData, setTransferData] = useState<{ to_division_id: string; to_location: string; to_assigned_to: string; reason: string }>({ to_division_id: '', to_location: '', to_assigned_to: '', reason: '' });
  const [assignLoading, setAssignLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

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

  useEffect(() => {
    userService.getActive().then(result => {
      setUsers(Array.isArray(result) ? result : []);
    });
  }, []);

  const loadModels = async (brandId: number) => {
    try {
      const response = await modelAPI.getModelsByBrand(brandId);
      setModels(response.data);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handleAssign = async () => {
    if (!asset || !assignUserId) return;
    setAssignLoading(true);
    try {
      await assetAPI.assign(asset.id, { assigned_to: assignUserId });
      setShowAssign(false);
      setAssignUserId(undefined);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!asset) return;
    setTransferLoading(true);
    try {
      await assetAPI.transfer(asset.id, {
        to_division_id: Number(transferData.to_division_id),
        to_location: transferData.to_location,
        to_assigned_to: Number(transferData.to_assigned_to),
        reason: transferData.reason
      });
      setShowTransfer(false);
      setTransferData({ to_division_id: '', to_location: '', to_assigned_to: '', reason: '' });
    } finally {
      setTransferLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!asset) return;
    const res = await assetAPI.getHistory(asset.id);
    setHistory(res.data);
    setShowHistory(true);
  };

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
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter asset description"
            />
          </div>

          {/* Category and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                value={formData.category_id || ''}
                onChange={(e) => handleInputChange('category_id', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="brand_id">Brand</Label>
              <select
                id="brand_id"
                value={formData.brand_id || ''}
                onChange={(e) => handleInputChange('brand_id', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Model and Serial Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model_id">Model</Label>
              <select
                id="model_id"
                value={formData.model_id || ''}
                onChange={(e) => handleInputChange('model_id', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.brand_id}
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
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
              <select
                id="vendor_id"
                value={formData.vendor_id || ''}
                onChange={(e) => handleInputChange('vendor_id', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
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
              <select
                id="division_id"
                value={formData.division_id || ''}
                onChange={(e) => handleInputChange('division_id', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="disposed">Disposed</option>
              </select>
            </div>
            <div>
              <Label htmlFor="condition_status">Condition</Label>
              <select
                id="condition_status"
                value={formData.condition_status}
                onChange={(e) => handleInputChange('condition_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Assignment Section */}
        {showAssign && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <Label htmlFor="assign_user">Assign to User</Label>
            <select
              id="assign_user"
              value={assignUserId || ''}
              onChange={e => setAssignUserId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select User</option>
              {Array.isArray(users) && users.map(user => (
                <option key={user.id} value={user.id}>{user.username} ({user.email})</option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <Button onClick={handleAssign} disabled={assignLoading}>{assignLoading ? 'Assigning...' : 'Assign'}</Button>
              <Button variant="outline" onClick={() => setShowAssign(false)}>Cancel</Button>
            </div>
          </div>
        )}
        <Button onClick={() => setShowAssign(true)} className="mb-2">Assign Asset</Button>

        {/* Transfer Section */}
        {showTransfer && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <Label htmlFor="transfer_division">To Division</Label>
            <select
              id="transfer_division"
              value={transferData.to_division_id}
              onChange={e => setTransferData(prev => ({ ...prev, to_division_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Division</option>
              {divisions.map(division => (
                <option key={division.id} value={division.id}>{division.name}</option>
              ))}
            </select>
            <Label htmlFor="transfer_location">To Location</Label>
            <InputField
              id="transfer_location"
              value={transferData.to_location}
              onChange={e => setTransferData(prev => ({ ...prev, to_location: e.target.value }))}
              placeholder="Enter new location"
            />
            <Label htmlFor="transfer_user">To User</Label>
            <select
              id="transfer_user"
              value={transferData.to_assigned_to}
              onChange={e => setTransferData(prev => ({ ...prev, to_assigned_to: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select User</option>
              {Array.isArray(users) && users.map(user => (
                <option key={user.id} value={user.id}>{user.username} ({user.email})</option>
              ))}
            </select>
            <Label htmlFor="transfer_reason">Reason</Label>
            <InputField
              id="transfer_reason"
              value={transferData.reason}
              onChange={e => setTransferData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for transfer"
            />
            <div className="flex gap-2 mt-2">
              <Button onClick={handleTransfer} disabled={transferLoading}>{transferLoading ? 'Transferring...' : 'Transfer'}</Button>
              <Button variant="outline" onClick={() => setShowTransfer(false)}>Cancel</Button>
            </div>
          </div>
        )}
        <Button onClick={() => setShowTransfer(true)} className="mb-2">Transfer Asset</Button>

        {/* History Section */}
        <Button onClick={loadHistory} className="mb-2">View History</Button>
        {showHistory && (
          <div className="mb-4 p-4 bg-gray-50 rounded max-h-64 overflow-y-auto">
            <h3 className="font-semibold mb-2">Asset History</h3>
            <div>
              <strong>Audit Log:</strong>
              <ul className="text-xs">
                {history.auditLogs.map((log: any) => (
                  <li key={log.id} className="mb-1">
                    [{log.performed_at}] {log.action_type} by User {log.performed_by} <br/>
                    Old: {JSON.stringify(log.old_values)} <br/>
                    New: {JSON.stringify(log.new_values)}
                  </li>
                ))}
              </ul>
              <strong>Transfers:</strong>
              <ul className="text-xs">
                {history.transfers.map((tr: any) => (
                  <li key={tr.id} className="mb-1">
                    [{tr.transfer_date}] {tr.from_location} → {tr.to_location}, User {tr.from_assigned_to} → {tr.to_assigned_to}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" onClick={() => setShowHistory(false)}>Close</Button>
          </div>
        )}
      </div>
    </Modal>
  );
} 