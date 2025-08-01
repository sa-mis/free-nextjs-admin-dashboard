'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { assetAPI } from '@/services/asset';
import { userService } from '@/services/organization';
import { toast } from 'react-hot-toast';

interface AssetAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: number;
  onSuccess?: () => void;
}

export function AssetAssignModal({
  isOpen,
  onClose,
  assetId,
  onSuccess
}: AssetAssignModalProps) {
  const [assignUserId, setAssignUserId] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      userService.getActive().then(result => {
        setUsers(Array.isArray(result) ? result : []);
      });
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!assetId || !assignUserId) return;
    
    setLoading(true);
    try {
      await assetAPI.assign(assetId, { assigned_to: assignUserId });
      toast.success('Asset assigned successfully');
      setAssignUserId(undefined);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to assign asset');
      console.error('Error assigning asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Assign Asset
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="assign_user">Assign to User</Label>
            <Select
              id="assign_user"
              value={assignUserId || ''}
              onChange={value => setAssignUserId(Number(value))}
              placeholder="Select User"
            >
              {Array.isArray(users) && users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={loading || !assignUserId}
            >
              {loading ? 'Assigning...' : 'Assign Asset'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
} 