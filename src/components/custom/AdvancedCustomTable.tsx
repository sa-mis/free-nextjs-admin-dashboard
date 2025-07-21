import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { PencilIcon, TrashBinIcon, PlusIcon, SearchIcon, DownloadIcon } from "../../icons";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  filterable?: boolean;
  searchable?: boolean;
  exportable?: boolean; // New property for export
}

interface AdvancedCustomTableProps {
  data: any[];
  columns: Column[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onAdd: () => void;
  addButtonText?: string;
  isLoading?: boolean;
  title?: string;
}

const AdvancedCustomTable: React.FC<AdvancedCustomTableProps> = ({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  addButtonText = "Add New",
  isLoading = false,
  title = "Organization Management",
}) => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get filterable and searchable columns
  const filterableColumns = useMemo(() => 
    columns.filter(col => col.filterable), [columns]
  );
  
  const searchableColumns = useMemo(() => 
    columns.filter(col => col.searchable !== false), [columns]
  );

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        searchableColumns.some(col => {
          let value = item[col.key];
          
          // Handle nested properties for related columns
          if (col.key === 'company') {
            value = item.company?.name;
          } else if (col.key === 'manager') {
            value = item.manager?.username;
          } else if (col.key === 'department') {
            value = item.department?.name;
          } else if (col.key === 'user') {
            value = item.user?.username;
          } else if (col.key === 'supervisor') {
            value = item.supervisor ? `${item.supervisor.first_name} ${item.supervisor.last_name}` : null;
          }
          
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(item => {
          let itemValue = item[key];
          
          // Handle nested properties for related columns
          if (key === 'company') {
            itemValue = item.company?.name;
          } else if (key === 'manager') {
            itemValue = item.manager?.username;
          } else if (key === 'department') {
            itemValue = item.department?.name;
          } else if (key === 'user') {
            itemValue = item.user?.username;
          } else if (key === 'supervisor') {
            itemValue = item.supervisor ? `${item.supervisor.first_name} ${item.supervisor.last_name}` : null;
          }
          
          return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filters, searchableColumns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Calculate pagination info
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filteredData.length);

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Helper function to extract text from rendered values
  const getDisplayValue = (column: Column, row: any): string => {
    const value = row[column.key];
    if (column.render) {
      // For rendered values, try to extract meaningful text
      if (column.key === 'company') {
        return row.company?.name || '-';
      }
      if (column.key === 'manager') {
        return row.manager?.username || '-';
      }
      if (column.key === 'department') {
        return row.department?.name || '-';
      }
      if (column.key === 'created_at') {
        try {
          return new Date(String(value)).toLocaleDateString();
        } catch {
          return String(value || '');
        }
      }
      // For other rendered values, return the original value
      return String(value || '');
    }
    return String(value || '');
  };

  // Export functionality
  const exportToCSV = () => {
    const exportableColumns = columns.filter(col => col.exportable !== false);
    const headers = exportableColumns.map(col => col.label);
    
    const csvData = filteredData.map(row => {
      return exportableColumns.map(col => {
        const displayValue = getDisplayValue(col, row);
        return `"${displayValue}"`;
      }).join(',');
    });

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            onClick={onAdd}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            {addButtonText}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Global Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Individual Column Filters */}
          {filterableColumns.map(column => (
            <div key={column.key}>
              <Input
                placeholder={`Filter ${column.label}...`}
                value={filters[column.key] || ""}
                onChange={(e) => handleFilterChange(column.key, e.target.value)}
              />
            </div>
          ))}

          {/* Page Size Selector */}
          <div>
            <Select
              value={pageSize.toString()}
              onChange={(value) => handlePageSizeChange(String(value))}
              options={[
                { value: "5", label: "5 per page" },
                { value: "10", label: "10 per page" },
                { value: "20", label: "20 per page" },
                { value: "50", label: "50 per page" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {startItem}-{endItem} of {filteredData.length} results
          {searchTerm && ` (filtered from ${safeData.length} total)`}
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Table */}
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
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <td
                      colSpan={columns.length + 1}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {searchTerm || Object.values(filters).some(f => f) 
                        ? "No results match your search criteria" 
                        : "No data available"}
                    </td>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              First
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  variant={currentPage === pageNum ? "primary" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
            <Button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedCustomTable; 