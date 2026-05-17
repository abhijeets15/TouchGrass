import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * LAN IPs from Metro → API on the same machine (physical devices).
 * Emulator-only / virtual hosts must NOT be used for the API.
 */
function isReachableLanHost(host: string): boolean {
  if (host === 'localhost' || host.startsWith('127.')) return false;
  // Android emulator alias for the host — not valid as a literal HTTP target
  if (host === '10.0.2.2') return false;
  // Expo sometimes reports Metro as 10.0.0.x — that is NOT the host API address
  if (host.startsWith('10.0.0.')) return false;
  return true;
}

/**
 * Resolves the auth API URL for the current device.
 * - EXPO_PUBLIC_API_URL in .env always wins
 * - Android emulator → 10.0.2.2 (maps to your Mac's localhost)
 * - Physical device → same IP as Metro (e.g. 192.168.x.x)
 * - iOS simulator → localhost
 */
export function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (Platform.OS === 'android') {
    const hostUri = Constants.expoConfig?.hostUri;
    const host = hostUri?.split(':')[0];
    if (host && isReachableLanHost(host)) {
      // Physical Android device on Wi‑Fi
      return `http://${host}:3001`;
    }
    // Emulator
    return 'http://10.0.2.2:3001';
  }

  if (Platform.OS === 'ios') {
    const hostUri = Constants.expoConfig?.hostUri;
    const host = hostUri?.split(':')[0];
    if (host && isReachableLanHost(host)) {
      return `http://${host}:3001`;
    }
    return 'http://localhost:3001';
  }

  return 'http://localhost:3001';
}

export const API_URL = resolveApiUrl();
