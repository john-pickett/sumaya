export type Phase = {
  label: string;
  duration: number;
};

export type Shape = 'circle' | 'square' | 'triangle' | 'star';

export type Exercise = {
  id: string;
  name: string;
  emotion: string;
  emoji: string;
  color: string;
  shape: Shape;
  description: string;
  phases: Phase[];
  length: number;
};

export type MoodValue = 'awful' | 'bad' | 'meh' | 'good' | 'great' | 'amazing';

export type SessionLog = {
  id: string;
  completedAt: string;
  exerciseId: string;
  exerciseName: string;
  exerciseEmotion: string;
  postExerciseMood: MoodValue | null;
};

export type MeditationLog = {
  id: string;
  completedAt: string;
  durationMinutes: number;
  postMood: MoodValue | null;
};

export type ChimeId = 'crystal' | 'temple' | 'wind' | 'bowl' | 'tone' | 'bamboo';

export type FanfareId = 'triumph' | 'bells' | 'gentle' | 'rising' | 'majestic' | 'zen';
