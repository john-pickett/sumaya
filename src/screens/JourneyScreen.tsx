import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useSessionStore } from '../store/sessionStore';
import type { MoodValue, SessionLog, MeditationLog } from '../types/breathing';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#7B68B5';
const BG = '#F7F5F2';
const CARD_BG = '#FFFDF9';
const BORDER = '#E7E1D8';
const TEXT_PRIMARY = '#1A1A2E';
const TEXT_SECONDARY = '#6F6B66';

const DOT_MEDITATION = { key: 'meditation', color: '#4CAF50' };
const DOT_BREATHING = { key: 'breathing', color: '#F9A825' };

const MOOD_EMOJI: Record<MoodValue, string> = {
  awful: '😩', bad: '😔', meh: '😐', good: '🙂', great: '😊', amazing: '🤩',
};

const calendarTheme = {
  calendarBackground: CARD_BG,
  textSectionTitleColor: TEXT_SECONDARY,
  selectedDayBackgroundColor: ACCENT,
  selectedDayTextColor: '#fff',
  todayTextColor: ACCENT,
  dayTextColor: TEXT_PRIMARY,
  textDisabledColor: '#C8C2BA',
  arrowColor: ACCENT,
  monthTextColor: TEXT_PRIMARY,
  textMonthFontWeight: '700' as const,
  textDayHeaderFontWeight: '600' as const,
  textDayFontSize: 15,
  textMonthFontSize: 17,
  textDayHeaderFontSize: 12,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDayTitle(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${d}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours() % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type MarkedDay = {
  dots?: { key: string; color: string }[];
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
};

type DayEntry =
  | { kind: 'meditation'; data: MeditationLog; time: Date }
  | { kind: 'breathing'; data: SessionLog; time: Date };

// ─── Component ────────────────────────────────────────────────────────────────

export default function JourneyScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const meditationSessions = useSessionStore((s) => s.meditationSessions);

  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-01`;
  });

  const hasNoSessions = sessions.length === 0 && meditationSessions.length === 0;

  const markedDates = useMemo((): Record<string, MarkedDay> => {
    const dayMap: Record<string, { hasMeditation: boolean; hasBreathing: boolean }> = {};

    for (const s of meditationSessions) {
      const key = toLocalDateKey(s.completedAt);
      if (!dayMap[key]) dayMap[key] = { hasMeditation: false, hasBreathing: false };
      dayMap[key].hasMeditation = true;
    }

    for (const s of sessions) {
      const key = toLocalDateKey(s.completedAt);
      if (!dayMap[key]) dayMap[key] = { hasMeditation: false, hasBreathing: false };
      dayMap[key].hasBreathing = true;
    }

    const result: Record<string, MarkedDay> = {};

    for (const [date, flags] of Object.entries(dayMap)) {
      const dots: { key: string; color: string }[] = [];
      if (flags.hasMeditation) dots.push(DOT_MEDITATION);
      if (flags.hasBreathing) dots.push(DOT_BREATHING);
      result[date] = { dots, marked: true };
    }

    const today = toLocalDateKey(new Date().toISOString());
    result[today] = { ...result[today], selected: true, selectedColor: ACCENT };

    return result;
  }, [sessions, meditationSessions]);

  const dayEntries = useMemo((): DayEntry[] => {
    if (!selectedDate) return [];

    const entries: DayEntry[] = [];

    for (const s of meditationSessions) {
      if (toLocalDateKey(s.completedAt) === selectedDate) {
        entries.push({ kind: 'meditation', data: s, time: new Date(s.completedAt) });
      }
    }

    for (const s of sessions) {
      if (toLocalDateKey(s.completedAt) === selectedDate) {
        entries.push({ kind: 'breathing', data: s, time: new Date(s.completedAt) });
      }
    }

    return entries.sort((a, b) => a.time.getTime() - b.time.getTime());
  }, [selectedDate, sessions, meditationSessions]);

  // ── Day View ────────────────────────────────────────────────────────────────

  if (viewMode === 'day') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dayHeader}>
          <Pressable onPress={() => setViewMode('month')} hitSlop={12}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.dayTitle}>{formatDayTitle(selectedDate)}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {dayEntries.map((entry) => {
            const isMeditation = entry.kind === 'meditation';
            const barColor = isMeditation ? DOT_MEDITATION.color : DOT_BREATHING.color;
            const title = isMeditation ? 'Meditation' : (entry.data as SessionLog).exerciseName;
            const mood = isMeditation
              ? (entry.data as MeditationLog).postMood
              : (entry.data as SessionLog).postExerciseMood;

            return (
              <View key={entry.data.id} style={styles.sessionCard}>
                <View style={[styles.sessionColorBar, { backgroundColor: barColor }]} />
                <View style={styles.sessionBody}>
                  <Text style={styles.sessionTime}>{formatTime(entry.data.completedAt)}</Text>
                  <Text style={styles.sessionTitle}>{title}</Text>
                  {isMeditation && (
                    <Text style={styles.sessionDuration}>
                      {(entry.data as MeditationLog).durationMinutes}{' '}
                      {(entry.data as MeditationLog).durationMinutes === 1 ? 'minute' : 'minutes'}
                    </Text>
                  )}
                </View>
                {mood !== null && mood !== undefined && (
                  <Text style={styles.sessionMood}>{MOOD_EMOJI[mood]}</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Month View ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Journey</Text>
      </View>

      {hasNoSessions ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyDesc}>
              Complete a meditation or breathing exercise and it will appear here.
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.calendarCard}>
            <Calendar
              current={currentMonth}
              markingType="multi-dot"
              markedDates={markedDates}
              theme={calendarTheme}
              onDayPress={(day) => {
                const hasActivity = (markedDates[day.dateString]?.dots?.length ?? 0) > 0;
                if (hasActivity) {
                  setSelectedDate(day.dateString);
                  setViewMode('day');
                }
              }}
              enableSwipeMonths
            />
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: DOT_MEDITATION.color }]} />
              <Text style={styles.legendLabel}>Meditation</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: DOT_BREATHING.color }]} />
              <Text style={styles.legendLabel}>Breathing</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  // Month view
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  scroll: {
    paddingBottom: 40,
  },
  calendarCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  emptyDesc: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: TEXT_SECONDARY,
  },
  // Day view
  dayHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backText: {
    fontSize: 16,
    color: ACCENT,
    fontWeight: '600',
    marginBottom: 6,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    alignItems: 'center',
  },
  sessionColorBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  sessionBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sessionTime: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: '500',
    marginBottom: 3,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  sessionDuration: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  sessionMood: {
    fontSize: 24,
    paddingRight: 14,
  },
});
