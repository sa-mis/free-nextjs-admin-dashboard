"use client";

import React, { useEffect, useState } from 'react';
import { companyService } from '@/services/company';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDescription, setNewCompanyDescription] = useState('');
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await companyService.getAllCompanies();
      setCompanies(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch companies.');
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await companyService.createCompany({ name: newCompanyName, description: newCompanyDescription });
      toast.success('Company created successfully!');
      setNewCompanyName('');
      setNewCompanyDescription('');
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create company.');
    }
  };

  const handleEditCompany = (company: any) => {
    setEditingCompany(company);
    setNewCompanyName(company.name);
    setNewCompanyDescription(company.description);
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;
    try {
      await companyService.updateCompany(editingCompany.id, { name: newCompanyName, description: newCompanyDescription });
      toast.success('Company updated successfully!');
      setEditingCompany(null);
      setNewCompanyName('');
      setNewCompanyDescription('');
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update company.');
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.deleteCompany(id);
        toast.success('Company deleted successfully!');
        fetchCompanies();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete company.');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Companies Management</h1>

      <div className="mb-8 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{editingCompany ? 'Edit Company' : 'Create New Company'}</h2>
        <form onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany} className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">Company Name:</label>
            <InputField
              type="text"
              id="companyName"
              placeholder="Enter company name"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="companyDescription" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <InputField
              type="text"
              id="companyDescription"
              placeholder="Enter company description"
              value={newCompanyDescription}
              onChange={(e) => setNewCompanyDescription(e.target.value)}
            />
          </div>
          <Button type="submit">{editingCompany ? 'Update Company' : 'Add Company'}</Button>
          {editingCompany && (
            <Button type="button" variant="outline" onClick={() => setEditingCompany(null)} className="ml-2">Cancel Edit</Button>
          )}
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Company List</h2>
        {companies.length === 0 ? (
          <p>No companies found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company: any) => (
                <tr key={company.id}>
                  <td className="py-2 px-4 border-b">{company.name}</td>
                  <td className="py-2 px-4 border-b">{company.description}</td>
                  <td className="py-2 px-4 border-b">
                    <Button size="sm" onClick={() => handleEditCompany(company)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteCompany(company.id)} className="ml-2">Delete</Button>
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

export default CompaniesPage;
