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

type OpenPicker = 'hour' | 'minute' | null;

function minuteLabel(m: number) {
  return `:${String(m).padStart(2, '0')}`;
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

type DropdownProps = {
  label: string;
  displayValue: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function Dropdown({ label, displayValue, open, onToggle, children }: DropdownProps) {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <View style={[dropdown.container, open && dropdown.containerOpen]}>
      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        <Text style={dropdown.label}>{label}</Text>
        <Pressable
          style={({ pressed }) => [
            dropdown.trigger,
            open && dropdown.triggerOpen,
            pressed && dropdown.triggerPressed,
          ]}
          onPress={onToggle}
        >
          <Text style={[dropdown.triggerText, open && dropdown.triggerTextOpen]}>
            {displayValue}
          </Text>
          <Text style={[dropdown.chevron, open && dropdown.chevronOpen]}>
            {open ? '▲' : '▼'}
          </Text>
        </Pressable>
      </View>

      {open && (
        <View style={[dropdown.listWrapper, { top: headerHeight }]}>
          <ScrollView style={dropdown.list} nestedScrollEnabled bounces={false}>
            {children}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

type OptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function DropdownOption({ label, selected, onPress }: OptionProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        dropdown.option,
        selected && dropdown.optionSelected,
        pressed && dropdown.optionPressed,
      ]}
      onPress={onPress}
    >
      <Text style={[dropdown.optionText, selected && dropdown.optionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function NotificationTimePickerModal({ visible, onSet, onSkip }: Props) {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState<0 | 15 | 30 | 45>(0);
  const [isPM, setIsPM] = useState(false);
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);

  function togglePicker(picker: 'hour' | 'minute') {
    setOpenPicker((prev) => (prev === picker ? null : picker));
  }

  async function handleSet() {
    const hour24 = to24Hour(hour, isPM);
    await scheduleDailyReminder(hour24, minute);
    setOpenPicker(null);
    onSet({ hour, minute, isPM });
  }

  function handleSkip() {
    setOpenPicker(null);
    onSkip();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>When should we remind you?</Text>

          {/* zIndex here ensures the floating lists render above ampmRow and buttons */}
          <View style={styles.pickersRow}>
            <Dropdown
              label="Hour"
              displayValue={String(hour)}
              open={openPicker === 'hour'}
              onToggle={() => togglePicker('hour')}
            >
              {HOURS.map((h) => (
                <DropdownOption
                  key={h}
                  label={String(h)}
                  selected={h === hour}
                  onPress={() => { setHour(h); setOpenPicker(null); }}
                />
              ))}
            </Dropdown>

            <Dropdown
              label="Minute"
              displayValue={minuteLabel(minute)}
              open={openPicker === 'minute'}
              onToggle={() => togglePicker('minute')}
            >
              {MINUTES.map((m) => (
                <DropdownOption
                  key={m}
                  label={minuteLabel(m)}
                  selected={m === minute}
                  onPress={() => { setMinute(m); setOpenPicker(null); }}
                />
              ))}
            </Dropdown>
          </View>

          <View style={styles.ampmRow}>
            <Pressable
              style={[styles.ampmPill, !isPM && styles.ampmPillActive]}
              onPress={() => setIsPM(false)}
            >
              <Text style={[styles.ampmText, !isPM && styles.ampmTextActive]}>AM</Text>
            </Pressable>
            <Pressable
              style={[styles.ampmPill, isPM && styles.ampmPillActive]}
              onPress={() => setIsPM(true)}
            >
              <Text style={[styles.ampmText, isPM && styles.ampmTextActive]}>PM</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.setButton, pressed && styles.setButtonPressed]}
            onPress={handleSet}
          >
            <Text style={styles.setButtonText}>Set reminder</Text>
          </Pressable>
          <Pressable onPress={handleSkip} hitSlop={12}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const dropdown = StyleSheet.create({
  container: {
    flex: 1,
    // z-index is overridden per-instance when open so the active list
    // paints above the sibling dropdown
    zIndex: 1,
  },
  containerOpen: {
    zIndex: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  triggerOpen: {
    borderColor: colors.accent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  triggerPressed: {
    opacity: 0.75,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  triggerTextOpen: {
    color: colors.accent,
  },
  chevron: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chevronOpen: {
    color: colors.accent,
  },
  // Absolutely-positioned wrapper so the list doesn't push content down
  listWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20, // Android stacking
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  list: {
    maxHeight: 180,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: colors.accent,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: colors.card,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  optionSelected: {
    backgroundColor: colors.accent + '18',
  },
  optionPressed: {
    backgroundColor: colors.accent + '10',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
});

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
  pickersRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 20,
    // Must be above ampmRow / buttons so absolute lists float over them
    zIndex: 10,
  },
  ampmRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    zIndex: 1,
  },
  ampmPill: {
    paddingHorizontal: 28,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  ampmPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  ampmText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  ampmTextActive: {
    color: colors.white,
  },
  setButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
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
