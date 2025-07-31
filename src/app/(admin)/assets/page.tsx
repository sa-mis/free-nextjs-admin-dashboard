'use client';

import { useState, useEffect } from 'react';
import { assetAPI, Asset, AssetQuery } from '@/services/asset';
import { categoryAPI } from '@/services/category';
import { brandAPI } from '@/services/brand';
import { vendorAPI } from '@/services/vendor';
import { divisionService } from '@/services/organization';
import { toast } from 'react-hot-toast';
import AdvancedCustomTable from '@/components/custom/AdvancedCustomTable';
import { AssetFormModal } from '@/components/asset/AssetFormModal';
import { AssetDashboard } from '@/components/asset/AssetDashboard';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import { PlusIcon } from '@/icons';
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';
import Select from '@/components/form/Select';

export default function AssetsPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('asset.view');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [query, setQuery] = useState<AssetQuery>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [divisions, setDivisions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    loadAssets();
    loadDropdownData();
  }, [query]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await assetAPI.getAll(query);
      setAssets(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load assets');
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [divisionsRes, categoriesRes, brandsRes, vendorsRes] = await Promise.all([
        divisionService.getAll(),
        categoryAPI.getAll(),
        brandAPI.getAll(),
        vendorAPI.getAll()
      ]);

      setDivisions(divisionsRes);
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
      setVendors(vendorsRes.data);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      await assetAPI.delete(id);
      toast.success('Asset deleted successfully');
      loadAssets();
    } catch (error) {
      toast.error('Failed to delete asset');
      console.error('Error deleting asset:', error);
    }
  };

  const handleSave = async (data: Partial<Asset>) => {
    try {
      if (editingAsset) {
        await assetAPI.update(editingAsset.id, data);
        toast.success('Asset updated successfully');
      } else {
        await assetAPI.create(data);
        toast.success('Asset created successfully');
      }
      setShowModal(false);
      loadAssets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save asset');
      console.error('Error saving asset:', error);
    }
  };

  const handleSearch = (value: string) => {
    setQuery(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilter = (key: string, value: any) => {
    setQuery(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'disposed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const columns = [
    { key: 'asset_tag', label: 'Asset Tag', filterable: true, searchable: true, exportable: true },
    { key: 'name', label: 'Asset Name', filterable: true, searchable: true, exportable: true },
    { key: 'category_name', label: 'Category', filterable: true, searchable: true, exportable: true },
    { key: 'brand_name', label: 'Brand', filterable: true, searchable: true, exportable: true },
    { key: 'model_name', label: 'Model', filterable: true, searchable: true, exportable: true },
    { key: 'location', label: 'Location', filterable: true, searchable: true, exportable: true },
    { key: 'division_name', label: 'Division', filterable: true, searchable: true, exportable: true },
    { key: 'status', label: 'Status', filterable: true, searchable: true, exportable: true, render: (value: string) => <span className={getStatusColor(value)}>{value}</span> },
    { key: 'condition_status', label: 'Condition', filterable: true, searchable: true, exportable: true, render: (value: string) => <span className={getConditionColor(value)}>{value}</span> },
    { key: 'purchase_price', label: 'Value', filterable: true, searchable: true, exportable: true, render: (value: number) => value ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-' },
  ];

  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your organization's assets</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Add Asset
        </Button>
      </div>

      {/* Dashboard Stats */}
      <AssetDashboard />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField
          placeholder="Search assets..."
          value={query.search || ''}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Select
          value={query.status || ''}
          onChange={(value) => handleFilter('status', value || undefined)}
          // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
          <option value="disposed">Disposed</option>
        </Select>
        <Select
          value={query.category_id || ''}
          onChange={(value) => handleFilter('category_id', value ? parseInt(value) : undefined)}
          // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select
          value={query.division_id || ''}
          onChange={(value) => handleFilter('division_id', value ? parseInt(value) : undefined)}
          // className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Divisions</option>
          {divisions.map((division: any) => (
            <option key={division.id} value={division.id}>
              {division.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Assets Table */}
      <AdvancedCustomTable
        data={assets}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(asset) => handleDelete(asset.id)}
        onAdd={handleCreate}
        addButtonText="Add Asset"
        isLoading={loading}
        title="Assets Management"
      />

      {/* Asset Form Modal */}
      <AssetFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        asset={editingAsset}
        onSave={handleSave}
        divisions={divisions}
        categories={categories}
        brands={brands}
        vendors={vendors}
      />
    </div>
  );
} 