import React, { useState, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';
import { useAuth } from '../context/AuthContext';
import ReactPlayer from 'react-player';
import { supabase } from '../lib/supabase';

interface OnboardingField {
  label: string;
  type: string;
  required: boolean;
}

interface OnboardingStep {
  type: string;
  title: string;
  description: string;
  fields?: OnboardingField[];
  videoUrl?: string;
}

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { onboarding, completeStep, updateFieldValue, isOnboardingComplete } = useOnboarding();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const steps: OnboardingStep[] = onboarding.steps;
  const currentStepData = steps[currentStep];

  const handleStepComplete = useCallback(async () => {
    if (!currentStepData) return;

    // Mark current step as complete
    completeStep(currentStep);

    if (currentStep < steps.length - 1) {
      // Move to next step
      setCurrentStep(currentStep + 1);
    } else {
      try {
        if (user) {
          // Update user's onboarding status and form data
          const { error } = await supabase
            .from('users')
            .update({ 
              onboarding_complete: true,
              updated_at: new Date().toISOString(),
              company_name: formData.company_name,
              industry: formData.industry
            })
            .eq('id', user.id);

          if (error) throw error;

          // Track completion
          await supabase.rpc('track_user_activity', {
            p_user_id: user.id,
            p_activity_type: 'onboarding_completed',
            p_activity_data: {
              completed_at: new Date().toISOString(),
              form_data: formData
            }
          });

          onComplete();
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
  }, [currentStep, steps.length, user, completeStep, onComplete, formData, currentStepData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    if (!currentStepData) return null;

    switch (currentStepData.type) {
      case 'welcome':
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">{currentStepData.title}</h2>
            <p className="text-gray-300 mb-6">{currentStepData.description}</p>
            <button
              onClick={handleStepComplete}
              className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Los geht's
            </button>
          </div>
        );

      case 'profile':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">{currentStepData.title}</h2>
            <p className="text-gray-300 mb-6">{currentStepData.description}</p>
            <div className="space-y-4">
              {currentStepData.fields?.map((field: OnboardingField, index: number) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.label.toLowerCase()] || ''}
                    onChange={(e) => handleInputChange(field.label.toLowerCase(), e.target.value)}
                    required={field.required}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
              ))}
              <button
                onClick={handleStepComplete}
                className="mt-6 px-6 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              >
                Weiter
              </button>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">{currentStepData.title}</h2>
            <p className="text-gray-300 mb-6">{currentStepData.description}</p>
            <div className="relative aspect-video mb-6">
              <ReactPlayer
                url={currentStepData.videoUrl}
                width="100%"
                height="100%"
                playing={videoPlaying}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                controls
              />
            </div>
            <button
              onClick={handleStepComplete}
              className="px-6 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Weiter
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl bg-[#25262b] rounded-2xl shadow-2xl overflow-hidden">
      {/* Progress indicator */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index > 0 ? 'ml-4' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-yellow-400'
                    : 'bg-gray-700'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm font-medium">
                    {index + 1}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-16 ml-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      {renderStepContent()}
    </div>
  );
}