import { useState } from 'react';
import { ConsumableStockMovement } from '@/types/consumable';
import Form from '@/components/form/Form';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { Modal } from '@/components/ui/modal';

const movementTypeOptions = [
  { value: 'in', label: 'In' },
  { value: 'out', label: 'Out' },
  { value: 'adjustment', label: 'Adjustment' },
];

interface ConsumableStockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ConsumableStockMovement>) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function ConsumableStockModal({ open, onClose, onSubmit, loading = false, error }: ConsumableStockModalProps) {
  const [form, setForm] = useState<Partial<ConsumableStockMovement>>({
    movement_type: 'in',
    quantity: 1,
    reference: '',
    movement_date: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string | number) => {
    setForm({ ...form, movement_type: String(value) });
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
          <h2 className="text-lg font-bold">Stock Movement</h2>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto px-6 py-4 flex-1 max-h-[70vh]">
          <Form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-base">Stock Movement Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="movement_type">Type</Label>
                  <Select
                    options={movementTypeOptions}
                    value={form.movement_type || 'in'}
                    onChange={handleSelectChange}
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
                  <Label htmlFor="reference">Reference</Label>
                  <input
                    id="reference"
                    name="reference"
                    value={form.reference}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="movement_date">Date</Label>
                  <input
                    id="movement_date"
                    name="movement_date"
                    type="date"
                    value={form.movement_date}
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
              <button type="submit" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300" onClick={onClose}>Cancel</button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
} 