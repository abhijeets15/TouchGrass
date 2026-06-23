import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * True when running on a physical device (not simulator/emulator).
 * Uses Expo Constants — no extra native module required.
 */
function isPhysicalDevice(): boolean {
  // Expo Go on a real phone sets deviceName; simulators use known names
  const deviceName = Constants.deviceName ?? '';
  const isSimulator =
    Platform.OS === 'ios' &&
    (deviceName.includes('Simulator') || deviceName.includes('iPhone Simulator'));
  const isEmulator =
    Platform.OS === 'android' &&
    (deviceName.includes('sdk_gphone') ||
      deviceName.includes('emulator') ||
      deviceName.includes('Android SDK'));

  if (isSimulator || isEmulator) return false;

  // executionEnvironment 'bare' / 'storeClient' on real devices
  return Constants.isDevice ?? true;
}

/**
 * LAN IPs from Metro → API on the same machine (physical devices).
 * Skip only Metro's bogus 10.0.0.x when we're on an Android emulator.
 */
function isReachableLanHost(host: string): boolean {
  if (host === 'localhost' || host.startsWith('127.')) return false;
  if (host === '10.0.2.2') return false;
  return true;
}

/**
 * Resolves the auth API URL for the current device.
 */
export function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (Platform.OS === 'android' && !isPhysicalDevice()) {
    return 'http://10.0.2.2:3001';
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host && isReachableLanHost(host)) {
    return `http://${host}:3001`;
  }

  if (Platform.OS === 'ios' && !isPhysicalDevice()) {
    return 'http://localhost:3001';
  }

  // Physical device fallback — same IP family as Metro when possible
  if (host && host !== 'localhost') {
    return `http://${host}:3001`;
  }

  return 'http://localhost:3001';
}

export const API_URL = resolveApiUrl();
