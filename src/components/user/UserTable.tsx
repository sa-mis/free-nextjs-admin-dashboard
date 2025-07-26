import { useEffect, useState } from 'react';
import { userAPI } from '@/services/user';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { PencilIcon, TrashIcon, EyeIcon, ShieldIcon } from '@/icons';

interface User {
  id: number;
  username: string;
  email: string;
  role_name?: string;
  is_active: boolean;
  last_login?: string;
  created_at?: string;
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : '-';
}

export default function UserTable({
  data,
  loading,
  pagination,
  setPagination,
  onEdit,
  onAssignRole,
  reload
}: {
  data: User[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  setPagination: React.Dispatch<React.SetStateAction<any>>;
  onEdit: (user: User) => void;
  onAssignRole: (user: User) => void;
  reload: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this user?')) {
      await userAPI.deleteUser(id);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data</td></tr>
              ) : data.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{row.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {row.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{row.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 dark:text-white">{row.role_name || 'No Role'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Badge variant="solid" color={row.is_active ? "success" : "error"}>
                      {row.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(row.last_login)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 justify-center">
                      <Button variant="outline" size="sm" onClick={() => setSelectedUser(row)} className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onEdit(row)} className="text-green-600 hover:text-green-900">
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onAssignRole(row)} className="text-purple-600 hover:text-purple-900">
                        <ShieldIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-4 h-4" />
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
      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Username:</label>
                  <p className="text-sm text-gray-900">{selectedUser.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email:</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role:</label>
                  <p className="text-sm text-gray-900">{selectedUser.role_name || 'No Role'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <p className="text-sm text-gray-900">{selectedUser.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Login:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedUser.last_login)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedUser.created_at)}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedUser(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 