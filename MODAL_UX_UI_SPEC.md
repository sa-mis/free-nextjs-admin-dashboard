# Modal UX/UI Specification

## Overview
This document defines the standardized modal UX/UI pattern for the SA Smart Service application. All modals should follow this specification to ensure consistency across the application.

## Modal Component Structure

### Base Modal Component (`@/components/ui/modal/index.tsx`)

#### Props Interface
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // Default: true
  isFullscreen?: boolean; // Default: false
  title?: string; // Optional title prop for consistent header styling
}
```

#### Styling Specifications

**Container:**
- Fixed positioning with full viewport coverage
- Centered content with flexbox
- Z-index: 50
- Padding: 1rem (16px) on all sides
- Backdrop: `bg-black/50` with `backdrop-blur-sm`

**Modal Content:**
- Max width: 4xl (896px)
- Background: `bg-white dark:bg-gray-900`
- Border radius: `rounded-lg`
- Shadow: `shadow-xl`
- Overflow: `max-h-[90vh] overflow-y-auto`

**Close Button:**
- Position: `absolute right-4 top-4`
- Size: `h-8 w-8`
- Background: `bg-gray-100 dark:bg-gray-800`
- Icon color: `text-gray-400 dark:text-gray-400`
- Hover: `hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white`
- Icon size: 20x20px

## Modal Content Pattern

### Standard Modal Structure
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <div className="p-6 max-h-[90vh] overflow-y-auto">
    {/* Header */}
    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
      {isEdit ? 'Edit [Entity]' : 'Add New [Entity]'}
    </h2>
    
    {/* Error Messages */}
    {error && (
      <div className="text-red-500 mb-4">{error}</div>
    )}
    
    {/* Form Content */}
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
    </form>
    
    {/* Action Buttons */}
    <div className="flex justify-end space-x-3 pt-6">
      <Button variant="outline" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button disabled={loading}>
        {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
      </Button>
    </div>
  </div>
</Modal>
```

### Form Field Layout Patterns

#### Two-Column Grid (Recommended for most forms)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="field1">Field 1</Label>
    <InputField id="field1" {...props} />
  </div>
  <div>
    <Label htmlFor="field2">Field 2</Label>
    <InputField id="field2" {...props} />
  </div>
</div>
```

#### Three-Column Grid (For compact forms)
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <Label htmlFor="field1">Field 1</Label>
    <InputField id="field1" {...props} />
  </div>
  <div>
    <Label htmlFor="field2">Field 2</Label>
    <InputField id="field2" {...props} />
  </div>
  <div>
    <Label htmlFor="field3">Field 3</Label>
    <InputField id="field3" {...props} />
  </div>
</div>
```

#### Full-Width Fields
```tsx
<div>
  <Label htmlFor="description">Description</Label>
  <textarea
    id="description"
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
    rows={3}
    placeholder="Enter description"
  />
</div>
```

## Dark Mode Support

### Color Classes
- **Background:** `bg-white dark:bg-gray-900`
- **Text:** `text-gray-900 dark:text-white`
- **Borders:** `border-gray-300 dark:border-gray-600`
- **Input Background:** `bg-white dark:bg-gray-700`
- **Error Text:** `text-red-500 dark:text-red-400`
- **Success Text:** `text-green-500 dark:text-green-400`

### Form Elements
- **Input Fields:** Use `InputField` component with built-in dark mode support
- **Select Dropdowns:** Include dark mode classes in custom styling
- **Textareas:** Apply dark mode classes manually
- **Buttons:** Use `Button` component with built-in dark mode support

## Accessibility Features

### Keyboard Navigation
- **Escape Key:** Closes modal
- **Tab Navigation:** Proper focus management
- **Enter Key:** Submits form when focused on submit button

### ARIA Attributes
- **Close Button:** `aria-label="Close modal"`
- **Modal Role:** Implicitly handled by semantic HTML
- **Focus Management:** Focus trapped within modal when open

## Loading States

### Button Loading States
```tsx
<Button disabled={loading}>
  {loading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      Saving...
    </>
  ) : (
    'Save'
  )}
</Button>
```

### Form Loading States
- Disable all form inputs when `loading={true}`
- Show loading spinner in submit button
- Prevent multiple submissions

## Error Handling

### Error Display Pattern
```tsx
{error && (
  <div className="text-red-500 mb-4">
    {error}
  </div>
)}
```

### Field-Level Errors
```tsx
<InputField
  id="name"
  error={!!errors.name?.message}
  {...register('name', { required: 'Name is required' })}
/>
{errors.name?.message && (
  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
    {errors.name.message}
  </p>
)}
```

## Responsive Design

### Mobile-First Approach
- **Small screens (< 768px):** Single column layout
- **Medium screens (≥ 768px):** Two-column grid
- **Large screens (≥ 1024px):** Maintain two-column with more spacing

### Modal Sizing
- **Max width:** 4xl (896px) on desktop
- **Full width:** On mobile with padding
- **Max height:** 90vh to prevent overflow

## Animation and Transitions

### Backdrop Animation
- Subtle backdrop blur effect
- Smooth opacity transition

### Modal Animation
- Scale and fade in from center
- Smooth exit animation

## Implementation Checklist

### Required Elements
- [ ] Modal component with consistent styling
- [ ] Dark mode support for all elements
- [ ] Proper form structure with labels
- [ ] Error handling and display
- [ ] Loading states
- [ ] Responsive design
- [ ] Accessibility features
- [ ] Keyboard navigation support

### Optional Elements
- [ ] Custom close button styling
- [ ] Fullscreen modal option
- [ ] Custom backdrop styling
- [ ] Animation preferences

## Examples

### Basic Form Modal
```tsx
export function ExampleFormModal({ isOpen, onClose, onSubmit, data }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {data ? 'Edit Example' : 'Add New Example'}
        </h2>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
        </form>
        
        <div className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button disabled={loading}>
            {loading ? 'Saving...' : (data ? 'Update' : 'Create')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

## Migration Guide

### Updating Existing Modals
1. Replace custom modal containers with `<Modal>` component
2. Update header styling to use consistent pattern
3. Add dark mode classes to all form elements
4. Implement proper error handling
5. Add loading states to buttons
6. Test keyboard navigation and accessibility

### Common Issues
- **Type conflicts:** Use `min={undefined}` and `max={undefined}` for InputField components
- **Form integration:** Use `setValue` for Switch components instead of register
- **Button types:** Remove `type` prop from Button components
- **Error display:** Convert error messages to boolean for InputField error prop

This specification ensures consistent, accessible, and user-friendly modals throughout the application. 