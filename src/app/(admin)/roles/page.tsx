'use client'

import { useEffect, useState, useCallback } from 'react';
import RoleDashboard from '@/components/role/RoleDashboard';
import RoleTable from '@/components/role/RoleTable';
import RoleFormModal from '@/components/role/RoleFormModal';
import RolePermissionAssignModal from '@/components/role/RolePermissionAssignModal';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { roleAPI } from '@/services/role';

export default function RolesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  // New state for table data
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Fetch function
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleAPI.getRoles({ page: pagination.page, limit: pagination.limit });
      setRoles(res.data.roles || []);
      setPagination(prev => ({ ...prev, total: res.total || 0 }));
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleEdit = (role: any) => {
    setSelected(role);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const handleAssignPermissions = (role: any) => {
    setSelected(role);
    setAssignOpen(true);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
      <div className="space-y-6">
        <ComponentCard title="Roles">
          <RoleDashboard />
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Roles</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreate}>Add Role</button>
          </div>
          <RoleTable
            data={roles}
            loading={loading}
            pagination={pagination}
            setPagination={setPagination}
            onEdit={handleEdit}
            onAssignPermissions={handleAssignPermissions}
            reload={fetchRoles}
          />
          <RoleFormModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSuccess={() => {
              fetchRoles();
              setFormOpen(false);
            }}
            initialData={selected}
          />
          <RolePermissionAssignModal
            open={assignOpen}
            onClose={() => setAssignOpen(false)}
            onSuccess={() => {
              fetchRoles();
              setAssignOpen(false);
            }}
            role={selected}
          />
        </ComponentCard>
      </div>
    </div>
  );
} 