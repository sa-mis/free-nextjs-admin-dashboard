'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import InputField from '@/components/form/input/InputField';
import { assetAPI } from '@/services/asset';
import { userService } from '@/services/organization';
import { toast } from 'react-hot-toast';

interface AssetTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: number;
  divisions: any[];
  onSuccess?: () => void;
}

export function AssetTransferModal({
  isOpen,
  onClose,
  assetId,
  divisions,
  onSuccess
}: AssetTransferModalProps) {
  const [transferData, setTransferData] = useState({
    to_division_id: '',
    to_location: '',
    to_assigned_to: '',
    reason: ''
  });
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

  const handleTransfer = async () => {
    if (!assetId) return;
    
    setLoading(true);
    try {
      await assetAPI.transfer(assetId, {
        to_division_id: Number(transferData.to_division_id),
        to_location: transferData.to_location,
        to_assigned_to: Number(transferData.to_assigned_to),
        reason: transferData.reason
      });
      toast.success('Asset transferred successfully');
      setTransferData({ to_division_id: '', to_location: '', to_assigned_to: '', reason: '' });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to transfer asset');
      console.error('Error transferring asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Transfer Asset
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="transfer_division">To Division</Label>
            <Select
              id="transfer_division"
              value={transferData.to_division_id}
              onChange={value => setTransferData(prev => ({ ...prev, to_division_id: value }))}
              placeholder="Select Division"
            >
              <option value="">Select Division</option>
              {divisions.map(division => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="transfer_location">To Location</Label>
            <InputField
              id="transfer_location"
              value={transferData.to_location}
              onChange={(e) => setTransferData(prev => ({ ...prev, to_location: e.target.value }))}
              placeholder="Enter new location"
            />
          </div>

          <div>
            <Label htmlFor="transfer_user">To User</Label>
            <Select
              id="transfer_user"
              value={transferData.to_assigned_to}
              onChange={value => setTransferData(prev => ({ ...prev, to_assigned_to: value }))}
              placeholder="Select User"
            >
              <option value="">Select User</option>
              {Array.isArray(users) && users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="transfer_reason">Reason</Label>
            <InputField
              id="transfer_reason"
              value={transferData.reason}
              onChange={(e) => setTransferData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for transfer"
            />
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
              onClick={handleTransfer}
              disabled={loading || !transferData.to_division_id || !transferData.to_location}
            >
              {loading ? 'Transferring...' : 'Transfer Asset'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
} 