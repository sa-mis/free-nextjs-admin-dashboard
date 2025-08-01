'use client';

import { useState } from 'react';
import { Asset } from '@/services/asset';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { PencilIcon, TrashIcon, EyeIcon } from '@/icons';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { formatDate } from '@fullcalendar/core/index.js';

interface AssetTableProps {
  assets: Asset[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  onEdit: (asset: Asset) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  getStatusColor: (status: string) => string;
  getConditionColor: (condition: string) => string;
}

export function AssetTable({
  assets,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
  getStatusColor,
  getConditionColor
}: AssetTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.category_name}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.status}</TableCell>
                <TableCell>{asset.condition_status}</TableCell>
                <TableCell>{asset.purchase_price}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setSelectedAsset(asset)}>
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(asset)}>
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(asset.id)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{pagination.total}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </Button>
                {[...Array(pagination.pages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "primary" : "outline"}
                      onClick={() => onPageChange(page)}
                      className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {page}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Asset Tag:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.asset_tag}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.category_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Brand/Model:</label>
                  <p className="text-sm text-gray-900">
                    {selectedAsset.brand_name} {selectedAsset.model_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Serial Number:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.serial_number || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.location || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Division:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Asset Tag:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.asset_tag}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.category_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Brand/Model:</label>
                  <p className="text-sm text-gray-900">
                    {selectedAsset.brand_name} {selectedAsset.model_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Serial Number:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.serial_number || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.location || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Division:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.division_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned To:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.assigned_user_name || '-'}</p>
                </div>
                <div className="px-6 py-4 whitespace-nowrap">
                  <label className="text-sm font-medium text-gray-700">Purchase Price:</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedAsset.purchase_price)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Date:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedAsset.purchase_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Warranty:</label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedAsset.warranty_start_date)} - {formatDate(selectedAsset.warranty_end_date)}
                  </p>
                </div>
                <div className="px-6 py-4 whitespace-nowrap">
                  <label className="text-sm font-medium text-gray-700">Notes:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.notes || '-'}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedAsset(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Asset Tag:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.asset_tag}</p>
                </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.category_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Brand/Model:</label>
                  <p className="text-sm text-gray-900">
                    {selectedAsset.brand_name} {selectedAsset.model_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Serial Number:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.serial_number || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.location || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Division:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.division_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned To:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.assigned_user_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Price:</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedAsset.purchase_price)}</p>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Date:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedAsset.purchase_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Warranty:</label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedAsset.warranty_start_date)} - {formatDate(selectedAsset.warranty_end_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Serial Number:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.serial_number || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.location || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Division:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.division_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned To:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.assigned_user_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Price:</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedAsset.purchase_price)}</p>
                </div>
              variant="outline"
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Date:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedAsset.purchase_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Warranty:</label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedAsset.warranty_start_date)} - {formatDate(selectedAsset.warranty_end_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.notes || '-'}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedAsset(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name:</label>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setSelectedAsset(null)}>Close</Button>
                  </div>
                </div>
                {[...Array(pagination.pages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "primary" : "outline"}
                      onClick={() => onPageChange(page)}
                      className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {page}
                    </Button>
                  );
                })}
                <div>
                  <label className="text-sm font-medium text-gray-700">Brand/Model:</label>
                  <p className="text-sm text-gray-900">
                    {selectedAsset.brand_name} {selectedAsset.model_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.category_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Serial Number:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.serial_number || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.location || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Division:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.division_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned To:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.assigned_user_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Price:</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedAsset.purchase_price)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Date:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedAsset.purchase_date)}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Warranty:</label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedAsset.warranty_start_date)} - {formatDate(selectedAsset.warranty_end_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes:</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedAsset(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name:</label>
                    <p className="text-sm text-gray-900">{selectedAsset.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Asset Tag:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.asset_tag}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.category_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Brand/Model:</label>
                  <p className="text-sm text-gray-900">
                    {selectedAsset.brand_name} {selectedAsset.model_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Serial Number:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.serial_number || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.location || '-'}</p>
                  </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Division:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.division_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned To:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.assigned_user_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Price:</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedAsset.purchase_price)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purchase Date:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedAsset.purchase_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Warranty:</label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedAsset.warranty_start_date)} - {formatDate(selectedAsset.warranty_end_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes:</label>
                  <p className="text-sm text-gray-900">{selectedAsset.notes || '-'}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedAsset(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}