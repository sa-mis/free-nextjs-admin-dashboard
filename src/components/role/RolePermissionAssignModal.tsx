import { useState, useEffect, useMemo } from 'react';
import { roleAPI } from '@/services/role';
import { permissionAPI } from '@/services/permission';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Checkbox from '@/components/form/input/Checkbox';

interface RolePermissionAssignModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role?: any;
}

interface PermissionGroup {
  page: string;
  permissions: any[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function RolePermissionAssignModal({ open, onClose, onSuccess, role }: RolePermissionAssignModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50
  });
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  // Group permissions by page
  const permissionGroups = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    
    permissions.forEach(permission => {
      const parts = permission.name.split('.');
      const page = parts[0] || 'Other';
      if (!groups[page]) {
        groups[page] = [];
      }
      groups[page].push(permission);
    });

    return Object.entries(groups).map(([page, permissions]) => ({
      page,
      permissions: permissions.sort((a, b) => a.name.localeCompare(b.name))
    })).sort((a, b) => a.page.localeCompare(b.page));
  }, [permissions]);

  // Check if all permissions are selected
  const allSelected = useMemo(() => {
    return permissions.length > 0 && selectedPermissions.length === permissions.length;
  }, [permissions, selectedPermissions]);

  // Check if all permissions in a group are selected
  const isGroupSelected = (group: PermissionGroup) => {
    return group.permissions.length > 0 && 
           group.permissions.every(p => selectedPermissions.includes(p.id));
  };

  // Check if some permissions in a group are selected
  const isGroupPartiallySelected = (group: PermissionGroup) => {
    const selectedInGroup = group.permissions.filter(p => selectedPermissions.includes(p.id));
    return selectedInGroup.length > 0 && selectedInGroup.length < group.permissions.length;
  };

  useEffect(() => {
    if (open && role) {
      // Reset pagination and permissions when modal opens
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      setPermissions([]);
      fetchPermissions(1);
      fetchRolePermissions();
      setErrors({});
    }
  }, [open, role]);

  // Debug pagination state
  useEffect(() => {
    console.log('Pagination state changed:', pagination);
  }, [pagination]);

  const fetchPermissions = async (page: number = 1) => {
    try {
      setLoadingPermissions(true);
      const res = await permissionAPI.getPermissions({ 
        page, 
        limit: pagination.itemsPerPage 
      });
      
      console.log('Permission API Response:', res);
      const permissions = res.data?.permissions || [];
      const totalItems = res.total || 0;
      const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
      console.log('Parsed data:', { permissions: permissions.length, totalItems, totalPages, currentPage: page });
      
      if (page === 1) {
        setPermissions(permissions);
      } else {
        setPermissions(prev => [...prev, ...permissions]);
      }
      
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems
      }));
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const fetchRolePermissions = async () => {
    if (!role) return;
    try {
      const res = await roleAPI.getRolePermissions(role.id);
      const rolePermissionIds = res.data.permissions?.map((p: any) => p.id) || [];
      setSelectedPermissions(rolePermissionIds);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const loadMorePermissions = () => {
    if (pagination.currentPage < pagination.totalPages && !loadingPermissions) {
      fetchPermissions(pagination.currentPage + 1);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map(p => p.id));
    }
  };

  const handleSelectGroup = (group: PermissionGroup) => {
    const groupPermissionIds = group.permissions.map(p => p.id);
    const allGroupSelected = group.permissions.every(p => selectedPermissions.includes(p.id));
    
    if (allGroupSelected) {
      // Deselect all permissions in this group
      setSelectedPermissions(prev => prev.filter(id => !groupPermissionIds.includes(id)));
    } else {
      // Select all permissions in this group
      setSelectedPermissions(prev => {
        const newSelected = [...prev];
        groupPermissionIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  const handleSubmit = async () => {
    if (!role) return;

    console.log('handleSubmit - role:', role);
    console.log('handleSubmit - role.id:', role.id);
    console.log('handleSubmit - selectedPermissions:', selectedPermissions);

    // Safety check for role.id
    if (!role.id || typeof role.id !== 'number') {
      console.error('Invalid role.id:', role.id);
      setErrors({ general: 'Invalid role ID' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await roleAPI.assignPermissions(role.id, selectedPermissions);
      onSuccess();
    } catch (error: any) {
      console.error('handleSubmit error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'An error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open || !role) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Assign Permissions to Role</h2>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Role:</strong> {role.name}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {selectedPermissions.length} permissions selected
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          {/* Select All Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="select-all-permissions"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  label="Select All Permissions"
                />
                <span className="text-sm text-gray-600">
                  {selectedPermissions.length} permissions selected
                </span>
              </div>
            </div>
          </div>

          {/* Permission Groups */}
          {loadingPermissions && permissions.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading permissions...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {permissionGroups.map((group) => (
              <div key={group.page} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Group Header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`select-group-${group.page}`}
                        checked={isGroupSelected(group)}
                        onChange={() => handleSelectGroup(group)}
                        label={group.page}
                      />
                      {isGroupPartiallySelected(group) && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Partial
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {group.permissions.filter(p => selectedPermissions.includes(p.id)).length} / {group.permissions.length}
                    </span>
                  </div>
                </div>

                {/* Group Permissions */}
                <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                  {group.permissions.map(permission => (
                    <div key={permission.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        label=""
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {permission.name.split('.').slice(1).join('.')}
                        </div>
                        {permission.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {permission.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
          )}

                     {/* Load More Button */}
           {pagination.currentPage < pagination.totalPages && permissions.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={loadMorePermissions}
                disabled={loadingPermissions}
                className="px-6"
              >
                {loadingPermissions ? 'Loading...' : `Load More (${pagination.currentPage}/${pagination.totalPages})`}
              </Button>
            </div>
          )}

                     {/* Pagination Info */}
           <div className="mt-4 text-center text-sm text-gray-600">
             Showing {permissions.length} of {pagination.totalItems} permissions
             {pagination.totalPages > 1 && (
               <span className="ml-2">
                 (Page {pagination.currentPage} of {pagination.totalPages})
               </span>
             )}
             {/* Debug info */}
             <div className="text-xs text-gray-400 mt-1">
               Debug: totalItems={pagination.totalItems}, totalPages={pagination.totalPages}, currentPage={pagination.currentPage}
             </div>
           </div>

          {/* Error Messages */}
          {errors.permission_ids && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.permission_ids}</p>
            </div>
          )}

          {errors.general && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedPermissions.length} permissions selected
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Assigning...' : 'Assign Permissions'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 