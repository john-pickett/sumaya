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
