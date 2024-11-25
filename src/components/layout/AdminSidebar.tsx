import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Video,
  Activity,
  Settings,
  LogOut,
  FileText,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard'
    },
    {
      path: '/admin/approvals',
      icon: <Users className="h-5 w-5" />,
      label: 'Benutzerfreigabe'
    },
    {
      path: '/admin/content',
      icon: <FileText className="h-5 w-5" />,
      label: 'Content'
    },
    {
      path: '/admin/tutorials',
      icon: <Video className="h-5 w-5" />,
      label: 'Tutorials'
    },
    {
      path: '/admin/tracking',
      icon: <Activity className="h-5 w-5" />,
      label: 'Benutzer-Tracking'
    },
    {
      path: '/admin/callbacks',
      icon: <PhoneCall className="h-5 w-5" />,
      label: 'Rückrufe'
    },
    {
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Einstellungen'
    }
  ];

  return (
    <div className="w-64 bg-[#25262b] border-r border-gray-700 flex flex-col h-screen fixed">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
            <Users className="h-6 w-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Admin Portal</h1>
            <p className="text-sm text-gray-400">Verwaltung</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-yellow-400/10 text-yellow-400'
                    : 'text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
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