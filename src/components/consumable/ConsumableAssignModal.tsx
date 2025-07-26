import { useState, useEffect } from 'react';
import { ConsumableAssignment } from '@/types/consumable';
import Form from '@/components/form/Form';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { Modal } from '@/components/ui/modal';
import { assetAPI } from '@/services/asset';
import { userService } from '@/services/organization';
// TODO: import locationService if available

const assignToOptions = [
  { value: 'asset', label: 'Asset' },
  { value: 'user', label: 'User' },
  { value: 'location', label: 'Location' },
];

interface ConsumableAssignModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ConsumableAssignment>) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function ConsumableAssignModal({ open, onClose, onSubmit, loading = false, error }: ConsumableAssignModalProps) {
  const [form, setForm] = useState<Partial<ConsumableAssignment>>({
    assigned_to_type: 'asset',
    assigned_to_id: '',
    quantity: 1,
    assigned_date: '',
    notes: '',
  });

  // Assigned to options
  const [assignedToOptions, setAssignedToOptions] = useState<{ value: string | number; label: string }[]>([]);

  // Reset form state when modal is opened
  useEffect(() => {
    if (open) setForm({ assigned_to_type: 'asset', assigned_to_id: '', quantity: 1, assigned_date: '', notes: '' });
    // eslint-disable-next-line
  }, [open]);

  // Fetch options when assigned_to_type or open changes
  useEffect(() => {
    if (!open) return;
    setForm(prev => ({ ...prev, assigned_to_id: '' }));
    (async () => {
      if (form.assigned_to_type === 'asset') {
        const assets = await assetAPI.getAll({ limit: 100 });
        setAssignedToOptions((assets?.data || []).map((a: any) => ({ value: a.id, label: a.name + (a.asset_tag ? ` (${a.asset_tag})` : '') })));
      } else if (form.assigned_to_type === 'user') {
        const users = await userService.getAll();
        setAssignedToOptions((users || []).map((u: any) => ({ value: u.id, label: u.username || u.email })));
      } else if (form.assigned_to_type === 'location') {
        // TODO: Replace with real location service if available
        setAssignedToOptions([]);
      }
    })();
    // eslint-disable-next-line
  }, [form.assigned_to_type, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string | number) => {
    setForm({ ...form, assigned_to_type: String(value), assigned_to_id: '' });
  };

  const handleAssignedToChange = (value: string | number) => {
    setForm({ ...form, assigned_to_id: value });
  };

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="p-0 w-full max-w-md sm:max-w-lg flex flex-col">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-lg font-bold">Assign Consumable</h2>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto px-6 py-4 flex-1 max-h-[70vh]">
          <Form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-base">Assignment Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assigned_to_type">Assign To</Label>
                  <Select
                    options={assignToOptions}
                    value={form.assigned_to_type || 'asset'}
                    onChange={handleSelectChange}
                  />
                </div>
                <div>
                  <Label htmlFor="assigned_to_id">Assigned To</Label>
                  <Select
                    options={assignedToOptions}
                    value={form.assigned_to_id ?? ''}
                    onChange={handleAssignedToChange}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    min={1}
                    className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="assigned_date">Date</Label>
                  <input
                    id="assigned_date"
                    name="assigned_date"
                    type="date"
                    value={form.assigned_date}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <input
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs"
                  />
                </div>
              </div>
            </div>
            {/* Sticky Actions */}
            <div className="flex gap-2 mt-6 justify-end sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-2 z-10">
              <button type="submit" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300" disabled={loading}>{loading ? 'Assigning...' : 'Assign'}</button>
              <button type="button" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300" onClick={onClose}>Cancel</button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
} 