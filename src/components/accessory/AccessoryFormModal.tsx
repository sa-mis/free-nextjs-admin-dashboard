import { useEffect, useState } from 'react';
import { accessoryAPI } from '@/services/accessory';
import { categoryAPI } from '@/services/category';
import { brandAPI } from '@/services/brand';
import { vendorAPI } from '@/services/vendor';
import { modelAPI } from '@/services/model';

interface AccessoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function AccessoryFormModal({ open, onClose, onSuccess, initialData }: AccessoryFormModalProps) {
  const [form, setForm] = useState<any>(initialData || {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (form.id) {
        await accessoryAPI.updateAccessory(form.id, form);
      } else {
        await accessoryAPI.createAccessory(form);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving accessory');
    }
    setLoading(false);
  };

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white p-6 rounded shadow w-[500px] max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">{form.id ? 'Edit' : 'Create'} Accessory</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-2">
          <label>Tag</label>
          <input name="accessory_tag" value={form.accessory_tag} onChange={handleChange} className="w-full border px-2 py-1" required />
        </div>
        <div className="mb-2">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border px-2 py-1" required />
        </div>
        <div className="mb-2">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label>Category</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full border px-2 py-1">
            <option value="">Select category</option>
            {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label>Brand</label>
          <select name="brand_id" value={form.brand_id} onChange={handleChange} className="w-full border px-2 py-1">
            <option value="">Select brand</option>
            {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label>Model</label>
          <select name="model_id" value={form.model_id} onChange={handleChange} className="w-full border px-2 py-1">
            <option value="">Select model</option>
            {models.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label>Vendor</label>
          <select name="vendor_id" value={form.vendor_id} onChange={handleChange} className="w-full border px-2 py-1">
            <option value="">Select vendor</option>
            {vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label>Serial Number</label>
          <input name="serial_number" value={form.serial_number} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label>Purchase Date</label>
          <input name="purchase_date" type="date" value={form.purchase_date} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label>Purchase Price</label>
          <input name="purchase_price" type="number" value={form.purchase_price} onChange={handleChange} className="w-full border px-2 py-1" min={0} step="0.01" />
        </div>
        <div className="mb-2">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border px-2 py-1">
            <option value="active">Active</option>
            <option value="in_use">In Use</option>
            <option value="damaged">Damaged</option>
            <option value="disposed">Disposed</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Stock Quantity</label>
          <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} className="w-full border px-2 py-1" min={0} />
        </div>
        <div className="mb-2">
          <label>Min Stock</label>
          <input name="min_stock" type="number" value={form.min_stock} onChange={handleChange} className="w-full border px-2 py-1" min={0} />
        </div>
        <div className="mb-2">
          <label>Max Stock</label>
          <input name="max_stock" type="number" value={form.max_stock} onChange={handleChange} className="w-full border px-2 py-1" min={0} />
        </div>
        <div className="mb-2">
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
} 