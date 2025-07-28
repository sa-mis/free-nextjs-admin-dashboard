"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Or a redirect, handled by useEffect
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h1>
      <p>You are logged in as {user.email}.</p>
      {/* Add more dashboard content here */}
    </div>
  );
};

export default DashboardPage;
