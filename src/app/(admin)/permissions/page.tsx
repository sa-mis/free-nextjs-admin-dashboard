'use client'

import { useEffect, useState, useCallback } from 'react';
import PermissionDashboard from '@/components/permission/PermissionDashboard';
import PermissionTable from '@/components/permission/PermissionTable';
import PermissionFormModal from '@/components/permission/PermissionFormModal';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { permissionAPI } from '@/services/permission';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

export default function PermissionsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  // New state for table data
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const { loading: authLoading, hasPermission } = usePageAuth('permission.view');

  // Fetch function
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await permissionAPI.getPermissions({ page: pagination.page, limit: pagination.limit });
      setPermissions(res.data.permissions || []);
      setPagination(prev => ({ ...prev, total: res.total || 0 }));
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;

  const handleEdit = (permission: any) => {
    setSelected(permission);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Permissions" />
      <div className="space-y-6">
        <ComponentCard title="Permissions">
          <PermissionDashboard />
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Permissions</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreate}>Add Permission</button>
          </div>
          <PermissionTable
            data={permissions}
            loading={loading}
            pagination={pagination}
            setPagination={setPagination}
            onEdit={handleEdit}
            reload={fetchPermissions}
          />
          <PermissionFormModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSuccess={() => {
              fetchPermissions();
              setFormOpen(false);
            }}
            initialData={selected}
          />
        </ComponentCard>
      </div>
    </div>
  );
} 