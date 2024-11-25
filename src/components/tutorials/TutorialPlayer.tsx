import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import { TutorialContent, TutorialProgress } from '../../types/tutorial';
import { TutorialService } from '../../services/tutorial.service';

interface TutorialPlayerProps {
  tutorial: TutorialContent;
  userId: string;
  onComplete: () => void;
}

export default function TutorialPlayer({ tutorial, userId, onComplete }: TutorialPlayerProps) {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const currentContent = tutorial.content[currentContentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleComplete = async () => {
    try {
      await TutorialService.updateProgress({
        userId,
        tutorialId: tutorial.id,
        completed: true,
        lastViewed: new Date(),
        timeSpent,
      });
      onComplete();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="space-y-6">
      {currentContent.type === 'video' && currentContent.videoUrl && (
        <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
          <ReactPlayer
            url={currentContent.videoUrl}
            width="100%"
            height="100%"
            controls
            onEnded={() => {
              if (currentContentIndex === tutorial.content.length - 1) {
                handleComplete();
              } else {
                setCurrentContentIndex(currentContentIndex + 1);
              }
            }}
          />
        </div>
      )}

      {currentContent.type === 'text' && currentContent.markdown && (
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{currentContent.markdown}</ReactMarkdown>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentContentIndex(Math.max(0, currentContentIndex - 1))}
          disabled={currentContentIndex === 0}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50"
        >
          Zurück
        </button>
        <button
          onClick={() => {
            if (currentContentIndex === tutorial.content.length - 1) {
              handleComplete();
            } else {
              setCurrentContentIndex(currentContentIndex + 1);
            }
          }}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
        >
          {currentContentIndex === tutorial.content.length - 1 ? 'Abschließen' : 'Weiter'}
        </button>
      </div>
    </div>
  );
}