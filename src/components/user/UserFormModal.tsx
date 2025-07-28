import { useState, useEffect } from 'react';
import { userAPI } from '@/services/user';
import { roleAPI } from '@/services/role';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Checkbox from '@/components/form/input/Checkbox';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function UserFormModal({ open, onClose, onSuccess, initialData }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role_id: '',
    is_active: true
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (open) {
      fetchRoles();
      if (initialData) {
        setFormData({
          username: initialData.username || '',
          email: initialData.email || '',
          password: '',
          role_id: initialData.role_id || '',
          is_active: initialData.is_active !== undefined ? initialData.is_active : true
        });
      } else {
        setFormData({
          username: '',
          email: '',
          password: '',
          role_id: '',
          is_active: true
        });
      }
      setErrors({});
    }
  }, [open, initialData]);

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
    setLoading(true);
    setErrors({});

    try {
      const submitData = { ...formData };
      if (initialData && !submitData.password) {
        delete submitData.password;
      }

      if (initialData) {
        await userAPI.updateUser(initialData.id, submitData);
      } else {
        await userAPI.createUser(submitData);
      }

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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {initialData ? 'Edit User' : 'Add New User'}
        </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <InputField
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                error={errors.username}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <InputField
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">
                {initialData ? 'Password (leave blank to keep current)' : 'Password'}
              </Label>
              <InputField
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                required={!initialData}
              />
            </div>

            <div>
              <Label htmlFor="role_id">Role</Label>
              <select
                id="role_id"
                value={formData.role_id}
                onChange={(e) => handleChange('role_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id} className="dark:bg-gray-700 dark:text-white">
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role_id}</p>
              )}
            </div>

            <div>
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                label="Active"
              />
            </div>

            {errors.general && (
              <div className="text-red-500 dark:text-red-400 mb-4">{errors.general}</div>
            )}

            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button disabled={loading}>
                {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
  );
} 