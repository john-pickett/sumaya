import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import * as Notifications from 'expo-notifications';
import { colors } from '../theme';
import type { NotificationTime } from '../store/settingsStore';

type Props = {
  visible: boolean;
  onSet: (time: NotificationTime) => void;
  onSkip: () => void;
};

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES: Array<0 | 15 | 30 | 45> = [0, 15, 30, 45];

function toLabel(minute: number) {
  return `:${String(minute).padStart(2, '0')}`;
}

function to24Hour(hour: number, isPM: boolean): number {
  if (isPM && hour !== 12) return hour + 12;
  if (!isPM && hour === 12) return 0;
  return hour;
}

async function scheduleDailyReminder(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to meditate 🧘',
      body: 'A few minutes of calm is waiting for you.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export default function NotificationTimePickerModal({ visible, onSet, onSkip }: Props) {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState<0 | 15 | 30 | 45>(0);
  const [isPM, setIsPM] = useState(false);

  async function handleSet() {
    const hour24 = to24Hour(hour, isPM);
    await scheduleDailyReminder(hour24, minute);
    onSet({ hour, minute, isPM });
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>When should we remind you?</Text>

          <Text style={styles.sectionLabel}>Hour</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
          >
            {HOURS.map((h) => {
              const active = h === hour;
              return (
                <Pressable
                  key={h}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setHour(h)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {h}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionLabel}>Minute</Text>
          <View style={styles.pillRow}>
            {MINUTES.map((m) => {
              const active = m === minute;
              return (
                <Pressable
                  key={m}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setMinute(m)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {toLabel(m)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.ampmRow}>
            <Pressable
              style={[styles.ampmPill, !isPM && styles.pillActive]}
              onPress={() => setIsPM(false)}
            >
              <Text style={[styles.pillText, !isPM && styles.pillTextActive]}>AM</Text>
            </Pressable>
            <Pressable
              style={[styles.ampmPill, isPM && styles.pillActive]}
              onPress={() => setIsPM(true)}
            >
              <Text style={[styles.pillText, isPM && styles.pillTextActive]}>PM</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.setButton, pressed && styles.setButtonPressed]}
            onPress={handleSet}
          >
            <Text style={styles.setButtonText}>Set reminder</Text>
          </Pressable>
          <Pressable onPress={onSkip} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.modalBackdrop,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.white,
  },
  ampmRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  ampmPill: {
    paddingHorizontal: 28,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  setButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  setButtonPressed: {
    opacity: 0.85,
  },
  setButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  skipText: {
    fontSize: 15,
    color: colors.textFaint,
    fontWeight: '500',
  },
});
