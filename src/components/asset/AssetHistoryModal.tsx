'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import { assetAPI } from '@/services/asset';

interface AssetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: number;
}

export function AssetHistoryModal({
  isOpen,
  onClose,
  assetId
}: AssetHistoryModalProps) {
  const [history, setHistory] = useState<{ auditLogs: any[]; transfers: any[] }>({ auditLogs: [], transfers: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && assetId) {
      loadHistory();
    }
  }, [isOpen, assetId]);

  const loadHistory = async () => {
    if (!assetId) return;
    
    setLoading(true);
    try {
      const res = await assetAPI.getHistory(assetId);
      setHistory(res.data);
    } catch (error) {
      console.error('Error loading asset history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Asset History
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading history...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Audit Logs */}
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Audit Log</h3>
              {history.auditLogs.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.auditLogs.map((log: any) => (
                    <div key={log.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {log.action_type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.performed_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        By: User {log.performed_by}
                      </div>
                      {log.old_values && Object.keys(log.old_values).length > 0 && (
                        <div className="text-xs">
                          <span className="font-medium text-red-600">Old:</span> {JSON.stringify(log.old_values)}
                        </div>
                      )}
                      {log.new_values && Object.keys(log.new_values).length > 0 && (
                        <div className="text-xs">
                          <span className="font-medium text-green-600">New:</span> {JSON.stringify(log.new_values)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No audit logs found.</p>
              )}
            </div>

            {/* Transfers */}
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Transfers</h3>
              {history.transfers.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.transfers.map((tr: any) => (
                    <div key={tr.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Transfer
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(tr.transfer_date).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <div>From: {tr.from_location || 'N/A'} → To: {tr.to_location || 'N/A'}</div>
                        <div>User: {tr.from_assigned_to || 'N/A'} → {tr.to_assigned_to || 'N/A'}</div>
                        {tr.reason && <div>Reason: {tr.reason}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No transfers found.</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
} 