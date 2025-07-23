import { useState } from 'react';
import { assignAccessory } from '@/services/accessory';

interface AccessoryAssignModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessory: any;
}

export default function AccessoryAssignModal({ open, onClose, onSuccess, accessory }: AccessoryAssignModalProps) {
  const [form, setForm] = useState({
    assigned_to_type: 'asset',
    assigned_to_id: '',
    quantity: 1,
    assigned_date: '',
    notes: '',
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
      await assignAccessory(accessory.id, form);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error assigning accessory');
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Assign Accessory</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-2">
          <label>Assign To</label>
          <select name="assigned_to_type" value={form.assigned_to_type} onChange={handleChange} className="w-full border px-2 py-1">
            <option value="asset">Asset</option>
            <option value="user">User</option>
            <option value="location">Location</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Assigned To ID</label>
          <input name="assigned_to_id" value={form.assigned_to_id} onChange={handleChange} className="w-full border px-2 py-1" required />
        </div>
        <div className="mb-2">
          <label>Quantity</label>
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} className="w-full border px-2 py-1" min={1} />
        </div>
        <div className="mb-2">
          <label>Date</label>
          <input name="assigned_date" type="date" value={form.assigned_date} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label>Notes</label>
          <input name="notes" value={form.notes} onChange={handleChange} className="w-full border px-2 py-1" />
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Assigning...' : 'Assign'}</button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
} 