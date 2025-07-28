import { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  UserPlusIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@/icons';
import Pagination from '@/components/tables/Pagination';

interface ServiceRequestTableProps {
  data: any[];
  loading: boolean;
  pagination: any;
  setPagination: (pagination: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onView: (item: any) => void;
  onAssign: (item: any) => void;
  onStatusChange: (item: any) => void;
  onGenerateWorkOrder: (item: any) => void;
  reload: () => void;
}

export default function ServiceRequestTable({
  data,
  loading,
  pagination,
  setPagination,
  onEdit,
  onDelete,
  onView,
  onAssign,
  onStatusChange,
  onGenerateWorkOrder,
  reload
}: ServiceRequestTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

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

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาแจ้งซ่อม..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">สถานะทั้งหมด</option>
            <option value="open">เปิดใหม่</option>
            <option value="in_progress">กำลังดำเนินการ</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="resolved">แก้ไขแล้ว</option>
            <option value="closed">ปิดงาน</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ความสำคัญทั้งหมด</option>
            <option value="urgent">เร่งด่วน</option>
            <option value="high">สูง</option>
            <option value="medium">ปานกลาง</option>
            <option value="low">ต่ำ</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เลขที่แจ้งซ่อม
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หัวข้อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้แจ้ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ความสำคัญ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้รับผิดชอบ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่สร้าง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    ไม่พบข้อมูลแจ้งซ่อม
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.ticket_number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.requester?.username || 'ไม่ระบุ'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {getPriorityText(item.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.assignedTo?.username || 'ยังไม่มอบหมาย'}
                      </div>
                      {item.assignedDivision && (
                        <div className="text-xs text-gray-500">
                          {item.assignedDivision.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(item.created_at).toLocaleDateString('th-TH')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleTimeString('th-TH')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onView(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="ดูรายละเอียด"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="text-green-600 hover:text-green-900"
                          title="แก้ไข"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onAssign(item)}
                          className="text-purple-600 hover:text-purple-900"
                          title="มอบหมายงาน"
                        >
                          <UserPlusIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onStatusChange(item)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="เปลี่ยนสถานะ"
                        >
                          <WrenchScrewdriverIcon className="w-4 h-4" />
                        </button>
                        {item.status !== 'cancelled' && item.status !== 'closed' && (
                          <button
                            onClick={() => onGenerateWorkOrder(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="สร้างใบสั่งงาน"
                          >
                            <DocumentTextIcon className="w-4 h-4" />
                          </button>
                        )}
                        {['open', 'pending'].includes(item.status) && (
                          <button
                            onClick={() => onDelete(item)}
                            className="text-red-600 hover:text-red-900"
                            title="ยกเลิก"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total / pagination.limit)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
} 