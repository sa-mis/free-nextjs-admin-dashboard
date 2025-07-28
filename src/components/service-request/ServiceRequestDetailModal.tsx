import { useState, useEffect } from 'react';
import { XIcon, ClockIcon, UserIcon, MapPinIcon, TagIcon } from '@/icons';
import { serviceRequestAPI } from '@/services/serviceRequest';

interface ServiceRequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  serviceRequest?: any;
}

export default function ServiceRequestDetailModal({
  open,
  onClose,
  serviceRequest
}: ServiceRequestDetailModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (open && serviceRequest) {
      loadDetails();
      loadActivities();
    }
  }, [open, serviceRequest]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await serviceRequestAPI.getServiceRequest(serviceRequest.id);
      setDetails(res.data.serviceRequest);
    } catch (error) {
      console.error('Error loading service request details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const res = await serviceRequestAPI.getActivities(serviceRequest.id);
      setActivities(res.data.activities || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await serviceRequestAPI.addComment(serviceRequest.id, { comment });
      setComment('');
      loadActivities();
    } catch (error: any) {
      console.error('Error adding comment:', error);
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มความคิดเห็น');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'เร่งด่วน';
      case 'high': return 'สูง';
      case 'medium': return 'ปานกลาง';
      case 'low': return 'ต่ำ';
      default: return priority;
    }
  };

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'comment': return 'ความคิดเห็น';
      case 'status_change': return 'เปลี่ยนสถานะ';
      case 'assignment': return 'มอบหมายงาน';
      case 'resolution': return 'การแก้ไข';
      default: return type;
    }
  };

  if (!open || !serviceRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">รายละเอียดแจ้งซ่อม</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center">กำลังโหลดข้อมูล...</div>
        ) : details ? (
          <div className="p-6 space-y-6">
            {/* Header Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{details.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{details.ticket_number}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(details.status)}`}>
                    {getStatusText(details.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(details.priority)}`}>
                    {getPriorityText(details.priority)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">ผู้แจ้ง:</span>
                  <span>{details.requester?.username || 'ไม่ระบุ'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">ผู้รับผิดชอบ:</span>
                  <span>{details.assignedTo?.username || 'ยังไม่มอบหมาย'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">สถานที่:</span>
                  <span>{details.location || 'ไม่ระบุ'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">หมวดหมู่:</span>
                  <span>{details.category?.name || 'ไม่ระบุ'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">รายละเอียด</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{details.description}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">ข้อมูลเพิ่มเติม</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">ทรัพย์สิน:</span>
                    <span className="ml-2">{details.asset?.name || 'ไม่ระบุ'}</span>
                  </div>
                  <div>
                    <span className="font-medium">แผนก/ฝ่าย:</span>
                    <span className="ml-2">{details.assignedDivision?.name || 'ไม่ระบุ'}</span>
                  </div>
                  <div>
                    <span className="font-medium">วันที่สร้าง:</span>
                    <span className="ml-2">
                      {new Date(details.created_at).toLocaleDateString('th-TH')} {new Date(details.created_at).toLocaleTimeString('th-TH')}
                    </span>
                  </div>
                  {details.due_date && (
                    <div>
                      <span className="font-medium">กำหนดเสร็จ:</span>
                      <span className="ml-2">{new Date(details.due_date).toLocaleDateString('th-TH')}</span>
                    </div>
                  )}
                  {details.resolved_at && (
                    <div>
                      <span className="font-medium">วันที่แก้ไข:</span>
                      <span className="ml-2">{new Date(details.resolved_at).toLocaleDateString('th-TH')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">หมายเหตุการแก้ไข</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {details.resolution_notes || 'ไม่มีหมายเหตุการแก้ไข'}
                  </p>
                </div>
              </div>
            </div>

            {/* Activities Timeline */}
            <div>
              <h4 className="font-medium text-gray-800 mb-4">ประวัติการดำเนินการ</h4>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {getActivityTypeText(activity.activity_type)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString('th-TH')} {new Date(activity.created_at).toLocaleTimeString('th-TH')}
                        </span>
                      </div>
                      {activity.createdBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          โดย: {activity.createdBy.username}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    ไม่มีประวัติการดำเนินการ
                  </div>
                )}
              </div>
            </div>

            {/* Add Comment */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">เพิ่มความคิดเห็น</h4>
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="กรอกความคิดเห็น..."
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    เพิ่มความคิดเห็น
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">ไม่พบข้อมูลรายละเอียด</div>
        )}
      </div>
    </div>
  );
} 