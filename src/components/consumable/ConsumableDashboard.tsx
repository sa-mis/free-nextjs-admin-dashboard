import React from 'react';
import { Consumable } from '@/types/consumable';

export default function ConsumableDashboard({ data }: { data: Consumable[] }) {
  const total = Array.isArray(data) ? data.length : 0;
  const inStock = Array.isArray(data) ? data.filter(c => c.status === 'active').length : 0;
  const outOfStock = Array.isArray(data) ? data.filter(c => c.status === 'out_of_stock').length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">Total Consumables</div>
        <div className="text-2xl font-bold">{total}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">In Stock</div>
        <div className="text-2xl font-bold text-green-600">{inStock}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-gray-500 text-xs">Out of Stock</div>
        <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
      </div>
    </div>
  );
} 