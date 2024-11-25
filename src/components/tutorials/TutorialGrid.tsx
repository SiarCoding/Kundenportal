import React from 'react';
import { TutorialContent, TutorialProgress } from '../../types/tutorial';
import TutorialCard from './TutorialCard';

interface TutorialGridProps {
  tutorials: TutorialContent[];
  progress: TutorialProgress[];
  onSelect: (tutorialId: string) => void;
}

export default function TutorialGrid({ tutorials, progress, onSelect }: TutorialGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutorials.map((tutorial) => (
        <TutorialCard
          key={tutorial.id}
          tutorial={tutorial}
          progress={progress.find((p) => p.tutorialId === tutorial.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}