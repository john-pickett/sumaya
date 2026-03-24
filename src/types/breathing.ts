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
