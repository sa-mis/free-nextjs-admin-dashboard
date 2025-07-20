import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { PencilIcon, TrashBinIcon, PlusIcon } from "../../icons";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface OrganizationTableProps {
  data: any[];
  columns: Column[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onAdd: () => void;
  addButtonText?: string;
  isLoading?: boolean;
}

const OrganizationTable: React.FC<OrganizationTableProps> = ({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  addButtonText = "Add New",
  isLoading = false,
}) => {
  // Debug logging
  console.log("OrganizationTable received data:", data);
  console.log("OrganizationTable columns:", columns);
  console.log("OrganizationTable isLoading:", isLoading);

  const renderCell = (column: Column, row: any) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }

    // Default rendering based on data type
    if (typeof value === "boolean") {
      return (
        <Badge
          color={value ? "success" : "error"}
          size="sm"
        >
          {value ? "Active" : "Inactive"}
        </Badge>
      );
    }

    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    return <span className="text-gray-800 dark:text-white/90">{value}</span>;
  };

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  console.log("OrganizationTable safeData:", safeData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Organization Management
        </h2>
        <Button
          onClick={onAdd}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          {addButtonText}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {safeData.length === 0 ? (
                  <TableRow>
                    <td
                      colSpan={columns.length + 1}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No data available
                    </td>
                  </TableRow>
                ) : (
                  safeData.map((row, index) => (
                    <TableRow key={row.id || index}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className="px-5 py-4 sm:px-6 text-start"
                        >
                          {renderCell(column, row)}
                        </TableCell>
                      ))}
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => onEdit(row)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <PencilIcon className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => onDelete(row)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-error-500 hover:text-error-600"
                          >
                            <TrashBinIcon className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationTable; 