import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
} 