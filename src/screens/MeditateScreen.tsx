import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useMeditationTimer } from '../hooks/useMeditationTimer';

const ACCENT = '#7B68B5';
const DURATION_OPTIONS = [2, 5, 10, 15, 20, 30];

const ARC_RADIUS = 130;
const ARC_SIZE = 300;
const ARC_CENTER = ARC_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;
const STROKE_WIDTH = 12;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MeditateScreen() {
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const { status, totalSeconds, secondsRemaining, progress, prepMessage, start, reset } = useMeditationTimer();

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CIRCUMFERENCE],
  });

  if (status === 'done') {
    const minutesDone = Math.round(totalSeconds / 60);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.doneEmoji}>👍</Text>
          <Text style={styles.doneHeading}>Good Job</Text>
          <Text style={styles.doneSubtext}>
            You meditated for {minutesDone} {minutesDone === 1 ? 'minute' : 'minutes'}.
          </Text>
          <Pressable style={[styles.startButton, { backgroundColor: ACCENT }]} onPress={reset}>
            <Text style={styles.startButtonText}>Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'preparing' || status === 'running') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          {/* Arc + timer overlaid: SVG is rotated for correct direction, text is centered on top */}
          <View style={styles.arcContainer}>
            <View style={styles.arcWrapper}>
              <Svg width={ARC_SIZE} height={ARC_SIZE}>
                {/* Track */}
                <Circle
                  cx={ARC_CENTER}
                  cy={ARC_CENTER}
                  r={ARC_RADIUS}
                  stroke="#E7E1D8"
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                />
                {/* Progress arc */}
                <AnimatedCircle
                  cx={ARC_CENTER}
                  cy={ARC_CENTER}
                  r={ARC_RADIUS}
                  stroke={ACCENT}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                />
              </Svg>
            </View>
            <Text style={styles.countdown}>{formatTime(secondsRemaining)}</Text>
          </View>
          {prepMessage !== null && (
            <Text style={styles.prepMessage}>{prepMessage}</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // idle
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Meditate</Text>
        <Text style={styles.label}>How long?</Text>

        <View style={styles.durationRow}>
          {DURATION_OPTIONS.map((min) => {
            const active = min === selectedMinutes;
            return (
              <Pressable
                key={min}
                style={[styles.durationPill, active && { backgroundColor: ACCENT, borderColor: ACCENT }]}
                onPress={() => setSelectedMinutes(min)}
              >
                <Text style={[styles.durationText, active && styles.durationTextActive]}>
                  {min}m
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[styles.startButton, { backgroundColor: ACCENT }]}
          onPress={() => start(selectedMinutes)}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F2',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  // idle
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 36,
  },
  label: {
    fontSize: 16,
    color: '#6F6B66',
    marginBottom: 16,
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 48,
  },
  durationPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#C8C2BA',
    backgroundColor: '#FFFDF9',
  },
  durationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6F6B66',
  },
  durationTextActive: {
    color: '#fff',
  },
  startButton: {
    paddingHorizontal: 56,
    paddingVertical: 16,
    borderRadius: 32,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  // running
  arcContainer: {
    width: ARC_SIZE,
    height: ARC_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcWrapper: {
    position: 'absolute',
    // Rotate 135° to place the start at ~5 o'clock (bottom-right),
    // then flip horizontally so the arc depletes counter-clockwise
    transform: [{ rotate: '135deg' }, { scaleX: -1 }],
  },
  countdown: {
    fontSize: 52,
    fontWeight: '200',
    color: '#1A1A2E',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  prepMessage: {
    marginTop: 36,
    fontSize: 20,
    fontWeight: '500',
    color: '#6F6B66',
    fontStyle: 'italic',
  },
  // done
  doneEmoji: {
    fontSize: 64,
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
    lineHeight: 24,
    marginBottom: 40,
  },
});
