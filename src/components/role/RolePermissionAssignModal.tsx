import { useState, useEffect } from 'react';
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

export default function RolePermissionAssignModal({ open, onClose, onSuccess, role }: RolePermissionAssignModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (open && role) {
      fetchPermissions();
      fetchRolePermissions();
      setErrors({});
    }
  }, [open, role]);

  const fetchPermissions = async () => {
    try {
      const res = await permissionAPI.getPermissions({ limit: 100 });
      setPermissions(res.data.permissions || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
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

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    setErrors({});

    try {
      await roleAPI.assignPermissions(role.id, selectedPermissions);
      onSuccess();
    } catch (error: any) {
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
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Permissions to Role</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Role:</strong> {role.name}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Permissions</Label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
                {permissions.map(permission => (
                  <div key={permission.id} className="flex items-center">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      label={permission.name}
                    />
                    {permission.description && (
                      <span className="text-xs text-gray-500 ml-2">- {permission.description}</span>
                    )}
                  </div>
                ))}
              </div>
              {errors.permission_ids && (
                <p className="text-red-500 text-sm mt-1">{errors.permission_ids}</p>
              )}
            </div>

            {errors.general && (
              <div className="text-red-500 text-sm">{errors.general}</div>
            )}

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Permissions'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 