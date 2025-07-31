import { useState, useEffect } from 'react';
import { userAPI } from '@/services/user';
import { roleAPI } from '@/services/role';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Select from '../form/Select';

interface UserRoleAssignModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any;
}

export default function UserRoleAssignModal({ open, onClose, onSuccess, user }: UserRoleAssignModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (open) {
      fetchRoles();
      if (user) {
        setSelectedRoleId(user.role_id || '');
      }
      setErrors({});
    }
  }, [open, user]);

  const fetchRoles = async () => {
    try {
      const res = await roleAPI.getRoles({ limit: 100 });
      setRoles(res.data.roles || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRoleId) return;

    setLoading(true);
    setErrors({});

    try {
      await userAPI.assignRole(user.id, parseInt(selectedRoleId));
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

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Role to User</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>User:</strong> {user.username} ({user.email})
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="role_id">Role</Label>
              <Select
                id="role_id"
                value={selectedRoleId}
                onChange={(value) => setSelectedRoleId(value as string)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
              {errors.role_id && (
                <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
              )}
            </div>

            {errors.general && (
              <div className="text-red-500 text-sm">{errors.general}</div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={loading || !selectedRoleId}>
                {loading ? 'Assigning...' : 'Assign Role'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 