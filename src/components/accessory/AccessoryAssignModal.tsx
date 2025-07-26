import { useState } from 'react';
import { accessoryAPI } from '@/services/accessory';
import Form from '@/components/form/Form';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';

interface AccessoryAssignModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessory: any;
}

const assignToOptions = [
  { value: 'asset', label: 'Asset' },
  { value: 'user', label: 'User' },
  { value: 'location', label: 'Location' },
];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string | number) => {
    setForm({ ...form, assigned_to_type: String(value) });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await accessoryAPI.assignAccessory(accessory.id, form);
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
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Assign Accessory</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label htmlFor="assigned_to_type">Assign To</Label>
            <Select
              options={assignToOptions}
              value={form.assigned_to_type}
              onChange={handleSelectChange}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="assigned_to_id">Assigned To ID</Label>
            <input
              id="assigned_to_id"
              name="assigned_to_id"
              value={form.assigned_to_id}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              required
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="quantity">Quantity</Label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              min={1}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="assigned_date">Date</Label>
            <input
              id="assigned_date"
              name="assigned_date"
              type="date"
              value={form.assigned_date}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="notes">Notes</Label>
            <input
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300" disabled={loading}>{loading ? 'Assigning...' : 'Assign'}</button>
            <button type="button" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300" onClick={onClose}>Cancel</button>
          </div>
        </Form>
      </div>
    </div>
  );
} 