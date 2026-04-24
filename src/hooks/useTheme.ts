import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';
import { lightColors, darkColors } from '../theme';

export function useTheme() {
  const themeId = useSettingsStore((s) => s.themeId);
  const systemScheme = useColorScheme();
  const isDark = themeId === 'dark' || (themeId === 'system' && systemScheme === 'dark');
  return isDark ? darkColors : lightColors;
}

export function useIsDark() {
  const themeId = useSettingsStore((s) => s.themeId);
  const systemScheme = useColorScheme();
  return themeId === 'dark' || (themeId === 'system' && systemScheme === 'dark');
}
