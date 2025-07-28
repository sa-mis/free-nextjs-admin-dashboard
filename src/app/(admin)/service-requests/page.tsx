'use client'

import { useEffect, useState, useCallback } from 'react';
import ServiceRequestDashboard from '@/components/service-request/ServiceRequestDashboard';
import ServiceRequestTable from '@/components/service-request/ServiceRequestTable';
import ServiceRequestFormModal from '@/components/service-request/ServiceRequestFormModal';
import ServiceRequestAssignModal from '@/components/service-request/ServiceRequestAssignModal';
import ServiceRequestStatusModal from '@/components/service-request/ServiceRequestStatusModal';
import ServiceRequestDetailModal from '@/components/service-request/ServiceRequestDetailModal';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { serviceRequestAPI } from '@/services/serviceRequest';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';
import LoaderShowcase from '@/components/ui/loading/LoaderShowCase';

export default function ServiceRequestsPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('service_request.view');
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // State for table data
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Fetch function
  const fetchServiceRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await serviceRequestAPI.getServiceRequests({ 
        page: pagination.page, 
        limit: pagination.limit 
      });
      setServiceRequests(res.data.requests || []);
      setPagination(prev => ({ 
        ...prev, 
        total: res.data.pagination?.total_items || 0 
      }));
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);

  const handleEdit = (serviceRequest: any) => {
    setSelected(serviceRequest);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const handleAssign = (serviceRequest: any) => {
    setSelected(serviceRequest);
    setAssignOpen(true);
  };

  const handleStatusChange = (serviceRequest: any) => {
    setSelected(serviceRequest);
    setStatusOpen(true);
  };

  const handleView = (serviceRequest: any) => {
    setSelected(serviceRequest);
    setDetailOpen(true);
  };

  const handleDelete = async (serviceRequest: any) => {
    if (!confirm('คุณต้องการยกเลิกรายการแจ้งซ่อมนี้หรือไม่?')) return;

    try {
      await serviceRequestAPI.deleteServiceRequest(serviceRequest.id);
      fetchServiceRequests();
    } catch (error: any) {
      console.error('Error deleting service request:', error);
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกรายการแจ้งซ่อม');
    }
  };

  const handleGenerateWorkOrder = async (serviceRequest: any) => {
    if (!confirm('คุณต้องการสร้างใบสั่งงานจากรายการแจ้งซ่อมนี้หรือไม่?')) return;

    try {
      await serviceRequestAPI.generateWorkOrder(serviceRequest.id);
      alert('สร้างใบสั่งงานสำเร็จ');
      fetchServiceRequests();
    } catch (error: any) {
      console.error('Error generating work order:', error);
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างใบสั่งงาน');
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;

  return (
    <div>
      <PageBreadcrumb pageTitle="Service Requests" />
      <div className="space-y-6">
        <ComponentCard title="Service Requests">
          <ServiceRequestDashboard />
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">รายการแจ้งซ่อม</h1>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleCreate}
            >
              สร้างรายการแจ้งซ่อมใหม่
            </button>
          </div>
          <ServiceRequestTable
            data={serviceRequests}
            loading={loading}
            pagination={pagination}
            setPagination={setPagination}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onAssign={handleAssign}
            onStatusChange={handleStatusChange}
            onGenerateWorkOrder={handleGenerateWorkOrder}
            reload={fetchServiceRequests}
          />
        </ComponentCard>

        {/* Modals */}
        <ServiceRequestFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSuccess={() => {
            fetchServiceRequests();
            setFormOpen(false);
          }}
          initialData={selected}
        />

        <ServiceRequestAssignModal
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          onSuccess={() => {
            fetchServiceRequests();
            setAssignOpen(false);
          }}
          serviceRequest={selected}
        />

        <ServiceRequestStatusModal
          open={statusOpen}
          onClose={() => setStatusOpen(false)}
          onSuccess={() => {
            fetchServiceRequests();
            setStatusOpen(false);
          }}
          serviceRequest={selected}
        />

        <ServiceRequestDetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          serviceRequest={selected}
        />

        <LoaderShowcase />
      </div>
    </div>
  );
} 