import { useState } from 'react';
import { Consumable } from '@/types/consumable';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import Select from '@/components/form/Select';
import Label from '@/components/form/Label';

interface ConsumableTableProps {
  data: Consumable[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  setPagination: React.Dispatch<React.SetStateAction<any>>;
  onEdit: (consumable: Consumable) => void;
  onAssign: (consumable: Consumable) => void;
  onStock: (consumable: Consumable) => void;
  onDelete: (consumable: Consumable) => void;
}

export default function ConsumableTable({ data, loading, pagination, setPagination, onEdit, onAssign, onStock, onDelete }: ConsumableTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tag</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Min/Max</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-6 text-gray-400">No data</td></tr>
              ) : data.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{row.consumable_tag}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{row.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{row.name}</div>
                    <div className="text-xs text-gray-400">{row.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{row.unit || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Badge color={row.status === 'active' ? 'success' : row.status === 'out_of_stock' ? 'error' : 'warning'} size="sm">{row.status.replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{row.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-xs">{row.min_stock ?? '-'} / {row.max_stock ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 justify-center">
                      <Button variant="outline" size="sm" onClick={() => onEdit(row)} className="text-green-600 hover:text-green-900">Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => onDelete(row)} className="text-red-600 hover:text-red-900">Delete</Button>
                      <Button variant="outline" size="sm" onClick={() => onAssign(row)} className="text-yellow-600 hover:text-yellow-900">Assign</Button>
                      <Button variant="outline" size="sm" onClick={() => onStock(row)} className="text-indigo-600 hover:text-indigo-900">Stock</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" onClick={() => setPagination((p: any) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1}>Previous</Button>
            <Button variant="outline" onClick={() => setPagination((p: any) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page * pagination.limit >= pagination.total}>Next</Button>
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
                <Button variant="outline" onClick={() => setPagination((p: any) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Previous</Button>
                {[...Array(Math.ceil(pagination.total / pagination.limit))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "primary" : "outline"}
                      onClick={() => setPagination((p: any) => ({ ...p, page }))}
                      className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button variant="outline" onClick={() => setPagination((p: any) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page * pagination.limit >= pagination.total} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Next</Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 