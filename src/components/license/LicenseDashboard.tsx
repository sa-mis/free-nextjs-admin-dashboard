import React from 'react';

interface License {
  id: number;
  license_key: string;
  software_name: string;
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

export default function LicenseDashboard({ data }: { data: License[] }) {
  const total = data.length;
  const active = data.filter(l => l.status === 'active').length;
  const expired = data.filter(l => l.status === 'expired').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">Total Licenses</div>
        <div className="text-2xl font-bold">{total}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">Active</div>
        <div className="text-2xl font-bold text-green-600">{active}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">Expired</div>
        <div className="text-2xl font-bold text-red-600">{expired}</div>
      </div>
    </div>
  );
} 