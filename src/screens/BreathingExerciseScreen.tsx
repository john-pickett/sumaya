import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBreathingAnimation } from '../hooks/useBreathingAnimation';
import BreathingShape from '../components/BreathingShape';
import PostExerciseMoodDialog from '../components/PostExerciseMoodDialog';
import { useSessionStore } from '../store/sessionStore';
import type { Exercise, MoodValue } from '../types/breathing';

type Props = {
  exercise: Exercise;
  onBack: () => void;
};

export default function BreathingExerciseScreen({ exercise, onBack }: Props) {
  const { scale, status, countdownLabel, currentPhaseLabel, secondsRemaining, cyclesRemaining } =
    useBreathingAnimation(exercise);

  const logSession = useSessionStore((s) => s.logSession);
  const [dialogVisible, setDialogVisible] = useState(false);

  const cycleWord = cyclesRemaining === 1 ? 'cycle' : 'cycles';

  useEffect(() => {
    if (status === 'done') {
      setDialogVisible(true);
    }
  }, [status]);

  function handleMoodSelect(mood: MoodValue) {
    logSession({
      completedAt: new Date().toISOString(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseEmotion: exercise.emotion,
      postExerciseMood: mood,
    });
    setDialogVisible(false);
  }

  function handleSkip() {
    logSession({
      completedAt: new Date().toISOString(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseEmotion: exercise.emotion,
      postExerciseMood: null,
    });
    setDialogVisible(false);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: exercise.color + '18' }]}>
      <Pressable style={styles.backButton} onPress={onBack} hitSlop={12}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      {status === 'done' ? (
        <View style={styles.body}>
          <Text style={styles.doneEmoji}>🌿</Text>
          <Text style={styles.doneHeading}>Well done</Text>
          <Text style={styles.doneSubtext}>
            You completed {exercise.length} {exercise.length === 1 ? 'cycle' : 'cycles'} of{' '}
            {exercise.name}.
          </Text>
          <Pressable
            style={[styles.doneButton, { backgroundColor: exercise.color }]}
            onPress={onBack}
          >
            <Text style={styles.doneButtonText}>Finish</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>

          <View style={styles.shapeContainer}>
            <BreathingShape scale={scale} exercise={exercise} size={160} />
            {status === 'countdown' && (
              <View style={styles.countdownOverlay}>
                <Text style={[styles.countdownNumber, { color: exercise.color }]}>
                  {countdownLabel}
                </Text>
              </View>
            )}
          </View>

          {status === 'running' ? (
            <>
              <Text style={styles.phaseLabel}>{currentPhaseLabel}</Text>
              <Text style={styles.phaseSecs}>{secondsRemaining}s</Text>
              <Text style={styles.cyclesRemaining}>
                {cyclesRemaining} {cycleWord} remaining
              </Text>
            </>
          ) : (
            <Text style={styles.startingText}>Get ready…</Text>
          )}
        </View>
      )}

      <PostExerciseMoodDialog
        visible={dialogVisible}
        accentColor={exercise.color}
        onSelect={handleMoodSelect}
        onSkip={handleSkip}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 48,
    letterSpacing: 0.3,
  },
  shapeContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontSize: 72,
    fontWeight: '700',
  },
  phaseLabel: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  phaseSecs: {
    fontSize: 18,
    color: '#888',
    fontVariant: ['tabular-nums'],
    marginBottom: 20,
  },
  cyclesRemaining: {
    fontSize: 15,
    color: '#888',
  },
  startingText: {
    fontSize: 18,
    color: '#888',
    fontStyle: 'italic',
  },
  // done screen
  doneEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  doneHeading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  doneSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 40,
    lineHeight: 24,
    marginBottom: 40,
  },
  doneButton: {
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 30,
  },
  doneButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
