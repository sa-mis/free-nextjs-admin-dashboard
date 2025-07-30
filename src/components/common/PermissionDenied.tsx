import React from 'react';

interface PermissionDeniedProps {
  permission?: string;
  pageName?: string;
}

const PermissionDenied: React.FC<PermissionDeniedProps> = ({ permission, pageName }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-6xl text-red-500 mb-4">⛔</div>
    <h2 className="text-2xl font-bold mb-2">Permission Denied</h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      You do not have permission to access this page.
      {permission && (
        <span className="block mt-2 text-sm text-gray-500">
          Required permission: <code className="bg-gray-100 px-2 py-1 rounded">{permission}</code>
        </span>
      )}
      {pageName && (
        <span className="block mt-1 text-sm text-gray-500">
          Page: {pageName}
        </span>
      )}
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      Please contact your administrator if you believe this is a mistake.
    </p>
    <div className="flex gap-4">
      <button 
        onClick={() => window.history.back()} 
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Go Back
      </button>
      <button 
        onClick={() => window.location.href = '/dashboard'} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

export default PermissionDenied; 