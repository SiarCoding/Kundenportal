import React from 'react';
import { Bell, Phone, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onCallbackClick: () => void;
  isAdmin?: boolean;
}

export default function Navbar({ onCallbackClick, isAdmin = false }: NavbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#25262b] border-b border-gray-700 flex items-center justify-between px-8">
      {!isAdmin && (
        <button
          onClick={onCallbackClick}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg flex items-center space-x-2 hover:bg-yellow-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Phone className="h-5 w-5" />
          <span>Rückruf vereinbaren</span>
        </button>
      )}

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-100">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <button className="relative text-gray-400 hover:text-gray-300 transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}