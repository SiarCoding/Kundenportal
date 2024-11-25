import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#25262b] border-b border-gray-700 flex items-center justify-between px-8">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-100">Admin Portal</h1>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative text-gray-400 hover:text-gray-300">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        <button className="text-gray-400 hover:text-gray-300">
          <Settings className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-3">
          <div>
            <p className="text-sm font-medium text-gray-100">{user?.email}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
            <User className="h-6 w-6 text-black" />
          </div>
        </div>
      </div>
    </header>
  );
}