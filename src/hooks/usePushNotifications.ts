import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export type PushRegistration =
  | { status: 'idle' }
  | { status: 'unsupported'; reason: string }
  | { status: 'denied' }
  | { status: 'granted'; token: string };

async function getExpoPushToken(): Promise<string | null> {
  const projectId =
    (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas
      ?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return null;
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  return token;
}

async function registerForPushNotificationsAsync(): Promise<PushRegistration> {
  if (!Device.isDevice) {
    return { status: 'unsupported', reason: 'Must be run on a physical device' };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const existing = await Notifications.getPermissionsAsync();
  if (existing.status !== 'granted') {
    return { status: 'denied' };
  }

  const token = await getExpoPushToken();
  if (!token) {
    return { status: 'unsupported', reason: 'Missing EAS projectId in app config' };
  }
  return { status: 'granted', token };
}

/**
 * Requests OS notification permission and, if granted, returns the Expo push token.
 * Call this explicitly when the user opts in — not on startup.
 */
export async function requestNotificationPermission(): Promise<'granted' | 'denied'> {
  if (!Device.isDevice) return 'denied';

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return 'denied';

  const token = await getExpoPushToken();
  if (token) {
    console.log('[push] Expo push token:', token);
  }
  return 'granted';
}

/**
 * Wires up foreground notification listeners and checks existing permission
 * state without prompting the user. Call once at the app root.
 */
export function usePushNotifications(): PushRegistration {
  const [registration, setRegistration] = useState<PushRegistration>({ status: 'idle' });
  const receivedSub = useRef<Notifications.EventSubscription | null>(null);
  const responseSub = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;

    registerForPushNotificationsAsync()
      .then((result) => {
        if (cancelled) return;
        setRegistration(result);
        if (result.status === 'granted') {
          console.log('[push] Expo push token:', result.token);
        }
      })
      .catch((err) => {
        if (!cancelled) console.warn('[push] registration check failed:', err);
      });

    receivedSub.current = Notifications.addNotificationReceivedListener((n) => {
      console.log('[push] received in foreground:', n);
    });
    responseSub.current = Notifications.addNotificationResponseReceivedListener((r) => {
      console.log('[push] user tapped notification:', r);
    });

    return () => {
      cancelled = true;
      receivedSub.current?.remove();
      responseSub.current?.remove();
    };
  }, []);

  return registration;
}
