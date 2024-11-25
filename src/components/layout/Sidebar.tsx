import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  Book, 
  Headphones, 
  Settings, 
  Users, 
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminService, AdminSettings } from '../../services/admin.service';

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [settings, setSettings] = useState<AdminSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const adminSettings = await AdminService.getSettings();
      setSettings(adminSettings);
    } catch (error) {
      console.error('Error loading admin settings:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-[#25262b] border-r border-gray-700 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Company Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <User className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">
              {settings?.company_name || 'Kundenportal'}
            </h1>
            <p className="text-sm text-gray-400">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 rounded-lg ${
                isActive('/dashboard')
                  ? 'bg-yellow-400/10 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/tutorials"
              className={`flex items-center px-4 py-3 rounded-lg ${
                isActive('/tutorials')
                  ? 'bg-yellow-400/10 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <Book className="h-5 w-5 mr-3" />
              <span>Tutorials</span>
            </Link>
          </li>
          <li>
            <Link
              to="/support"
              className={`flex items-center px-4 py-3 rounded-lg ${
                isActive('/support')
                  ? 'bg-yellow-400/10 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <Headphones className="h-5 w-5 mr-3" />
              <span>Support</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex items-center px-4 py-3 rounded-lg ${
                isActive('/settings')
                  ? 'bg-yellow-400/10 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Einstellungen</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => logout()}
          className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-300 w-full"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Abmelden</span>
        </button>
      </div>
    </div>
  );
}