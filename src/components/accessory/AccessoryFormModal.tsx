import { useEffect, useState } from 'react';
import { accessoryAPI } from '@/services/accessory';
import { categoryAPI } from '@/services/category';
import { brandAPI } from '@/services/brand';
import { vendorAPI } from '@/services/vendor';
import { modelAPI } from '@/services/model';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';

interface AccessoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function AccessoryFormModal({ open, onClose, onSuccess, initialData }: AccessoryFormModalProps) {
  const [form, setForm] = useState<any>({
    accessory_tag: '',
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    model_id: '',
    vendor_id: '',
    serial_number: '',
    purchase_date: '',
    purchase_price: '',
    status: 'active',
    stock_quantity: 0,
    min_stock: 0,
    max_stock: 0,
    location: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    categoryAPI.getAll().then(res => setCategories(res.data));
    brandAPI.getAll().then(res => setBrands(res.data));
    vendorAPI.getAll().then(res => setVendors(res.data));
  }, [open]);

  useEffect(() => {
    if (form.brand_id) {
      modelAPI.getModelsByBrand(form.brand_id).then(res => setModels(res.data));
    } else {
      setModels([]);
    }
  }, [form.brand_id]);

  useEffect(() => {
    setForm(initialData || {
      accessory_tag: '',
      name: '',
      description: '',
      category_id: '',
      brand_id: '',
      model_id: '',
      vendor_id: '',
      serial_number: '',
      purchase_date: '',
      purchase_price: '',
      status: 'active',
      stock_quantity: 0,
      min_stock: 0,
      max_stock: 0,
      location: '',
      notes: '',
    });
  }, [initialData, open]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    handleChange(name, type === 'number' ? (value === '' ? '' : Number(value)) : value);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  function cleanAccessoryPayload(form: any) {
    // List all related dropdown fields that should be integer or null
    const fields = ['brand_id', 'model_id', 'vendor_id', 'category_id', 'purchase_date', 'purchase_price', 'stock_quantity', 'min_stock', 'max_stock'];
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
    setError('');
    try {
      const payload = cleanAccessoryPayload(form);
      if (form.id) {
        await accessoryAPI.updateAccessory(form.id, payload);
      } else {
        await accessoryAPI.createAccessory(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving accessory');
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {form.id ? 'Edit Accessory' : 'Add New Accessory'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accessory_tag">Accessory Tag <span className="text-error-500 ml-1">*</span></Label>
              <InputField
                id="accessory_tag"
                name="accessory_tag"
                value={form.accessory_tag}
                onChange={handleInputChange}
                placeholder="Enter accessory tag"
              />
            </div>
            <div>
              <Label htmlFor="name">Accessory Name <span className="text-error-500 ml-1">*</span></Label>
              <InputField
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter accessory name"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleFieldChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter accessory description"
            />
          </div>
          {/* Category and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                name="category_id"
                value={form.category_id || ''}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="brand_id">Brand</Label>
              <select
                id="brand_id"
                name="brand_id"
                value={form.brand_id || ''}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
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
                name="model_id"
                value={form.model_id || ''}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!form.brand_id}
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="serial_number">Serial Number</Label>
              <InputField
                id="serial_number"
                name="serial_number"
                value={form.serial_number}
                onChange={handleInputChange}
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
                name="purchase_date"
                type="date"
                value={form.purchase_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="purchase_price">Purchase Price</Label>
              <InputField
                id="purchase_price"
                name="purchase_price"
                type="number"
                step={0.01}
                value={form.purchase_price?.toString() ?? ''}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
            </div>
            <div>
              <Label htmlFor="vendor_id">Vendor</Label>
              <select
                id="vendor_id"
                name="vendor_id"
                value={form.vendor_id || ''}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Stock and Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <InputField
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                value={form.stock_quantity?.toString() ?? ''}
                onChange={handleInputChange}
                placeholder="Enter stock quantity"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="min_stock">Min Stock</Label>
              <InputField
                id="min_stock"
                name="min_stock"
                type="number"
                value={form.min_stock?.toString() ?? ''}
                onChange={handleInputChange}
                placeholder="Enter min stock"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="max_stock">Max Stock</Label>
              <InputField
                id="max_stock"
                name="max_stock"
                type="number"
                value={form.max_stock?.toString() ?? ''}
                onChange={handleInputChange}
                placeholder="Enter max stock"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <InputField
                id="location"
                name="location"
                value={form.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="in_use">In Use</option>
                <option value="damaged">Damaged</option>
                <option value="disposed">Disposed</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleFieldChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter additional notes"
            />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button disabled={loading}>
              {loading ? 'Saving...' : (form.id ? 'Update Accessory' : 'Create Accessory')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 