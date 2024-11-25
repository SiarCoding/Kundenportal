export interface TutorialContent {
  id: string;
  title: string;
  description: string;
  category: 'Onboarding' | 'Advanced' | 'Expert';
  content: TutorialContentItem[];
  order: number;
  status: 'draft' | 'published';
  requiredForOnboarding: boolean;
  completionRequired: boolean;
  tags: string[];
  lastUpdated: Date;
}

export interface TutorialContentItem {
  type: 'video' | 'text' | 'interactive';
  videoUrl?: string;
  markdown?: string;
  duration: number;
  thumbnailUrl: string;
}

export interface TutorialProgress {
  userId: string;
  tutorialId: string;
  completed: boolean;
  lastViewed: Date;
  timeSpent: number;
}

export interface TutorialCardProps {
  tutorial: TutorialContent;
  progress?: TutorialProgress;
  onSelect: (tutorialId: string) => void;
}