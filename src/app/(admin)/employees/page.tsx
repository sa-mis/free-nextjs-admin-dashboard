'use client';

import React, { useEffect, useState } from 'react';
import { employeeService } from '@/services/employee';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState('');
  const [newEmployeeLastName, setNewEmployeeLastName] = useState('');
  const [newEmployeeCode, setNewEmployeeCode] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch employees.');
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeService.createEmployee({ first_name: newEmployeeFirstName, last_name: newEmployeeLastName, code: newEmployeeCode });
      toast.success('Employee created successfully!');
      setNewEmployeeFirstName('');
      setNewEmployeeLastName('');
      setNewEmployeeCode('');
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create employee.');
    }
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setNewEmployeeFirstName(employee.first_name);
    setNewEmployeeLastName(employee.last_name);
    setNewEmployeeCode(employee.code);
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    try {
      await employeeService.updateEmployee(editingEmployee.id, { first_name: newEmployeeFirstName, last_name: newEmployeeLastName, code: newEmployeeCode });
      toast.success('Employee updated successfully!');
      setEditingEmployee(null);
      setNewEmployeeFirstName('');
      setNewEmployeeLastName('');
      setNewEmployeeCode('');
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update employee.');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        toast.success('Employee deleted successfully!');
        fetchEmployees();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete employee.');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employees Management</h1>

      <div className="mb-8 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{editingEmployee ? 'Edit Employee' : 'Create New Employee'}</h2>
        <form onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee} className="space-y-4">
          <div>
            <label htmlFor="employeeFirstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
            <InputField
              type="text"
              id="employeeFirstName"
              placeholder="Enter first name"
              value={newEmployeeFirstName}
              onChange={(e) => setNewEmployeeFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="employeeLastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
            <InputField
              type="text"
              id="employeeLastName"
              placeholder="Enter last name"
              value={newEmployeeLastName}
              onChange={(e) => setNewEmployeeLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="employeeCode" className="block text-gray-700 text-sm font-bold mb-2">Code:</label>
            <InputField
              type="text"
              id="employeeCode"
              placeholder="Enter employee code"
              value={newEmployeeCode}
              onChange={(e) => setNewEmployeeCode(e.target.value)}
            />
          </div>
          <Button type="submit">{editingEmployee ? 'Update Employee' : 'Add Employee'}</Button>
          {editingEmployee && (
            <Button type="button" variant="outline" onClick={() => setEditingEmployee(null)} className="ml-2">Cancel Edit</Button>
          )}
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Employee List</h2>
        {employees.length === 0 ? (
          <p>No employees found.</p>
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
              {employees.map((employee: any) => (
                <tr key={employee.id}>
                  <td className="py-2 px-4 border-b">{employee.first_name} {employee.last_name}</td>
                  <td className="py-2 px-4 border-b">{employee.code}</td>
                  <td className="py-2 px-4 border-b">
                    <Button size="sm" onClick={() => handleEditEmployee(employee)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteEmployee(employee.id)} className="ml-2">Delete</Button>
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

export default EmployeesPage;
