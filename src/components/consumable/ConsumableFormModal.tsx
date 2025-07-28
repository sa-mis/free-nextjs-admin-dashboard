import { useState, useEffect } from 'react';
import { Consumable, ConsumableStatus } from '@/types/consumable';
import Form from '@/components/form/Form';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { categoryAPI } from '@/services/category';
import { brandAPI } from '@/services/brand';
import { modelAPI } from '@/services/model';
import { vendorAPI } from '@/services/vendor';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'discontinued', label: 'Discontinued' },
];

interface ConsumableFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Consumable>) => Promise<void>;
  initialData?: Partial<Consumable>;
  loading?: boolean;
  error?: string;
}

export default function ConsumableFormModal({ open, onClose, onSubmit, initialData = {}, loading = false, error }: ConsumableFormModalProps) {
  const defaultForm: Partial<Consumable> = {
    consumable_tag: '',
    name: '',
    description: '',
    category_id: undefined,
    brand_id: undefined,
    model_id: undefined,
    vendor_id: undefined,
    unit: '',
    purchase_price: undefined,
    status: 'active',
    stock_quantity: 0,
    min_stock: undefined,
    max_stock: undefined,
    location: '',
    notes: '',
  };
  const [form, setForm] = useState<Partial<Consumable>>({ ...defaultForm, ...initialData });

  // Reset form state when initialData or open changes
  useEffect(() => {
    if (open) setForm({ ...defaultForm, ...initialData });
    // eslint-disable-next-line
  }, [initialData, open]);

  // Select options state
  const [categoryOptions, setCategoryOptions] = useState<{ value: number; label: string }[]>([]);
  const [brandOptions, setBrandOptions] = useState<{ value: number; label: string }[]>([]);
  const [modelOptions, setModelOptions] = useState<{ value: number; label: string }[]>([]);
  const [vendorOptions, setVendorOptions] = useState<{ value: number; label: string }[]>([]);

  // Fetch options on open
  useEffect(() => {
    if (!open) return;
    (async () => {
      const [categoriesRes, brandsRes, vendorsRes] = await Promise.all([
        categoryAPI.getAll(),
        brandAPI.getAll(),
        vendorAPI.getAll(),
      ]);
      setCategoryOptions((categoriesRes?.data || []).map((c: any) => ({ value: c.id, label: c.name })));
      setBrandOptions((brandsRes?.data || []).map((b: any) => ({ value: b.id, label: b.name })));
      setVendorOptions((vendorsRes?.data || []).map((v: any) => ({ value: v.id, label: v.name })));
    })();
  }, [open]);

  // Fetch models when brand changes
  useEffect(() => {
    if (!form.brand_id) {
      setModelOptions([]);
      return;
    }
    (async () => {
      const modelsRes = await modelAPI.getModelsByBrand(Number(form.brand_id));
      setModelOptions((modelsRes?.data || []).map((m: any) => ({ value: m.id, label: m.name })));
    })();
  }, [form.brand_id]);

  // Reset model_id if brand changes
  useEffect(() => {
    setForm(prev => ({ ...prev, model_id: undefined }));
    // eslint-disable-next-line
  }, [form.brand_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {form.id ? 'Edit Consumable' : 'Add New Consumable'}
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
          <Form onSubmit={handleSubmit}>
            {/* Section: Basic Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-base">Basic Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consumable_tag">Tag</Label>
                  <input id="consumable_tag" name="consumable_tag" value={form.consumable_tag} onChange={handleChange} className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" required />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea id="description" name="description" value={form.description} onChange={handleChange} className="h-20 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" />
                </div>
              </div>
            </div>
            {/* Section: Classification */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-base">Classification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select options={categoryOptions} value={form.category_id ?? ''} onChange={v => handleSelectChange('category_id', v)} />
                </div>
                <div>
                  <Label htmlFor="brand_id">Brand</Label>
                  <Select options={brandOptions} value={form.brand_id ?? ''} onChange={v => handleSelectChange('brand_id', v)} />
                </div>
                <div>
                  <Label htmlFor="model_id">Model</Label>
                  <Select options={modelOptions} value={form.model_id ?? ''} onChange={v => handleSelectChange('model_id', v)} />
                </div>
                <div>
                  <Label htmlFor="vendor_id">Vendor</Label>
                  <Select options={vendorOptions} value={form.vendor_id ?? ''} onChange={v => handleSelectChange('vendor_id', v)} />
                </div>
              </div>
            </div>
            {/* Section: Stock & Financial */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-base">Stock & Financial</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <input id="unit" name="unit" value={form.unit} onChange={handleChange} className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" />
                </div>
                <div>
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <input id="purchase_price" name="purchase_price" type="number" value={form.purchase_price ?? ''} onChange={handleChange} className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select options={statusOptions} value={form.status || 'active'} onChange={v => handleSelectChange('status', v)} />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Stock</Label>
                  <input id="stock_quantity" name="stock_quantity" type="number" value={form.stock_quantity ?? 0} onChange={handleChange} className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" />
                </div>
                <div>
                  <Label htmlFor="min_stock">Min Stock</Label>
                  <input id="min_stock" name="min_stock" type="number" value={form.min_stock ?? ''} onChange={handleChange} className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" />
                </div>
                <div>
                  <Label htmlFor="max_stock">Max Stock</Label>
                  <input id="max_stock" name="max_stock" type="number" value={form.max_stock ?? ''} onChange={handleChange} className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" />
                </div>
              </div>
            </div>
            {/* Section: Additional Info */}
            <div className="mb-2">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-base">Additional Info</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <input id="location" name="location" value={form.location} onChange={handleChange} className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} className="h-20 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs" />
                </div>
              </div>
            </div>
            {/* Sticky Actions */}
            <div className="flex gap-2 mt-6 justify-end sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-2 z-10">
              <button type="submit" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300" onClick={onClose}>Cancel</button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
} 