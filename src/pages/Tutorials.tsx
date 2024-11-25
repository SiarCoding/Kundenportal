import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { TutorialService } from '../services/tutorial.service';
import { TutorialContent, TutorialProgress } from '../types/tutorial';
import TutorialGrid from '../components/tutorials/TutorialGrid';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function Tutorials() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState<TutorialContent[]>([]);
  const [progress, setProgress] = useState<TutorialProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadTutorials = async () => {
      try {
        const [tutorialsData, progressData] = await Promise.all([
          TutorialService.fetchTutorials(),
          TutorialService.fetchUserProgress(user!.id)
        ]);
        setTutorials(tutorialsData);
        setProgress(progressData);
      } catch (error) {
        console.error('Error loading tutorials:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTutorials();
    }
  }, [user]);

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Tutorials</h1>
          <p className="mt-2 text-gray-400">
            Lernen Sie unsere Plattform kennen und verbessern Sie Ihre Fähigkeiten
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tutorials durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#25262b] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#25262b] border border-gray-700 rounded-lg text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">Alle Kategorien</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Advanced">Fortgeschritten</option>
              <option value="Expert">Experte</option>
            </select>
          </div>
        </div>

        <TutorialGrid
          tutorials={filteredTutorials}
          progress={progress}
          onSelect={(tutorialId) => navigate(`/tutorials/${tutorialId}`)}
        />
      </div>
    </DashboardLayout>
  );
}