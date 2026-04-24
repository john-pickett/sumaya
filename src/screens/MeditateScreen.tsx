import { useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import * as Notifications from 'expo-notifications';
import { useMeditationTimer } from '../hooks/useMeditationTimer';
import { requestNotificationPermission } from '../hooks/usePushNotifications';
import PostExerciseMoodDialog from '../components/PostExerciseMoodDialog';
import HowToMeditateModal from '../components/HowToMeditateModal';
import NotificationReminderModal from '../components/NotificationReminderModal';
import NotificationTimePickerModal from '../components/NotificationTimePickerModal';
import { useSessionStore } from '../store/sessionStore';
import { useSettingsStore } from '../store/settingsStore';
import type { NotificationTime } from '../store/settingsStore';
import type { MoodValue } from '../types/breathing';
import { calculateStreaks } from '../utils/streaks';
import { colors } from '../theme';

const ACCENT = colors.accent;
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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [notifReminderVisible, setNotifReminderVisible] = useState(false);
  const [notifTimePickerVisible, setNotifTimePickerVisible] = useState(false);

  const { status, totalSeconds, secondsRemaining, progress, prepMessage, start, reset } = useMeditationTimer();
  const logMeditationSession = useSessionStore((s) => s.logMeditationSession);
  const meditationSessions = useSessionStore((s) => s.meditationSessions);
  const { currentStreak } = useMemo(() => calculateStreaks(meditationSessions), [meditationSessions]);

  const notificationPromptShown = useSettingsStore((s) => s.notificationPromptShown);
  const setNotificationPromptShown = useSettingsStore((s) => s.setNotificationPromptShown);
  const setNotificationTime = useSettingsStore((s) => s.setNotificationTime);

  useEffect(() => {
    if (status === 'done') setDialogVisible(true);
  }, [status]);

  async function checkAndMaybePrompt(wasFirstSession: boolean) {
    if (!wasFirstSession || notificationPromptShown) return;
    const existing = await Notifications.getPermissionsAsync();
    setNotificationPromptShown(true);
    if (existing.status !== 'granted') {
      setNotifReminderVisible(true);
    }
  }

  function handleMoodSelect(mood: MoodValue) {
    const wasFirstSession = meditationSessions.length === 0;
    logMeditationSession({
      completedAt: new Date().toISOString(),
      durationMinutes: Math.round(totalSeconds / 60),
      postMood: mood,
    });
    setDialogVisible(false);
    checkAndMaybePrompt(wasFirstSession);
  }

  function handleSkip() {
    const wasFirstSession = meditationSessions.length === 0;
    logMeditationSession({
      completedAt: new Date().toISOString(),
      durationMinutes: Math.round(totalSeconds / 60),
      postMood: null,
    });
    setDialogVisible(false);
    checkAndMaybePrompt(wasFirstSession);
  }

  async function handleReminderYes() {
    setNotifReminderVisible(false);
    const result = await requestNotificationPermission();
    if (result === 'granted') {
      setNotifTimePickerVisible(true);
    }
  }

  function handleReminderNo() {
    setNotifReminderVisible(false);
  }

  function handleTimePicked(time: NotificationTime) {
    setNotificationTime(time);
    setNotifTimePickerVisible(false);
  }

  function handleTimeSkipped() {
    setNotifTimePickerVisible(false);
  }

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
          <Pressable
            style={[styles.startButton, { backgroundColor: ACCENT }]}
            onPress={() => { setDialogVisible(false); reset(); }}
          >
            <Text style={styles.startButtonText}>Done</Text>
          </Pressable>
        </View>
        <PostExerciseMoodDialog
          visible={dialogVisible}
          accentColor={ACCENT}
          onSelect={handleMoodSelect}
          onSkip={handleSkip}
        />
        <NotificationReminderModal
          visible={notifReminderVisible}
          onYes={handleReminderYes}
          onNo={handleReminderNo}
        />
        <NotificationTimePickerModal
          visible={notifTimePickerVisible}
          onSet={handleTimePicked}
          onSkip={handleTimeSkipped}
        />
      </SafeAreaView>
    );
  }

  if (status === 'preparing' || status === 'running') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <View style={styles.arcContainer}>
            <View style={styles.arcWrapper}>
              <Svg width={ARC_SIZE} height={ARC_SIZE}>
                <Circle
                  cx={ARC_CENTER}
                  cy={ARC_CENTER}
                  r={ARC_RADIUS}
                  stroke={colors.border}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                />
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
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Meditate</Text>
        <Pressable onPress={() => setInfoVisible(true)} hitSlop={16}>
          <Text style={styles.infoBtnText}>ⓘ</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>
            {currentStreak > 0
              ? `🔥 ${currentStreak} day${currentStreak === 1 ? '' : 's'} in a row`
              : 'Start your streak today!'}
          </Text>
        </View>
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
      <HowToMeditateModal visible={infoVisible} onClose={() => setInfoVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoBtnText: {
    fontSize: 24,
    color: colors.textSecondary,
    lineHeight: 28,
  },
  // idle
  streakBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 28,
  },
  streakBadgeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
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
    borderColor: colors.borderLight,
    backgroundColor: colors.card,
  },
  durationText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  durationTextActive: {
    color: colors.white,
  },
  startButton: {
    paddingHorizontal: 56,
    paddingVertical: 16,
    borderRadius: 32,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
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
    transform: [{ rotate: '135deg' }, { scaleX: -1 }],
  },
  countdown: {
    fontSize: 52,
    fontWeight: '200',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  prepMessage: {
    marginTop: 36,
    fontSize: 20,
    fontWeight: '500',
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    marginBottom: 12,
  },
  doneSubtext: {
    fontSize: 16,
    color: colors.textMid,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
});
