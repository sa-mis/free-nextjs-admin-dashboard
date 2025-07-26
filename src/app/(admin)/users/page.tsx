'use client'

import { useEffect, useState, useCallback } from 'react';
import UserDashboard from '@/components/user/UserDashboard';
import UserTable from '@/components/user/UserTable';
import UserFormModal from '@/components/user/UserFormModal';
import UserRoleAssignModal from '@/components/user/UserRoleAssignModal';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { userAPI } from '@/services/user';

export default function UsersPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  // New state for table data
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Fetch function
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userAPI.getUsers({ page: pagination.page, limit: pagination.limit });
      setUsers(res.data.users || []);
      setPagination(prev => ({ ...prev, total: res.total || 0 }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: any) => {
    setSelected(user);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const handleAssignRole = (user: any) => {
    setSelected(user);
    setAssignOpen(true);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="Users">
          <UserDashboard />
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Users</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreate}>Add User</button>
          </div>
          <UserTable
            data={users}
            loading={loading}
            pagination={pagination}
            setPagination={setPagination}
            onEdit={handleEdit}
            onAssignRole={handleAssignRole}
            reload={fetchUsers}
          />
          <UserFormModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSuccess={() => {
              fetchUsers();
              setFormOpen(false);
            }}
            initialData={selected}
          />
          <UserRoleAssignModal
            open={assignOpen}
            onClose={() => setAssignOpen(false)}
            onSuccess={() => {
              fetchUsers();
              setAssignOpen(false);
            }}
            user={selected}
          />
        </ComponentCard>
      </div>
    </div>
  );
} 