import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, Video, Activity, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  pendingApprovals: number;
  activeUsers: number;
  completedOnboarding: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    completedOnboarding: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_admin', false);

      if (error) throw error;

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      setStats({
        totalUsers: users.length,
        pendingApprovals: users.filter(u => !u.is_approved).length,
        activeUsers: users.filter(u => u.last_login && new Date(u.last_login) > oneDayAgo).length,
        completedOnboarding: users.filter(u => u.onboarding_complete).length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Approvals */}
          <Link
            to="/admin/approvals"
            className="bg-[#25262b] rounded-xl p-6 hover:bg-[#2c2d31] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ausstehende Freigaben</p>
                <h3 className="text-2xl font-bold text-gray-100 mt-1">
                  {stats.pendingApprovals}
                </h3>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </Link>

          {/* Total Users */}
          <div className="bg-[#25262b] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Gesamte Kunden</p>
                <h3 className="text-2xl font-bold text-gray-100 mt-1">
                  {stats.totalUsers}
                </h3>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-[#25262b] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Aktive Kunden (24h)</p>
                <h3 className="text-2xl font-bold text-gray-100 mt-1">
                  {stats.activeUsers}
                </h3>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </div>

          {/* Completed Onboarding */}
          <div className="bg-[#25262b] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Onboarding abgeschlossen</p>
                <h3 className="text-2xl font-bold text-gray-100 mt-1">
                  {stats.completedOnboarding}
                </h3>
              </div>
              <Video className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {stats.pendingApprovals > 0 && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="text-yellow-400">
                  Es gibt {stats.pendingApprovals} ausstehende Benutzeranfragen
                </p>
              </div>
              <Link
                to="/admin/approvals"
                className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Jetzt prüfen
              </Link>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}