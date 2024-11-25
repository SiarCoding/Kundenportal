import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OnboardingModal from '../components/OnboardingModal';

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user has completed onboarding, redirect to dashboard
  React.useEffect(() => {
    if (user?.onboarding_complete) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleOnboardingComplete = () => {
    navigate('/dashboard', { replace: true });
  };

  if (!user || user.onboarding_complete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center">
      <OnboardingModal onComplete={handleOnboardingComplete} />
    </div>
  );
}