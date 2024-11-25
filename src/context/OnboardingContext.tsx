import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface OnboardingContextType {
  onboarding: {
    steps: OnboardingStep[];
  };
  completeStep: (stepIndex: number) => void;
  updateFieldValue: (stepIndex: number, fieldIndex: number, value: string) => void;
  isOnboardingComplete: () => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [onboarding, setOnboarding] = useState({
    steps: [
      {
        title: 'Willkommen',
        description: 'Erste Schritte im Portal',
        type: 'welcome',
        completed: false
      },
      {
        title: 'Unternehmensdaten',
        description: 'Vervollständigen Sie Ihre Firmendaten',
        type: 'profile',
        completed: false,
        fields: [
          {
            label: 'Firmenname',
            type: 'text',
            value: '',
            required: true
          },
          {
            label: 'Branche',
            type: 'text',
            value: '',
            required: true
          }
        ]
      },
      {
        title: 'Einführungsvideo',
        description: 'Lernen Sie die wichtigsten Funktionen kennen',
        type: 'video',
        videoUrl: 'https://example.com/intro.mp4',
        completed: false
      }
    ]
  });

  const completeStep = useCallback(async (stepIndex: number) => {
    if (!user) return;

    setOnboarding(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) =>
        index === stepIndex ? { ...step, completed: true } : step
      )
    }));

    // Track step completion
    await supabase.rpc('track_user_activity', {
      p_user_id: user.id,
      p_activity_type: 'onboarding_step_completed',
      p_activity_data: {
        step_index: stepIndex,
        step_title: onboarding.steps[stepIndex].title,
        completed_at: new Date().toISOString()
      }
    });
  }, [user, onboarding.steps]);

  const updateFieldValue = useCallback((stepIndex: number, fieldIndex: number, value: string) => {
    setOnboarding(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => {
        if (index === stepIndex && step.type === 'profile' && step.fields) {
          const updatedFields = step.fields.map((field, fIndex) =>
            fIndex === fieldIndex ? { ...field, value } : field
          );
          return {
            ...step,
            fields: updatedFields,
            completed: updatedFields.every(field => !field.required || field.value.trim() !== '')
          };
        }
        return step;
      })
    }));
  }, []);

  const isOnboardingComplete = useCallback(() => {
    return onboarding.steps.every(step => step.completed);
  }, [onboarding.steps]);

  return (
    <OnboardingContext.Provider value={{
      onboarding,
      completeStep,
      updateFieldValue,
      isOnboardingComplete
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}