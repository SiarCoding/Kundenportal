import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function DashboardLayout({ children, showNavbar = true }: DashboardLayoutProps) {
  const { user } = useAuth();
  const isAdmin = user?.is_admin;

  return (
    <div className="flex min-h-screen bg-[#1a1b1e]">
      {isAdmin ? <AdminSidebar /> : <UserSidebar />}
      <div className="flex-1 ml-64">
        {showNavbar && <Navbar onCallbackClick={() => {}} />}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}