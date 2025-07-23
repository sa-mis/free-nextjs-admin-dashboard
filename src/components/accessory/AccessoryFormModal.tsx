import { useState } from 'react';
import { createAccessory, updateAccessory } from '@/services/accessory';

interface AccessoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function AccessoryFormModal({ open, onClose, onSuccess, initialData }: AccessoryFormModalProps) {
  const [form, setForm] = useState(initialData || {
    accessory_tag: '',
    name: '',
    status: 'active',
    stock_quantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (form.id) {
        await updateAccessory(form.id, form);
      } else {
        await createAccessory(form);
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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
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
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border px-2 py-1">
            <option value="active">Active</option>
            <option value="in_use">In Use</option>
            <option value="damaged">Damaged</option>
            <option value="disposed">Disposed</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Stock</label>
          <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} className="w-full border px-2 py-1" min={0} />
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
} 