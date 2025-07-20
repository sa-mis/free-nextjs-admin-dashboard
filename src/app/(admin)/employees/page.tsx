"use client";

import React, { useEffect, useState } from "react";
import OrganizationTable from "../../../components/organization/OrganizationTable";
import OrganizationFormModal from "../../../components/organization/OrganizationFormModal";
import { Employee, employeeService, CreateEmployeeData, User, userService } from "../../../services/organization";

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: "code", label: "Employee Code" },
    { 
      key: "name", 
      label: "Full Name",
      render: (value: any, row: Employee) => `${row.first_name} ${row.last_name}`
    },
    { key: "position", label: "Position" },
    { key: "phone", label: "Phone" },
    { 
      key: "user", 
      label: "Username",
      render: (value: any, row: Employee) => row.user?.username || "-"
    },
    { 
      key: "supervisor", 
      label: "Supervisor",
      render: (value: any, row: Employee) => row.supervisor ? `${row.supervisor.first_name} ${row.supervisor.last_name}` : "-"
    },
    { 
      key: "is_active", 
      label: "Status",
      render: (value: boolean) => value ? "Active" : "Inactive"
    },
    {
      key: "hire_date",
      label: "Hire Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // Create form fields with reactive options
  const formFields = [
    { 
      name: "user_id", 
      label: "User", 
      type: "select" as const, 
      required: true,
      options: Array.isArray(users) ? users.map(user => ({ value: user.id, label: user.username })) : []
    },
    { name: "code", label: "Employee Code", type: "text" as const, required: true, placeholder: "Enter employee code" },
    { name: "first_name", label: "First Name", type: "text" as const, required: true, placeholder: "Enter first name" },
    { name: "last_name", label: "Last Name", type: "text" as const, required: true, placeholder: "Enter last name" },
    { name: "position", label: "Position", type: "text" as const, required: true, placeholder: "Enter position" },
    { name: "phone", label: "Phone", type: "tel" as const, required: true, placeholder: "Enter phone number" },
    { name: "hire_date", label: "Hire Date", type: "date" as const, required: true },
    { name: "termination_date", label: "Termination Date", type: "date" as const, required: false },
    { 
      name: "supervisor_id", 
      label: "Supervisor", 
      type: "select" as const, 
      required: false,
      options: Array.isArray(supervisors) ? supervisors.map(emp => ({ 
        value: emp.id, 
        label: `${emp.first_name} ${emp.last_name}` 
      })) : []
    },
    { 
      name: "is_active", 
      label: "Status", 
      type: "select" as const, 
      required: true,
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
      ]
    },
  ];

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [employeesData, usersData] = await Promise.all([
        employeeService.getAll(),
        userService.getActive()
      ]);
      setEmployees(employeesData);
      setUsers(usersData);
      setSupervisors(employeesData.filter(emp => emp.is_active));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      try {
        await employeeService.delete(employee.id);
        await loadData();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleSubmit = async (data: CreateEmployeeData) => {
    try {
      setIsSubmitting(true);
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, data);
      } else {
        await employeeService.create(data);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <OrganizationTable
        data={employees}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="Add Employee"
        isLoading={isLoading}
      />

      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
        fields={formFields}
        initialData={editingEmployee || {}}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EmployeesPage; 