"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrganizationFormModal from "@/components/organization/OrganizationFormModal";
import Button from "@/components/ui/button/Button";
import { assetAPI } from '@/services/asset';
import { userService } from '@/services/organization';
import { licenseAPI } from '@/services/license';

const licenseFields = [
  { name: 'license_key', label: 'License Key', type: 'text', required: true, placeholder: 'Enter license key' },
  { name: 'name', label: 'Software Name', type: 'text', required: true, placeholder: 'Enter software name' },
  { name: 'version', label: 'Version', type: 'text', required: false, placeholder: 'Enter version' },
  { name: 'license_type', label: 'Type', type: 'select', required: true, options: [
    { value: 'subscription', label: 'Subscription' },
    { value: 'perpetual', label: 'Perpetual' },
    { value: 'trial', label: 'Trial' },
  ] },
  { name: 'seats_total', label: 'Seats Total', type: 'number', required: true, placeholder: 'Enter total seats' },
  { name: 'seats_used', label: 'Seats Used', type: 'number', required: false, placeholder: 'Enter used seats' },
  { name: 'purchase_date', label: 'Purchase Date', type: 'date', required: false },
  { name: 'start_date', label: 'Start Date', type: 'date', required: false },
  { name: 'end_date', label: 'End Date', type: 'date', required: false },
  { name: 'vendor_id', label: 'Vendor', type: 'number', required: false, placeholder: 'Enter vendor id' },
  { name: 'purchase_price', label: 'Purchase Price', type: 'number', required: false, placeholder: 'Enter purchase price' },
  { name: 'annual_cost', label: 'Annual Cost', type: 'number', required: false, placeholder: 'Enter annual cost' },
  { name: 'notes', label: 'Notes', type: 'textarea', required: false, placeholder: 'Enter notes' },
  { name: 'status', label: 'Status', type: 'select', required: true, options: [
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' },
  ] },
];

export default function LicenseCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({ status: "active" });
  const [assignmentType, setAssignmentType] = useState<"assets" | "users">("assets");
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  useEffect(() => {
    assetAPI.getAll({ limit: 1000 }).then(res => setAvailableAssets(res.data || []));
    userService.getAll().then(res => setAvailableUsers(res || []));
  }, []);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Create license
      const licenseRes = await licenseAPI.create(formData);
      const license_id = licenseRes.data?.data?.id;
      
      // 2. Assign license if assets/users selected
      if (license_id && (selectedAssets.length > 0 || selectedUsers.length > 0)) {
        await licenseAPI.assignLicense(license_id, {
          asset_ids: assignmentType === 'assets' ? selectedAssets : undefined,
          user_ids: assignmentType === 'users' ? selectedUsers : undefined,
          assigned_date: new Date().toISOString().slice(0, 10),
        });
      }
      router.push("/licenses");
    } catch (err) {
      console.error('Error creating license:', err);
      alert('Failed to create license. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-lg p-4 md:p-6 2xl:p-10">
      <h2 className="text-title-md2 font-bold text-black dark:text-white mb-6">Create License</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* License Fields */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {licenseFields.map(field => (
              <div key={field.name}>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">{field.label}{field.required && <span className="text-error-500 ml-1">*</span>}</label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={e => handleFieldChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={e => handleFieldChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={e => handleFieldChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Assignment Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Assignment</h3>
          <div className="flex gap-6 mb-4">
            <label>
              <input
                type="radio"
                name="assignmentType"
                value="assets"
                checked={assignmentType === "assets"}
                onChange={() => setAssignmentType("assets")}
              />
              <span className="ml-2">Assign to Assets</span>
            </label>
            <label>
              <input
                type="radio"
                name="assignmentType"
                value="users"
                checked={assignmentType === "users"}
                onChange={() => setAssignmentType("users")}
              />
              <span className="ml-2">Assign to Users</span>
            </label>
          </div>
          {assignmentType === "assets" ? (
            <div>
              <div className="max-h-48 overflow-y-auto border rounded p-2 mb-2">
                {availableAssets.map(asset => (
                  <label key={asset.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={e => {
                        setSelectedAssets(prev =>
                          e.target.checked
                            ? [...prev, asset.id]
                            : prev.filter(id => id !== asset.id)
                        );
                      }}
                    />
                    <span>{asset.name} ({asset.asset_tag})</span>
                  </label>
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Selected: {selectedAssets.length}
              </div>
            </div>
          ) : (
            <div>
              <div className="max-h-48 overflow-y-auto border rounded p-2 mb-2">
                {availableUsers.map(user => (
                  <label key={user.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={e => {
                        setSelectedUsers(prev =>
                          e.target.checked
                            ? [...prev, user.id]
                            : prev.filter(id => id !== user.id)
                        );
                      }}
                    />
                    <span>{user.username} ({user.email})</span>
                  </label>
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Selected: {selectedUsers.length}
              </div>
            </div>
          )}
        </div>
        {/* License History (empty for create) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">License History</h3>
          <div className="text-gray-500">No history yet.</div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/licenses")}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create License"}</Button>
        </div>
      </form>
    </div>
  );
} 