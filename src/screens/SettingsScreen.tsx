import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../store/settingsStore';
import { useChimePlayer, CHIME_OPTIONS } from '../hooks/useChimePlayer';
import { useFanfarePlayer, FANFARE_OPTIONS } from '../hooks/useFanfarePlayer';
import type { ChimeId, FanfareId } from '../types/breathing';
import { colors } from '../theme';

type SubScreen = 'main' | 'chime' | 'fanfare';

// ─── Shared option list renderer ─────────────────────────────────────────────

type OptionItem = { id: string; name: string; description: string };

function OptionList<T extends string>({
  options,
  selectedId,
  onSelect,
  onPreview,
}: {
  options: OptionItem[];
  selectedId: T;
  onSelect: (id: T) => void;
  onPreview: (id: T) => void;
}) {
  return (
    <View style={styles.card}>
      {options.map((option, index) => {
        const isSelected = option.id === selectedId;
        const isLast = index === options.length - 1;
        return (
          <View key={option.id}>
            <Pressable
              style={[styles.optionRow, isSelected && styles.optionRowSelected]}
              onPress={() => onSelect(option.id as T)}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>
                  {option.name}
                </Text>
                <Text style={styles.optionDesc}>{option.description}</Text>
              </View>
              <Pressable
                style={styles.playButton}
                onPress={() => onPreview(option.id as T)}
                hitSlop={8}
              >
                <Text style={[styles.playIcon, isSelected && styles.playIconSelected]}>▶</Text>
              </Pressable>
            </Pressable>
            {!isLast && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );
}

// ─── Sub-screen header ────────────────────────────────────────────────────────

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.subHeader}>
      <Pressable onPress={onBack} hitSlop={12}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <Text style={styles.subTitle}>{title}</Text>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const [subScreen, setSubScreen] = useState<SubScreen>('main');

  const selectedChimeId = useSettingsStore((s) => s.selectedChimeId);
  const setChimeId = useSettingsStore((s) => s.setChimeId);
  const selectedFanfareId = useSettingsStore((s) => s.selectedFanfareId);
  const setFanfareId = useSettingsStore((s) => s.setFanfareId);

  const { preview: previewChime } = useChimePlayer();
  const { preview: previewFanfare } = useFanfarePlayer();

  const selectedChimeName = CHIME_OPTIONS.find((o) => o.id === selectedChimeId)?.name ?? '';
  const selectedFanfareName = FANFARE_OPTIONS.find((o) => o.id === selectedFanfareId)?.name ?? '';

  // ── Chime sub-screen ───────────────────────────────────────────────────────

  if (subScreen === 'chime') {
    return (
      <SafeAreaView style={styles.container}>
        <SubHeader title="Chime" onBack={() => setSubScreen('main')} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.sectionLabel}>SELECT A CHIME SOUND</Text>
          <OptionList
            options={CHIME_OPTIONS}
            selectedId={selectedChimeId}
            onSelect={(id) => setChimeId(id as ChimeId)}
            onPreview={(id) => previewChime(id as ChimeId)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Fanfare sub-screen ─────────────────────────────────────────────────────

  if (subScreen === 'fanfare') {
    return (
      <SafeAreaView style={styles.container}>
        <SubHeader title="Fanfare" onBack={() => setSubScreen('main')} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.sectionLabel}>SELECT A FANFARE SOUND</Text>
          <OptionList
            options={FANFARE_OPTIONS}
            selectedId={selectedFanfareId}
            onSelect={(id) => setFanfareId(id as FanfareId)}
            onPreview={(id) => previewFanfare(id as FanfareId)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Main screen ────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Settings</Text>
        </View>

        <Text style={styles.sectionLabel}>SOUND</Text>

        <View style={styles.card}>
          {/* Chime row */}
          <Pressable style={styles.prefRow} onPress={() => setSubScreen('chime')}>
            <Text style={styles.prefLabel}>Chime</Text>
            <View style={styles.prefRight}>
              <Text style={styles.prefValue}>{selectedChimeName}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          {/* Fanfare row */}
          <Pressable style={styles.prefRow} onPress={() => setSubScreen('fanfare')}>
            <Text style={styles.prefLabel}>Fanfare</Text>
            <View style={styles.prefRight}>
              <Text style={styles.prefValue}>{selectedFanfareName}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 48,
  },
  // Main header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  // Sub-screen header
  subHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  // Section label
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  // Shared card
  card: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 52,
  },
  // Main screen preference rows
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  prefLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  prefRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prefValue: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 20,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  // Option list rows (sub-screens)
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionRowSelected: {
    backgroundColor: colors.accent + '12',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioSelected: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  optionText: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionNameSelected: {
    fontWeight: '600',
    color: colors.accent,
  },
  optionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  playButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  playIcon: {
    fontSize: 14,
    color: colors.borderLight,
  },
  playIconSelected: {
    color: colors.accent,
  },
});
