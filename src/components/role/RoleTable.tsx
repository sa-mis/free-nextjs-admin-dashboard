import { useEffect, useState } from 'react';
import { roleAPI } from '@/services/role';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { PencilIcon, TrashIcon, EyeIcon, ShieldIcon } from '@/icons';

interface Role {
  id: number;
  name: string;
  description?: string;
  user_count?: number;
  permission_count?: number;
  created_at?: string;
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : '-';
}

export default function RoleTable({
  data,
  loading,
  pagination,
  setPagination,
  onEdit,
  onAssignPermissions,
  reload
}: {
  data: Role[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  setPagination: React.Dispatch<React.SetStateAction<any>>;
  onEdit: (role: Role) => void;
  onAssignPermissions: (role: Role) => void;
  reload: () => void;
}) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this role?')) {
      await roleAPI.deleteRole(id);
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
        <div className="min-w-[800px]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data</td></tr>
              ) : data.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{row.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {row.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{row.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Badge variant="solid" color="primary">{row.user_count || 0}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Badge variant="solid" color="light">{row.permission_count || 0}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(row.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 justify-center">
                      <Button variant="outline" size="md" onClick={() => setSelectedRole(row)} className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="md" onClick={() => onEdit(row)} className="text-green-600 hover:text-green-900">
                        <PencilIcon className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="md" onClick={() => onAssignPermissions(row)} className="text-purple-600 hover:text-purple-900">
                        <ShieldIcon className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="md" onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-5 h-5" />
                      </Button>
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
            <Button variant="outline" onClick={() => setPagination((p: typeof pagination) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1}>Previous</Button>
            <Button variant="outline" onClick={() => setPagination((p: typeof pagination) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page * pagination.limit >= pagination.total}>Next</Button>
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
                <Button variant="outline" onClick={() => setPagination((p: typeof pagination) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Previous</Button>
                {[...Array(Math.ceil(pagination.total / pagination.limit))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "primary" : "outline"}
                      onClick={() => setPagination((p: typeof pagination) => ({ ...p, page }))}
                      className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button variant="outline" onClick={() => setPagination((p: typeof pagination) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page * pagination.limit >= pagination.total} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Next</Button>
              </nav>
            </div>
          </div>
        </div>
      )}
      {/* Role Details Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Role Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name:</label>
                  <p className="text-sm text-gray-900">{selectedRole.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description:</label>
                  <p className="text-sm text-gray-900">{selectedRole.description || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Users:</label>
                  <p className="text-sm text-gray-900">{selectedRole.user_count || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Permissions:</label>
                  <p className="text-sm text-gray-900">{selectedRole.permission_count || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedRole.created_at)}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedRole(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 