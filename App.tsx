import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BreathingListScreen from './src/screens/BreathingListScreen';
import BreathingExerciseScreen from './src/screens/BreathingExerciseScreen';
import MeditateScreen from './src/screens/MeditateScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import { usePushNotifications } from './src/hooks/usePushNotifications';
import { useTheme, useIsDark } from './src/hooks/useTheme';
import type { Colors } from './src/theme';
import type { Exercise } from './src/types/breathing';

type TabKey = 'meditate' | 'breathe' | 'journey' | 'settings';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'meditate', label: 'Meditate', icon: '🧘' },
  { key: 'breathe', label: 'Breathe', icon: '☺️' },
  { key: 'journey', label: 'Journey', icon: '🗺️' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('meditate');

  usePushNotifications();

  const colors = useTheme();
  const isDark = useIsDark();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  function renderCurrentTab() {
    switch (activeTab) {
      case 'meditate':
        return <MeditateScreen />;
      case 'journey':
        return <JourneyScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'breathe':
      default:
        if (selectedExercise) {
          return (
            <BreathingExerciseScreen
              exercise={selectedExercise}
              onBack={() => setSelectedExercise(null)}
            />
          );
        }

        return <BreathingListScreen onSelectExercise={setSelectedExercise} />;
    }
  }

  return (
    <SafeAreaProvider>
      <View style={styles.app}>
        <View style={styles.content}>{renderCurrentTab()}</View>
        <SafeAreaView style={styles.tabBar} edges={['bottom']}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <Pressable
                key={tab.key}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </SafeAreaView>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.55,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.textPrimary,
  },
});
