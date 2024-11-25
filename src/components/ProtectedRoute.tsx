import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireUser?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireUser = false
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin routes
  if (requireAdmin) {
    if (!user.is_admin) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // User routes
  if (requireUser) {
    if (user.is_admin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    
    // If not approved, redirect to registration success page
    if (!user.is_approved) {
      return <Navigate to="/registration-success" replace />;
    }
  }

  return <>{children}</>;
}