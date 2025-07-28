import React from 'react';

const PermissionDenied: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-6xl text-red-500 mb-4">⛔</div>
    <h2 className="text-2xl font-bold mb-2">Permission Denied</h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      You do not have permission to access this page.<br />
      Please contact your administrator if you believe this is a mistake.
    </p>
  </div>
);

export default PermissionDenied; 