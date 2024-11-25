import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import CallbackModal from '../components/dashboard/CallbackModal';
import OnboardingModal from '../components/OnboardingModal';
import IntercomChat from '../components/IntercomChat';
import { useOnboarding } from '../context/OnboardingContext';
import { supabase } from '../lib/supabase';

export default function UserDashboard() {
  const { user } = useAuth();
  const { isOnboardingComplete } = useOnboarding();
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('total');
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  // Initialize onboarding state
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || user.is_admin) {
        setShowOnboarding(false);
        return;
      }

      try {
        // Get fresh user data from the database
        const { data: userData, error } = await supabase
          .from('users')
          .select('onboarding_complete')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        // Show onboarding if onboarding_complete is false or null
        const shouldShow = !userData.onboarding_complete;
        console.log('Should show onboarding:', shouldShow, 'User data:', userData);
        setShowOnboarding(shouldShow);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const handleOnboardingComplete = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          onboarding_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating onboarding status:', error);
        return;
      }

      setShowOnboarding(false);
    } catch (error) {
      console.error('Error in handleOnboardingComplete:', error);
    }
  }, [user]);

  // Only render the dashboard when we know the onboarding state
  if (showOnboarding === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DashboardLayout>
        <div className={`p-8 ${showOnboarding ? 'opacity-30' : ''}`}>
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Willkommen im Kundenportal, {user?.first_name}
            </h1>
          </div>

          {/* Timeframe Selection */}
          <div className="mb-8 flex space-x-2">
            <button
              onClick={() => setSelectedTimeframe('total')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === 'total'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Gesamt
            </button>
            <button
              onClick={() => setSelectedTimeframe('daily')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === 'daily'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Täglich
            </button>
            <button
              onClick={() => setSelectedTimeframe('weekly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === 'weekly'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Woche
            </button>
            <button
              onClick={() => setSelectedTimeframe('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === 'monthly'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Monat
            </button>
          </div>

          <PerformanceMetrics timeframe={selectedTimeframe} />
        </div>
      </DashboardLayout>

      {/* Show onboarding modal for non-admin users who haven't completed onboarding */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <OnboardingModal onComplete={handleOnboardingComplete} />
        </div>
      )}

      {/* Modals */}
      {isCallbackModalOpen && (
        <CallbackModal onClose={() => setIsCallbackModalOpen(false)} />
      )}

      {/* Intercom Chat */}
      <IntercomChat />
    </>
  );
}