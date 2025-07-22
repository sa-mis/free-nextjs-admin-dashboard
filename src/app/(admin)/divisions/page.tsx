"use client";

import React, { useEffect, useState } from "react";
import AdvancedCustomTable from "../../../components/custom/AdvancedCustomTable";
import OrganizationFormModal from "../../../components/organization/OrganizationFormModal";
import { Division, divisionService, CreateDivisionData, Department, departmentService, User, userService } from "../../../services/organization";

const DivisionsPage: React.FC = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: "code", label: "Code", filterable: true, searchable: true, exportable: true },
    { key: "name", label: "Division Name", filterable: true, searchable: true, exportable: true },
    { 
      key: "department", 
      label: "Department",
      render: (value: any, row: Division) => row.department?.name || "-",
      filterable: true,
      searchable: true,
      exportable: true
    },
    { 
      key: "manager", 
      label: "Manager",
      render: (value: any, row: Division) => row.manager?.username || "-",
      filterable: true,
      searchable: true,
      exportable: true
    },
    { 
      key: "is_active", 
      label: "Status",
      render: (value: boolean) => value ? "Active" : "Inactive",
      filterable: true,
      searchable: true,
      exportable: true
    },
    {
      key: "created_at",
      label: "Created At",
      render: (value: string) => formatDateTime(value),
      searchable: true,
      exportable: true
    },
  ];

  // Create form fields with reactive options
  const formFields = [
    { 
      name: "department_id", 
      label: "Department", 
      type: "select" as const, 
      required: true,
      options: Array.isArray(departments) ? departments.map(dept => ({ value: dept.id, label: dept.name })) : []
    },
    { name: "code", label: "Division Code", type: "text" as const, required: true, placeholder: "Enter division code" },
    { name: "name", label: "Division Name", type: "text" as const, required: true, placeholder: "Enter division name" },
    { 
      name: "manager_id", 
      label: "Manager", 
      type: "select" as const, 
      required: false,
      options: Array.isArray(users) ? users.map(user => ({ value: user.id, label: user.username })) : []
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
      const [divisionsData, departmentsData, usersData] = await Promise.all([
        divisionService.getAll(),
        departmentService.getAll(),
        userService.getActive()
      ]);
      setDivisions(divisionsData);
      setDepartments(departmentsData);
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
    setEditingDivision(null);
    setIsModalOpen(true);
  };

  const handleEdit = (division: Division) => {
    setEditingDivision(division);
    setIsModalOpen(true);
  };

  const handleDelete = async (division: Division) => {
    if (window.confirm(`Are you sure you want to delete ${division.name}?`)) {
      try {
        await divisionService.delete(division.id);
        await loadData();
      } catch (error) {
        console.error("Error deleting division:", error);
      }
    }
  };

  const handleSubmit = async (data: CreateDivisionData) => {
    try {
      setIsSubmitting(true);
      if (editingDivision) {
        await divisionService.update(editingDivision.id, data);
      } else {
        await divisionService.create(data);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving division:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <AdvancedCustomTable
        data={divisions}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="Add Division"
        isLoading={isLoading}
        title="Divisions Management"
      />

      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingDivision ? "Edit Division" : "Add New Division"}
        fields={formFields}
        initialData={editingDivision || {}}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DivisionsPage; 