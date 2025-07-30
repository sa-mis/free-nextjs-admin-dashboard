import { useState, useEffect } from 'react';
import { XCircleIcon } from '@/icons';
import { serviceRequestAPI } from '@/services/serviceRequest';

interface ServiceRequestStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceRequest?: any;
}

export default function ServiceRequestStatusModal({
  open,
  onClose,
  onSuccess,
  serviceRequest
}: ServiceRequestStatusModalProps) {
  const [formData, setFormData] = useState({
    status: '',
    resolution_notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && serviceRequest) {
      setFormData({
        status: serviceRequest.status || '',
        resolution_notes: serviceRequest.resolution_notes || ''
      });
    }
  }, [open, serviceRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await serviceRequestAPI.changeStatus(serviceRequest.id, formData);
      onSuccess();
    } catch (error: any) {
      console.error('Error changing status:', error);
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'เปิดใหม่';
      case 'in_progress': return 'กำลังดำเนินการ';
      case 'pending': return 'รอดำเนินการ';
      case 'resolved': return 'แก้ไขแล้ว';
      case 'closed': return 'ปิดงาน';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  if (!open || !serviceRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">เปลี่ยนสถานะแจ้งซ่อม</h2>
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
                <span className="font-medium">สถานะปัจจุบัน:</span> {getStatusText(serviceRequest.status)}
              </div>
            </div>
          </div>

          {/* Status Change */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะใหม่ <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกสถานะ</option>
              <option value="open">เปิดใหม่</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="resolved">แก้ไขแล้ว</option>
              <option value="closed">ปิดงาน</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>

          {/* Resolution Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมายเหตุการแก้ไข
            </label>
            <textarea
              name="resolution_notes"
              value={formData.resolution_notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกหมายเหตุการแก้ไข (ถ้ามี)"
            />
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
              {loading ? 'กำลังอัปเดต...' : 'อัปเดตสถานะ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 