import React from 'react';

interface Accessory {
  id: number;
  name: string;
  code: string;
  category: string;
  brand: string;
  model: string;
  location: string;
  status: string;
}

export default function AccessoryDashboard({ data }: { data: Accessory[] }) {
  const total = data.length;
  const active = data.filter(a => a.status === 'active').length;
  const inactive = data.filter(a => a.status === 'inactive').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">Total Accessories</div>
        <div className="text-2xl font-bold">{total}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">Active</div>
        <div className="text-2xl font-bold text-green-600">{active}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">Inactive</div>
        <div className="text-2xl font-bold text-red-600">{inactive}</div>
      </div>
    </div>
  );
} 