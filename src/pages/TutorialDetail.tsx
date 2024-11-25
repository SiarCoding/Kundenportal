import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TutorialService } from '../services/tutorial.service';
import { TutorialContent } from '../types/tutorial';
import TutorialPlayer from '../components/tutorials/TutorialPlayer';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function TutorialDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tutorial, setTutorial] = useState<TutorialContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutorial = async () => {
      try {
        if (!id) return;
        const data = await TutorialService.fetchTutorialById(id);
        setTutorial(data);
      } catch (error) {
        console.error('Error loading tutorial:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTutorial();
  }, [id]);

  if (loading || !tutorial || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <button
          onClick={() => navigate('/tutorials')}
          className="flex items-center text-gray-400 hover:text-gray-300 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Zurück zur Übersicht
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100">{tutorial.title}</h1>
            <p className="mt-2 text-gray-400">{tutorial.description}</p>
          </div>

          <div className="bg-[#25262b] rounded-xl p-6">
            <TutorialPlayer
              tutorial={tutorial}
              userId={user.id}
              onComplete={() => {
                if (tutorial.requiredForOnboarding) {
                  navigate('/dashboard');
                }
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}