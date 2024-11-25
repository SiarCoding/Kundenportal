import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Activity, User as UserIcon, Video, FileText } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
}

interface UserWithProgress {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  onboarding_complete: boolean;
  last_activity: string;
  completed_tutorials: string[];
  activities: UserActivity[];
}

export default function UserTracking() {
  const [users, setUsers] = useState<UserWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('is_admin', false);

      if (usersError) throw usersError;

      const usersWithActivity = await Promise.all(
        usersData.map(async (user) => {
          const { data: activities } = await supabase
            .from('user_activity')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          return {
            ...user,
            activities: activities || []
          };
        })
      );

      setUsers(usersWithActivity);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tutorial_completed':
        return <Video className="h-5 w-5 text-green-400" />;
      case 'onboarding_step':
        return <Activity className="h-5 w-5 text-blue-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Benutzer-Tracking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <div className="bg-[#25262b] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Benutzer</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className={`w-full p-4 rounded-lg flex items-center space-x-4 transition-colors ${
                    selectedUser === user.id
                      ? 'bg-yellow-400/10 border border-yellow-400/20'
                      : 'bg-[#1a1b1e] hover:bg-[#2c2d31]'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <UserIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-medium text-gray-100">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    new Date(user.last_activity).getTime() > Date.now() - 1000 * 60 * 5
                      ? 'bg-green-400'
                      : 'bg-gray-600'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="bg-[#25262b] rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-100 mb-6">
                  Aktivitäten
                </h2>
                <div className="space-y-4">
                  {users
                    .find((u) => u.id === selectedUser)
                    ?.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 bg-[#1a1b1e] rounded-lg"
                      >
                        {getActivityIcon(activity.activity_type)}
                        <div className="flex-1">
                          <p className="text-sm text-gray-100">
                            {activity.activity_data.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.created_at).toLocaleString('de-DE')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#25262b] rounded-xl p-6 flex items-center justify-center text-gray-400">
                Wählen Sie einen Benutzer aus, um dessen Aktivitäten zu sehen
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}