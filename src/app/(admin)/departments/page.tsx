"use client";

import React, { useEffect, useState } from "react";
import AdvancedOrganizationTable from "../../../components/organization/AdvancedOrganizationTable";
import OrganizationFormModal from "../../../components/organization/OrganizationFormModal";
import { Department, departmentService, CreateDepartmentData, Company, companyService, User, userService } from "../../../services/organization";

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: "code", label: "Code", filterable: true, searchable: true, exportable: true },
    { key: "name", label: "Department Name", filterable: true, searchable: true, exportable: true },
    { 
      key: "company", 
      label: "Company",
      render: (value: any, row: Department) => row.company?.name || "-",
      filterable: true,
      searchable: true,
      exportable: true
    },
    { 
      key: "manager", 
      label: "Manager",
      render: (value: any, row: Department) => row.manager?.username || "-",
      filterable: true,
      searchable: true,
      exportable: true
    },
    {
      key: "created_at",
      label: "Created At",
      render: (value: string) => new Date(value).toLocaleDateString(),
      searchable: true,
      exportable: true
    },
  ];

  // Create form fields with reactive options
  const formFields = [
    { 
      name: "company_id", 
      label: "Company", 
      type: "select" as const, 
      required: true,
      options: Array.isArray(companies) ? companies.map(company => ({ value: company.id, label: company.name })) : []
    },
    { name: "code", label: "Department Code", type: "text" as const, required: true, placeholder: "Enter department code" },
    { name: "name", label: "Department Name", type: "text" as const, required: true, placeholder: "Enter department name" },
    { 
      name: "manager_id", 
      label: "Manager", 
      type: "select" as const, 
      required: false,
      options: Array.isArray(users) ? users.map(user => ({ value: user.id, label: user.username })) : []
    },
  ];

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [departmentsData, companiesData, usersData] = await Promise.all([
        departmentService.getAll(),
        companyService.getAll(),
        userService.getActive()
      ]);
      console.log("Departments data:", departmentsData); // Debug log
      console.log("Companies data:", companiesData); // Debug log
      console.log("Users data:", usersData); // Debug log
      
      setDepartments(departmentsData);
      setCompanies(companiesData);
      setUsers(usersData);
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
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (department: Department) => {
    if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
      try {
        await departmentService.delete(department.id);
        await loadData();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  const handleSubmit = async (data: CreateDepartmentData) => {
    try {
      setIsSubmitting(true);
      if (editingDepartment) {
        await departmentService.update(editingDepartment.id, data);
      } else {
        await departmentService.create(data);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <AdvancedOrganizationTable
        data={departments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="Add Department"
        isLoading={isLoading}
        title="Departments Management"
      />

      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingDepartment ? "Edit Department" : "Add New Department"}
        fields={formFields}
        initialData={editingDepartment || {}}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DepartmentsPage; 