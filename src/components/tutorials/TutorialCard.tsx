import React from 'react';
import { Play, CheckCircle, Clock } from 'lucide-react';
import { TutorialCardProps } from '../../types/tutorial';

export default function TutorialCard({ tutorial, progress, onSelect }: TutorialCardProps) {
  const firstContent = tutorial.content[0];
  const isCompleted = progress?.completed;

  return (
    <div
      onClick={() => onSelect(tutorial.id)}
      className="bg-[#25262b] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
    >
      <div className="relative">
        <img
          src={firstContent.thumbnailUrl}
          alt={tutorial.title}
          className="w-full h-48 object-cover"
        />
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 rounded-full px-3 py-1 flex items-center space-x-1">
          <Clock className="w-4 h-4 text-gray-300" />
          <span className="text-sm text-gray-300">
            {firstContent.duration} min
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">
              {tutorial.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {tutorial.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tutorial.category === 'Onboarding'
              ? 'bg-blue-500/10 text-blue-400'
              : tutorial.category === 'Advanced'
              ? 'bg-yellow-500/10 text-yellow-400'
              : 'bg-purple-500/10 text-purple-400'
          }`}>
            {tutorial.category}
          </span>
          <button className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-500">
            <Play className="w-4 h-4" />
            <span className="text-sm">Starten</span>
          </button>
        </div>
      </div>
    </div>
  );
}