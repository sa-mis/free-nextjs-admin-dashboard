'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import Button from '@/components/ui/button/Button';
import LicenseDashboard from '@/components/license/LicenseDashboard';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { licenseAPI } from '@/services/license';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

// License interface
interface License {
  id: number;
  license_key: string;
  name: string;
  version: string;
  license_type: 'perpetual' | 'subscription' | 'trial';
  seats_total: number;
  seats_used: number;
  purchase_date?: string;
  start_date?: string;
  end_date?: string;
  vendor_id: number;
  vendor_name?: string;
  purchase_price?: number;
  annual_cost?: number;
  notes?: string;
  status: 'active' | 'expired' | 'cancelled';
}

const columns = [
  { key: 'license_key', label: 'License Key', filterable: true, searchable: true, exportable: true },
  { key: 'name', label: 'Software Name', filterable: true, searchable: true, exportable: true },
  { key: 'version', label: 'Version', filterable: true, searchable: true, exportable: true },
  { key: 'license_type', label: 'Type', filterable: true, searchable: true, exportable: true },
  { key: 'seats_total', label: 'Seats Total', filterable: true, searchable: true, exportable: true },
  { key: 'seats_used', label: 'Seats Used', filterable: true, searchable: true, exportable: true },
  { key: 'start_date', label: 'Start Date', filterable: true, searchable: true, exportable: true },
  { key: 'end_date', label: 'End Date', filterable: true, searchable: true, exportable: true },
  { key: 'status', label: 'Status', filterable: true, searchable: true, exportable: true },
];

export default function LicensesPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('license.view');
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Fetch licenses on component mount
  useEffect(() => {
    fetchLicenses();
    fetchDashboardData();
  }, []);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await licenseAPI.getAll();
      if (response.data.success) {
        setLicenses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await licenseAPI.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleEdit = (license: License) => {
    router.push(`/licenses/${license.id}/edit`);
  };

  const handleDelete = async (license: License) => {
    if (confirm(`Are you sure you want to delete license "${license.name}"?`)) {
      try {
        await licenseAPI.delete(license.id);
        // Refresh the list after deletion
        fetchLicenses();
      } catch (error) {
        console.error('Error deleting license:', error);
        alert('Failed to delete license. Please try again.');
      }
    }
  };

  const handleAdd = () => {
    router.push('/licenses/create');
  };

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Licenses" />
      <div className="space-y-6">
        <ComponentCard title="Licenses">
          {dashboardData && <LicenseDashboard data={licenses} />}
          <AdvancedCustomTable
            data={licenses}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            addButtonText="Add License"
            isLoading={loading}
            title="Licenses Management"
          />
        </ComponentCard>
      </div>
    </div>
  );
} 