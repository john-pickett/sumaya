import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import BreathingListScreen from './src/screens/BreathingListScreen';
import BreathingExerciseScreen from './src/screens/BreathingExerciseScreen';
import type { Exercise } from './src/types/breathing';

export default function App() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  if (selectedExercise) {
    return (
      <>
        <BreathingExerciseScreen
          exercise={selectedExercise}
          onBack={() => setSelectedExercise(null)}
        />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <>
      <BreathingListScreen onSelectExercise={setSelectedExercise} />
      <StatusBar style="dark" />
    </>
  );
}
