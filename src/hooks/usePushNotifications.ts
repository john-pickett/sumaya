import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Foreground notification behavior — show the alert + play sound even when
// the app is open. Adjust to taste.
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
  let finalStatus = existing.status;
  if (finalStatus !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    finalStatus = req.status;
  }
  if (finalStatus !== 'granted') {
    return { status: 'denied' };
  }

  const projectId =
    (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas
      ?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    return { status: 'unsupported', reason: 'Missing EAS projectId in app config' };
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  return { status: 'granted', token };
}

/**
 * Registers for Expo push notifications and returns the resulting token (or
 * status). Also wires up listeners that fire when a notification is received
 * in the foreground, and when the user taps a notification.
 *
 * Usage:
 *   const push = usePushNotifications();
 *   if (push.status === 'granted') console.log(push.token);
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
          // Log the token so you can copy it from the Metro console and
          // test sends via https://expo.dev/notifications or curl.
          console.log('[push] Expo push token:', result.token);
        } else if (result.status !== 'idle') {
          console.log('[push] not registered:', result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('[push] registration failed:', err);
        }
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
