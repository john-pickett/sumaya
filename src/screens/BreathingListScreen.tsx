import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '../data/breathing.json';
import ExerciseCard from '../components/ExerciseCard';
import type { Exercise } from '../types/breathing';
import { colors } from '../theme';

type Props = {
  onSelectExercise: (exercise: Exercise) => void;
};

export default function BreathingListScreen({ onSelectExercise }: Props) {
  const exercises = data.exercises as Exercise[];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>How are you feeling?</Text>
        <Text style={styles.subheading}>Choose what fits right now</Text>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onPress={() => onSelectExercise(exercise)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingTop: 28,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: 20,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: colors.textMuted,
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
