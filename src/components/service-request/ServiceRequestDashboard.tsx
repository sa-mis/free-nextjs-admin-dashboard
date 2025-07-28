import { useEffect, useState } from 'react';
import { serviceRequestAPI } from '@/services/serviceRequest';
import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ClockIcon as ClockIconSolid
} from '@/icons';

export default function ServiceRequestDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    serviceRequestAPI.getDashboard().then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-8">กำลังโหลดแดชบอร์ด...</div>;
  if (!stats) return <div className="text-center py-8">ไม่มีข้อมูลแดชบอร์ด</div>;

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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">แดชบอร์ดการแจ้งซ่อม</h2>
      
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <DocumentTextIcon className="w-10 h-10 text-blue-500 bg-blue-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.total || 0}</div>
            <div className="text-gray-500 text-sm">จำนวนแจ้งซ่อมทั้งหมด</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ClockIcon className="w-10 h-10 text-orange-500 bg-orange-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.pending || 0}</div>
            <div className="text-gray-500 text-sm">แจ้งซ่อมที่รอดำเนินการ</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <WrenchScrewdriverIcon className="w-10 h-10 text-yellow-500 bg-yellow-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.in_progress || 0}</div>
            <div className="text-gray-500 text-sm">แจ้งซ่อมที่กำลังดำเนินการ</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <CheckCircleIcon className="w-10 h-10 text-green-500 bg-green-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.completed || 0}</div>
            <div className="text-gray-500 text-sm">แจ้งซ่อมที่เสร็จสิ้น</div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <XCircleIcon className="w-10 h-10 text-red-500 bg-red-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.cancelled || 0}</div>
            <div className="text-gray-500 text-sm">แจ้งซ่อมที่ถูกยกเลิก</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ExclamationTriangleIcon className="w-10 h-10 text-red-500 bg-red-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.overdueRequests?.length || 0}</div>
            <div className="text-gray-500 text-sm">รายการที่เกินกำหนด</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ClockIconSolid className="w-10 h-10 text-blue-500 bg-blue-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.avgResponseTime || 0}</div>
            <div className="text-gray-500 text-sm">เวลาตอบสนองเฉลี่ย (ชม.)</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <ArrowTrendingUpIcon className="w-10 h-10 text-green-500 bg-green-100 rounded-full p-2" />
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.avgResolutionTime || 0}</div>
            <div className="text-gray-500 text-sm">เวลาปิดงานเฉลี่ย (ชม.)</div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-gray-800">สัดส่วนสถานะแจ้งซ่อม</h3>
          </div>
          <div className="space-y-3">
            {stats.statusDistribution && Object.entries(stats.statusDistribution).map(([status, count]: [string, any]) => (
              <div key={status} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status === 'open' && 'เปิดใหม่'}
                    {status === 'in_progress' && 'กำลังดำเนินการ'}
                    {status === 'pending' && 'รอดำเนินการ'}
                    {status === 'resolved' && 'แก้ไขแล้ว'}
                    {status === 'closed' && 'ปิดงาน'}
                    {status === 'cancelled' && 'ยกเลิก'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Requests */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <DocumentTextIcon className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-gray-800">รายการแจ้งซ่อมล่าสุด</h3>
          </div>
          <div className="space-y-3">
            {stats.latestRequests?.slice(0, 5).map((request: any) => (
              <div key={request.id} className="text-sm border-b border-gray-100 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{request.title}</div>
                    <div className="text-gray-500 text-xs">{request.requester?.username}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status === 'open' && 'เปิดใหม่'}
                    {request.status === 'in_progress' && 'กำลังดำเนินการ'}
                    {request.status === 'pending' && 'รอดำเนินการ'}
                    {request.status === 'resolved' && 'แก้ไขแล้ว'}
                    {request.status === 'closed' && 'ปิดงาน'}
                    {request.status === 'cancelled' && 'ยกเลิก'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overdue Requests */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-gray-800">รายการแจ้งซ่อมที่เกินกำหนด</h3>
          </div>
          <div className="space-y-3">
            {stats.overdueRequests?.slice(0, 5).map((request: any) => (
              <div key={request.id} className="text-sm border-b border-gray-100 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{request.title}</div>
                    <div className="text-gray-500 text-xs">
                      กำหนด: {new Date(request.due_date).toLocaleDateString('th-TH')}
                    </div>
                  </div>
                  <span className="text-red-600 text-xs font-medium">เกินกำหนด</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <BuildingOfficeIcon className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-gray-800">อันดับหมวดหมู่แจ้งซ่อมที่พบบ่อย</h3>
          </div>
          <div className="space-y-3">
            {stats.topCategories?.slice(0, 5).map((category: any) => (
              <div key={category.category_id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{category.category?.name || 'ไม่มีหมวดหมู่'}</span>
                <span className="text-sm font-semibold text-gray-800">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Division and Assignee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Division */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <UserGroupIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-gray-800">จำนวนแจ้งซ่อมแยกตามแผนก/ฝ่าย</h3>
          </div>
          <div className="space-y-3">
            {stats.byDivision?.slice(0, 5).map((division: any) => (
              <div key={division.assigned_division_id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{division.assignedDivision?.name || 'ไม่ระบุแผนก'}</span>
                <span className="text-sm font-semibold text-gray-800">{division.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Assignee */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <UserGroupIcon className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-gray-800">จำนวนแจ้งซ่อมแยกตามผู้รับผิดชอบ</h3>
          </div>
          <div className="space-y-3">
            {stats.byAssignee?.slice(0, 5).map((assignee: any) => (
              <div key={assignee.assigned_to} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{assignee.assignedTo?.username || 'ไม่ระบุผู้รับผิดชอบ'}</span>
                <span className="text-sm font-semibold text-gray-800">{assignee.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Statistics Chart */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-gray-800">สถิติแจ้งซ่อมรายเดือน</h3>
        </div>
        <div className="space-y-3">
          {stats.monthlyStats?.slice(0, 7).map((stat: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {new Date(stat.date).toLocaleDateString('th-TH', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <span className="text-sm font-semibold text-gray-800">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 