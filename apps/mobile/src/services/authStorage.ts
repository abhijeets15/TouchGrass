import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from '@vibecheck/shared-types';

const ACCESS_KEY = 'vibecheck_access_token';
const REFRESH_KEY = 'vibecheck_refresh_token';
const USER_KEY = 'vibecheck_user';
const LAST_EMAIL_KEY = 'vibecheck_last_email';

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function getStoredSession(): Promise<StoredSession | null> {
  const [accessToken, refreshToken, userJson] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);

  if (!accessToken || !refreshToken) return null;

  let user: AuthUser | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson) as AuthUser;
    } catch {
      user = null;
    }
  }

  if (!user) return null;

  return { accessToken, refreshToken, user };
}

export async function saveSession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, refreshToken),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}

export async function saveLastEmail(email: string): Promise<void> {
  await SecureStore.setItemAsync(LAST_EMAIL_KEY, email.trim().toLowerCase());
}

export async function getLastEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(LAST_EMAIL_KEY);
}
