'use client';

import React, { useEffect, useState } from 'react';
import { divisionService } from '@/services/division';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';

const DivisionsPage = () => {
  const [divisions, setDivisions] = useState([]);
  const [newDivisionName, setNewDivisionName] = useState('');
  const [newDivisionCode, setNewDivisionCode] = useState('');
  const [editingDivision, setEditingDivision] = useState(null);

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const data = await divisionService.getAllDivisions();
      setDivisions(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch divisions.');
    }
  };

  const handleCreateDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await divisionService.createDivision({ name: newDivisionName, code: newDivisionCode });
      toast.success('Division created successfully!');
      setNewDivisionName('');
      setNewDivisionCode('');
      fetchDivisions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create division.');
    }
  };

  const handleEditDivision = (division: any) => {
    setEditingDivision(division);
    setNewDivisionName(division.name);
    setNewDivisionCode(division.code);
  };

  const handleUpdateDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDivision) return;
    try {
      await divisionService.updateDivision(editingDivision.id, { name: newDivisionName, code: newDivisionCode });
      toast.success('Division updated successfully!');
      setEditingDivision(null);
      setNewDivisionName('');
      setNewDivisionCode('');
      fetchDivisions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update division.');
    }
  };

  const handleDeleteDivision = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this division?')) {
      try {
        await divisionService.deleteDivision(id);
        toast.success('Division deleted successfully!');
        fetchDivisions();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete division.');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Divisions Management</h1>

      <div className="mb-8 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{editingDivision ? 'Edit Division' : 'Create New Division'}</h2>
        <form onSubmit={editingDivision ? handleUpdateDivision : handleCreateDivision} className="space-y-4">
          <div>
            <label htmlFor="divisionName" className="block text-gray-700 text-sm font-bold mb-2">Division Name:</label>
            <InputField
              type="text"
              id="divisionName"
              placeholder="Enter division name"
              value={newDivisionName}
              onChange={(e) => setNewDivisionName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="divisionCode" className="block text-gray-700 text-sm font-bold mb-2">Code:</label>
            <InputField
              type="text"
              id="divisionCode"
              placeholder="Enter division code"
              value={newDivisionCode}
              onChange={(e) => setNewDivisionCode(e.target.value)}
            />
          </div>
          <Button type="submit">{editingDivision ? 'Update Division' : 'Add Division'}</Button>
          {editingDivision && (
            <Button type="button" variant="outline" onClick={() => setEditingDivision(null)} className="ml-2">Cancel Edit</Button>
          )}
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Division List</h2>
        {divisions.length === 0 ? (
          <p>No divisions found.</p>
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
              {divisions.map((division: any) => (
                <tr key={division.id}>
                  <td className="py-2 px-4 border-b">{division.name}</td>
                  <td className="py-2 px-4 border-b">{division.code}</td>
                  <td className="py-2 px-4 border-b">
                    <Button size="sm" onClick={() => handleEditDivision(division)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteDivision(division.id)} className="ml-2">Delete</Button>
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

export default DivisionsPage;
