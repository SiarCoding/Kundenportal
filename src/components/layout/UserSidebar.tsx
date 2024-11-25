import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Book,
  Headphones,
  Settings,
  Users,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminService } from '../../services/admin.service';

export default function UserSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [settings, setSettings] = useState({
    logo_url: null,
    company_name: 'Kundenportal'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const adminSettings = await AdminService.getSettings();
      setSettings({
        logo_url: adminSettings.logo_url,
        company_name: adminSettings.company_name
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-[#25262b] border-r border-gray-700 flex flex-col h-screen fixed">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {settings.logo_url ? (
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
            <h1 className="text-xl font-bold text-gray-100">{settings.company_name}</h1>
            <p className="text-sm text-gray-400">Kundenbereich</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {[
            { path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
            { path: '/tutorials', icon: <Book className="h-5 w-5" />, label: 'Tutorials' },
            { path: '/support', icon: <Headphones className="h-5 w-5" />, label: 'Support' },
            { path: '/profile', icon: <Settings className="h-5 w-5" />, label: 'Einstellungen' },
            { path: '/partner', icon: <Users className="h-5 w-5" />, label: 'Partnerprogramm' }
          ].map((item) => (
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
          className="flex items-center px-4 py-2 text-gray-400 hover:text-gray-300 w-full transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Abmelden</span>
        </button>
      </div>
    </div>
  );
}