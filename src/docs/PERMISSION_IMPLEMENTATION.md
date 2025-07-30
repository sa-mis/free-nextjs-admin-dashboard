# Permission Implementation Guide

## Overview

This guide explains how to implement permission-based access control on pages in the SA Smart Service application.

## How It Works

### 1. Backend Permission System
- Permissions are defined in the database with names like `accessory.view`, `asset.create`, etc.
- The `checkPermission` middleware validates user permissions on API endpoints
- Users are assigned roles, and roles have permissions

### 2. Frontend Permission System
- The `usePageAuth` hook checks user permissions on the frontend
- The `PermissionDenied` component displays when access is denied
- Permissions are loaded from the user's profile

## Implementation Steps

### Step 1: Import Required Components

```typescript
import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';
```

### Step 2: Add Permission Check

```typescript
export default function YourPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('your.permission');
  
  // Your existing state and logic here...
  
  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied permission="your.permission" pageName="Your Page Name" />;
  
  return (
    // Your page content
  );
}
```

## Available Permissions

### Accessory Module
- `accessory.view` - View accessories
- `accessory.create` - Create accessories
- `accessory.update` - Update accessories
- `accessory.delete` - Delete accessories
- `accessory.assign` - Assign accessories
- `accessory.unassign` - Unassign accessories
- `accessory.stock_movement` - Manage stock movements
- `accessory.dashboard` - Access dashboard

### Asset Module
- `asset.view` - View assets
- `asset.create` - Create assets
- `asset.update` - Update assets
- `asset.delete` - Delete assets
- `asset.assign` - Assign assets
- `asset.transfer` - Transfer assets
- `asset.status` - Update asset status
- `asset.condition` - Update asset condition
- `asset.location` - Update asset location
- `asset.history` - View asset history
- `asset.dashboard` - Access dashboard

### User Management
- `user.view` - View users
- `user.create` - Create users
- `user.edit` - Edit users
- `user.delete` - Delete users
- `user.assign_role` - Assign roles to users

### Role Management
- `role.view` - View roles
- `role.create` - Create roles
- `role.edit` - Edit roles
- `role.delete` - Delete roles
- `role.assign_permissions` - Assign permissions to roles

### Permission Management
- `permission.view` - View permissions
- `permission.create` - Create permissions
- `permission.edit` - Edit permissions
- `permission.delete` - Delete permissions

### Service Request Module
- `service_request.view` - View service requests
- `service_request.create` - Create service requests
- `service_request.update` - Update service requests
- `service_request.delete` - Delete service requests
- `service_request.assign` - Assign service requests
- `service_request.status_change` - Change status
- `service_request.comment` - Add comments
- `service_request.attachment` - Manage attachments
- `service_request.generate_work_order` - Generate work orders
- `service_request.dashboard` - Access dashboard

### Organization Modules
- `company.view` - View companies
- `company.create` - Create companies
- `company.update` - Update companies
- `company.delete` - Delete companies

- `department.view` - View departments
- `department.create` - Create departments
- `department.update` - Update departments
- `department.delete` - Delete departments

- `division.view` - View divisions
- `division.create` - Create divisions
- `division.update` - Update divisions
- `division.delete` - Delete divisions

- `employee.view` - View employees
- `employee.create` - Create employees
- `employee.update` - Update employees
- `employee.delete` - Delete employees

### Other Modules
- `brand.view`, `brand.create`, `brand.update`, `brand.delete`
- `model.view`, `model.create`, `model.update`, `model.delete`
- `vendor.view`, `vendor.create`, `vendor.update`, `vendor.delete`
- `category.view`, `category.create`, `category.update`, `category.delete`
- `license.view`, `license.create`, `license.update`, `license.delete`, `license.assign`, `license.unassign`
- `consumable.view`, `consumable.create`, `consumable.update`, `consumable.delete`, `consumable.assign`, `consumable.use`, `consumable.stock_movement`
- `tool.view`, `tool.create`, `tool.update`, `tool.delete`
- `work_order.view`, `work_order.create`, `work_order.update`, `work_order.delete`
- `pm_schedule.view`, `pm_schedule.create`, `pm_schedule.update`, `pm_schedule.delete`

## Examples

### Basic Page Implementation

```typescript
'use client'

import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

export default function AccessoriesPage() {
  const { loading: authLoading, hasPermission } = usePageAuth('accessory.view');
  
  if (authLoading) return <div>Loading...</div>;
  if (!hasPermission) return <PermissionDenied permission="accessory.view" pageName="Accessories" />;
  
  return (
    <div>
      {/* Your page content */}
    </div>
  );
}
```

### Advanced Page with Multiple Permissions

```typescript
'use client'

import { usePageAuth } from '@/hooks/usePageAuth';
import PermissionDenied from '@/components/common/PermissionDenied';

export default function AssetsPage() {
  const { loading: authLoading, hasPermission: canView } = usePageAuth('asset.view');
  const { hasPermission: canCreate } = usePageAuth('asset.create');
  const { hasPermission: canEdit } = usePageAuth('asset.update');
  const { hasPermission: canDelete } = usePageAuth('asset.delete');
  
  if (authLoading) return <div>Loading...</div>;
  if (!canView) return <PermissionDenied permission="asset.view" pageName="Assets" />;
  
  return (
    <div>
      {/* Show create button only if user has permission */}
      {canCreate && (
        <button onClick={handleCreate}>Add Asset</button>
      )}
      
      {/* Show edit/delete buttons only if user has permissions */}
      {canEdit && <button onClick={handleEdit}>Edit</button>}
      {canDelete && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
}
```

## Testing Permissions

### 1. Remove Permission from Role
1. Go to Roles page
2. Edit a role
3. Remove the permission you want to test
4. Save the role

### 2. Test the Page
1. Log in as a user with that role
2. Navigate to the page
3. You should see the `PermissionDenied` component

### 3. Verify Backend Protection
1. Try to access the API endpoint directly
2. You should get a 403 Forbidden response

## Troubleshooting

### Permission Not Working
1. Check if the permission exists in the database
2. Verify the user's role has the permission assigned
3. Check the browser console for any errors
4. Verify the permission name matches exactly

### PermissionDenied Not Showing
1. Make sure you're using the `usePageAuth` hook
2. Check if the permission check is placed before the return statement
3. Verify the permission name is correct

### Backend API Errors
1. Check if the middleware is properly applied to the route
2. Verify the permission name in the middleware matches the database
3. Check the server logs for any errors

## Best Practices

1. **Always check permissions on both frontend and backend**
2. **Use descriptive permission names**
3. **Group related permissions together**
4. **Test permission changes thoroughly**
5. **Provide clear error messages to users**
6. **Log permission failures for security monitoring**

## Security Notes

- Frontend permission checks are for UX only
- Backend permission checks are for security
- Never rely solely on frontend permission checks
- Always validate permissions on the server side
- Log all permission failures for audit purposes 