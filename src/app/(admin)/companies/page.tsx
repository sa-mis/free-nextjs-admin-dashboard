"use client";

import React, { useEffect, useState } from "react";
import AdvancedCustomTable from "../../../components/custom/AdvancedCustomTable";
import OrganizationFormModal from "../../../components/organization/OrganizationFormModal";
import { Company, companyService, CreateCompanyData } from "../../../services/organization";

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: "code", label: "Code", filterable: true, searchable: true, exportable: true },
    { key: "name", label: "Company Name", filterable: true, searchable: true, exportable: true },
    { key: "phone", label: "Phone", filterable: true, searchable: true, exportable: true },
    { key: "email", label: "Email", filterable: true, searchable: true, exportable: true },
    { key: "address", label: "Address", filterable: true, searchable: true, exportable: true },
    {
      key: "created_at",
      label: "Created At",
      render: (value: string) => new Date(value).toLocaleDateString(),
      searchable: true,
      exportable: true
    },
  ];

  const formFields = [
    { name: "code", label: "Company Code", type: "text" as const, required: true, placeholder: "Enter company code" },
    { name: "name", label: "Company Name", type: "text" as const, required: true, placeholder: "Enter company name" },
    { name: "phone", label: "Phone", type: "tel" as const, required: true, placeholder: "Enter phone number" },
    { name: "email", label: "Email", type: "email" as const, required: true, placeholder: "Enter email address" },
    { name: "address", label: "Address", type: "textarea" as const, required: true, placeholder: "Enter company address" },
  ];

  const loadCompanies = async () => {
    try {
      console.log("Starting to load companies..."); // Debug log
      setIsLoading(true);
      console.log("Calling companyService.getAll()..."); // Debug log
      const data = await companyService.getAll();
      console.log("Companies data received:", data); // Debug log
      console.log("Companies data type:", typeof data); // Debug log
      console.log("Companies data length:", Array.isArray(data) ? data.length : 'not an array'); // Debug log
      setCompanies(data);
    } catch (error: any) {
      console.error("Error loading companies:", error);
      console.error("Error details:", error.response?.data || error.message); // Debug log
      // You might want to show a toast notification here
    } finally {
      console.log("Setting isLoading to false"); // Debug log
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleAdd = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (company: Company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        await companyService.delete(company.id);
        await loadCompanies();
        // You might want to show a success toast here
      } catch (error) {
        console.error("Error deleting company:", error);
        // You might want to show an error toast here
      }
    }
  };

  const handleSubmit = async (data: CreateCompanyData) => {
    try {
      setIsSubmitting(true);
      if (editingCompany) {
        await companyService.update(editingCompany.id, data);
      } else {
        await companyService.create(data);
      }
      await loadCompanies();
      setIsModalOpen(false);
      // You might want to show a success toast here
    } catch (error) {
      console.error("Error saving company:", error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <AdvancedCustomTable
        data={companies}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="Add Company"
        isLoading={isLoading}
        title="Companies Management"
      />

      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingCompany ? "Edit Company" : "Add New Company"}
        fields={formFields}
        initialData={editingCompany || {}}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CompaniesPage; 