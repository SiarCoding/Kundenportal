export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  completed: boolean;
  required: boolean;
}

export interface OnboardingState {
  checklist: ChecklistItem[];
  tutorials: Tutorial[];
  isCompleted: boolean;
}