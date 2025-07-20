'use client';

import React, { useEffect, useState } from 'react';
import { departmentService } from '@/services/department';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentCode, setNewDepartmentCode] = useState('');
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch departments.');
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await departmentService.createDepartment({ name: newDepartmentName, code: newDepartmentCode });
      toast.success('Department created successfully!');
      setNewDepartmentName('');
      setNewDepartmentCode('');
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create department.');
    }
  };

  const handleEditDepartment = (department: any) => {
    setEditingDepartment(department);
    setNewDepartmentName(department.name);
    setNewDepartmentCode(department.code);
  };

  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;
    try {
      await departmentService.updateDepartment(editingDepartment.id, { name: newDepartmentName, code: newDepartmentCode });
      toast.success('Department updated successfully!');
      setEditingDepartment(null);
      setNewDepartmentName('');
      setNewDepartmentCode('');
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update department.');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(id);
        toast.success('Department deleted successfully!');
        fetchDepartments();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete department.');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Departments Management</h1>

      <div className="mb-8 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{editingDepartment ? 'Edit Department' : 'Create New Department'}</h2>
        <form onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment} className="space-y-4">
          <div>
            <label htmlFor="departmentName" className="block text-gray-700 text-sm font-bold mb-2">Department Name:</label>
            <InputField
              type="text"
              id="departmentName"
              placeholder="Enter department name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="departmentCode" className="block text-gray-700 text-sm font-bold mb-2">Code:</label>
            <InputField
              type="text"
              id="departmentCode"
              placeholder="Enter department code"
              value={newDepartmentCode}
              onChange={(e) => setNewDepartmentCode(e.target.value)}
            />
          </div>
          <Button type="submit">{editingDepartment ? 'Update Department' : 'Add Department'}</Button>
          {editingDepartment && (
            <Button type="button" variant="outline" onClick={() => setEditingDepartment(null)} className="ml-2">Cancel Edit</Button>
          )}
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Department List</h2>
        {departments.length === 0 ? (
          <p>No departments found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Code</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department: any) => (
                <tr key={department.id}>
                  <td className="py-2 px-4 border-b">{department.name}</td>
                  <td className="py-2 px-4 border-b">{department.code}</td>
                  <td className="py-2 px-4 border-b">
                    <Button size="sm" onClick={() => handleEditDepartment(department)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteDepartment(department.id)} className="ml-2">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
