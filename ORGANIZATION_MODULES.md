# Organization Management Modules

This document describes the Organization management modules implemented for the SA Smart Service application.

## Overview

The Organization management system consists of four main entities with hierarchical relationships:

1. **Companies** - Top-level organizational units
2. **Departments** - Belong to companies
3. **Divisions** - Belong to departments
4. **Employees** - Belong to users and can have supervisors

## Features Implemented

### CRUD Operations
- ✅ Create, Read, Update, Delete for all entities
- ✅ Form validation with error handling
- ✅ Modal-based forms for better UX
- ✅ Confirmation dialogs for delete operations

### Relationship Management
- ✅ Companies → Departments (one-to-many)
- ✅ Departments → Divisions (one-to-many)
- ✅ Users → Employees (one-to-one)
- ✅ Employees → Supervisors (self-referencing)

### UI Components
- ✅ Reusable table component with sorting and filtering
- ✅ Modal forms with validation
- ✅ Responsive design with dark mode support
- ✅ Loading states and error handling

### Navigation
- ✅ Organization menu in sidebar
- ✅ Sub-menu items for each entity
- ✅ Proper routing structure

## File Structure

```
src/
├── app/(admin)/
│   ├── companies/
│   │   └── page.tsx
│   ├── departments/
│   │   └── page.tsx
│   ├── divisions/
│   │   └── page.tsx
│   └── employees/
│       └── page.tsx
├── components/
│   └── organization/
│       ├── OrganizationTable.tsx
│       ├── OrganizationFormModal.tsx
│       └── index.ts
├── services/
│   └── organization.ts
└── icons/
    ├── building.svg
    ├── briefcase.svg
    ├── layers.svg
    └── users.svg
```

## Database Schema

The implementation follows the database schema with these key tables:

- `companies` - Company information
- `departments` - Department information with company relationship
- `divisions` - Division information with department relationship
- `employees` - Employee information with user and supervisor relationships
- `users` - User accounts for authentication

## API Endpoints

The service layer provides these endpoints:

### Companies
- `GET /companies` - Get all companies
- `GET /companies/:id` - Get company by ID
- `POST /companies` - Create new company
- `PUT /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company

### Departments
- `GET /departments` - Get all departments
- `GET /companies/:id/departments` - Get departments by company
- `POST /departments` - Create new department
- `PUT /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

### Divisions
- `GET /divisions` - Get all divisions
- `GET /departments/:id/divisions` - Get divisions by department
- `POST /divisions` - Create new division
- `PUT /divisions/:id` - Update division
- `DELETE /divisions/:id` - Delete division

### Employees
- `GET /employees` - Get all employees
- `GET /divisions/:id/employees` - Get employees by division
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

## Usage

### Adding a New Company
1. Navigate to Organization → Companies
2. Click "Add Company"
3. Fill in the required fields (Code, Name, Phone, Email, Address)
4. Click "Save"

### Adding a Department
1. Navigate to Organization → Departments
2. Click "Add Department"
3. Select a Company from the dropdown
4. Fill in the required fields (Code, Name)
5. Optionally select a Manager
6. Click "Save"

### Adding a Division
1. Navigate to Organization → Divisions
2. Click "Add Division"
3. Select a Department from the dropdown
4. Fill in the required fields (Code, Name)
5. Optionally select a Manager
6. Set the Status (Active/Inactive)
7. Click "Save"

### Adding an Employee
1. Navigate to Organization → Employees
2. Click "Add Employee"
3. Select a User from the dropdown
4. Fill in the required fields (Code, First Name, Last Name, Position, Phone, Hire Date)
5. Optionally set Termination Date and Supervisor
6. Set the Status (Active/Inactive)
7. Click "Save"

## Form Validation

All forms include client-side validation:
- Required fields are marked with asterisks (*)
- Email fields validate email format
- Date fields validate date format
- Error messages are displayed below invalid fields

## Future Enhancements

Potential improvements for future versions:
- Bulk import/export functionality
- Advanced filtering and search
- Organization chart visualization
- Audit trail for changes
- Role-based access control
- Integration with HR systems 