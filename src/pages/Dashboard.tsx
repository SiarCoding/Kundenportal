import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, User, ChevronRight, CheckCircle, XCircle, Search } from 'lucide-react';

export default function Dashboard() {
  const { user, pendingUsers, approveUser, rejectUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleApprove = async (userId: string, userName: string) => {
    try {
      await approveUser(userId);
      setNotification({
        type: 'success',
        message: `${userName} wurde erfolgreich freigegeben.`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Fehler bei der Freigabe. Bitte versuchen Sie es erneut.'
      });
    }
  };

  const handleReject = async (userId: string, userName: string) => {
    try {
      await rejectUser(userId);
      setNotification({
        type: 'success',
        message: `${userName} wurde abgelehnt.`
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Fehler bei der Ablehnung. Bitte versuchen Sie es erneut.'
      });
    }
  };

  const filteredUsers = pendingUsers.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a1b1e]">
      {/* Header */}
      <div className="bg-[#25262b] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-yellow-400" />
              <span className="text-xl font-semibold text-gray-100">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/admin/approvals')}
                className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-yellow-400"
              >
                <User className="h-5 w-5 mr-2" />
                Benutzerfreigabe
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-gray-100"
              >
                <Settings className="h-5 w-5 mr-2" />
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Benutzerfreigabe</h1>
              <p className="text-sm text-gray-400">
                Verwalten Sie Benutzeranfragen und Freigaben
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Benutzer suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-[#25262b] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            <p className={`text-sm ${
              notification.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {notification.message}
            </p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-[#25262b] rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Benutzer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Registrierungsdatum
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                    Keine ausstehenden Benutzeranfragen
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString('de-DE')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleApprove(user.id, `${user.first_name} ${user.last_name}`)}
                        className="text-green-400 hover:text-green-300 mx-2"
                        title="Freigeben"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReject(user.id, `${user.first_name} ${user.last_name}`)}
                        className="text-red-400 hover:text-red-300 mx-2"
                        title="Ablehnen"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}