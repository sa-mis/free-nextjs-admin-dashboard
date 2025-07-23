import { useEffect, useState } from 'react';
import { accessoryAPI } from '@/services/accessory';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { PencilIcon, TrashIcon, EyeIcon } from '@/icons';

interface Accessory {
  id: number;
  accessory_tag: string;
  name: string;
  description?: string;
  category_name?: string;
  brand_name?: string;
  model_name?: string;
  vendor_name?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  status: string;
  stock_quantity: number;
  min_stock?: number;
  max_stock?: number;
  location?: string;
  notes?: string;
}

function formatCurrency(amount?: number) {
  if (!amount) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : '-';
}

export default function AccessoryTable({
  data,
  loading,
  pagination,
  setPagination,
  onEdit,
  onAssign,
  onStockMovement,
  reload
}: {
  data: Accessory[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  setPagination: React.Dispatch<React.SetStateAction<any>>;
  onEdit: (accessory: Accessory) => void;
  onAssign: (accessory: Accessory) => void;
  onStockMovement: (accessory: Accessory) => void;
  reload: () => void;
}) {
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this accessory?')) {
      await accessoryAPI.deleteAccessory(id);
      reload();
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tag</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th> */}
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Brand/Model</th> */}
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vendor</th> */}
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Serial #</th> */}
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Date</th> */}
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Price</th> */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Min/Max</th>
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th> */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr><td colSpan={13} className="text-center py-6 text-gray-400">No data</td></tr>
            ) : data.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{row.accessory_tag}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{row.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{row.name}</div>
                  <div className="text-xs text-gray-400">{row.description || '-'}</div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{row.category_name || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{row.brand_name || '-'}</div>
                  <div className="text-xs text-gray-400">{row.model_name || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{row.vendor_name || '-'}</div>
                </td> */}
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{row.serial_number || '-'}</div>
                </td> */}
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{formatDate(row.purchase_date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(row.purchase_price)}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{row.status}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {row.stock_quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs">{row.min_stock ?? '-'} / {row.max_stock ?? '-'}</div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{row.location || '-'}</div>
                  <div className="text-xs text-gray-400">{row.notes || '-'}</div>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedAccessory(row)} className="text-blue-600 hover:text-blue-900"><EyeIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(row)} className="text-green-600 hover:text-green-900"><PencilIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onAssign(row)} className="text-yellow-600 hover:text-yellow-900">Assign</Button>
                    <Button variant="ghost" size="sm" onClick={() => onStockMovement(row)} className="text-indigo-600 hover:text-indigo-900">Stock</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1}>Previous</Button>
            <Button variant="outline" onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page * pagination.limit >= pagination.total}>Next</Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                {' '}to{' '}
                <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
                {' '}of{' '}
                <span className="font-medium">{pagination.total}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button variant="outline" onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Previous</Button>
                {[...Array(Math.ceil(pagination.total / pagination.limit))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "primary" : "outline"}
                      onClick={() => setPagination(p => ({ ...p, page }))}
                      className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button variant="outline" onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page * pagination.limit >= pagination.total} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Next</Button>
              </nav>
            </div>
          </div>
        </div>
      )}
      {/* Accessory Details Modal */}
      {selectedAccessory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accessory Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tag:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.accessory_tag}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.category_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Brand/Model:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.brand_name} {selectedAccessory.model_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Vendor:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.vendor_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Serial Number:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.serial_number || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Price:</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedAccessory.purchase_price)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Date:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedAccessory.purchase_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.stock_quantity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Min/Max:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.min_stock ?? '-'} / {selectedAccessory.max_stock ?? '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.location || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes:</label>
                  <p className="text-sm text-gray-900">{selectedAccessory.notes || '-'}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedAccessory(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 