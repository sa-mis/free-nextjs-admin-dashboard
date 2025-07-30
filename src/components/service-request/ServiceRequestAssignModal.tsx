import { useState, useEffect } from 'react';
import { XCircleIcon } from '@/icons';
import { serviceRequestAPI } from '@/services/serviceRequest';

interface ServiceRequestAssignModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceRequest?: any;
}

export default function ServiceRequestAssignModal({
  open,
  onClose,
  onSuccess,
  serviceRequest
}: ServiceRequestAssignModalProps) {
  const [formData, setFormData] = useState({
    assigned_to: '',
    assigned_division_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);

  useEffect(() => {
    if (open && serviceRequest) {
      setFormData({
        assigned_to: serviceRequest.assigned_to || '',
        assigned_division_id: serviceRequest.assigned_division_id || ''
      });
      loadUsers();
      loadDivisions();
    }
  }, [open, serviceRequest]);

  const loadUsers = async () => {
    try {
      // This would typically load from user API
      setUsers([
        { id: 1, username: 'john.doe', email: 'john@example.com' },
        { id: 2, username: 'jane.smith', email: 'jane@example.com' },
        { id: 3, username: 'bob.wilson', email: 'bob@example.com' }
      ]);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadDivisions = async () => {
    try {
      // This would typically load from division API
      setDivisions([
        { id: 1, name: 'ฝ่าย IT' },
        { id: 2, name: 'ฝ่ายบำรุงรักษา' },
        { id: 3, name: 'ฝ่ายซ่อมบำรุง' }
      ]);
    } catch (error) {
      console.error('Error loading divisions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await serviceRequestAPI.assignServiceRequest(serviceRequest.id, formData);
      onSuccess();
    } catch (error: any) {
      console.error('Error assigning service request:', error);
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการมอบหมายงาน');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!open || !serviceRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">มอบหมายงานแจ้งซ่อม</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Request Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">รายละเอียดแจ้งซ่อม</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">เลขที่:</span> {serviceRequest.ticket_number}
              </div>
              <div>
                <span className="font-medium">หัวข้อ:</span> {serviceRequest.title}
              </div>
              <div>
                <span className="font-medium">ผู้แจ้ง:</span> {serviceRequest.requester?.username}
              </div>
            </div>
          </div>

          {/* Assign to User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              มอบหมายให้ผู้ใช้
            </label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกผู้ใช้</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Assign to Division */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              มอบหมายให้แผนก/ฝ่าย
            </label>
            <select
              name="assigned_division_id"
              value={formData.assigned_division_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกแผนก/ฝ่าย</option>
              {divisions.map(division => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'กำลังมอบหมาย...' : 'มอบหมายงาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 