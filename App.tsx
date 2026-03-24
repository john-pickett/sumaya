import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BreathingListScreen from './src/screens/BreathingListScreen';
import BreathingExerciseScreen from './src/screens/BreathingExerciseScreen';
import type { Exercise } from './src/types/breathing';

export default function App() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  if (selectedExercise) {
    return (
      <SafeAreaProvider>
        <BreathingExerciseScreen
          exercise={selectedExercise}
          onBack={() => setSelectedExercise(null)}
        />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <BreathingListScreen onSelectExercise={setSelectedExercise} />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
