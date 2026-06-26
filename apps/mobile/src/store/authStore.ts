import { create } from 'zustand';
import type { AuthUser } from '@vibecheck/shared-types';
import { ApiClientError } from '@vibecheck/api-client';
import { authApi } from '../services/authApi';
import { API_URL } from '../config';
import * as authStorage from '../services/authStorage';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isGuest: boolean;
  isHydrating: boolean;
  isSubmitting: boolean;
  error: string | null;

  bootstrap: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  exitGuestMode: () => void;
  clearError: () => void;
}

async function applySession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
  set: (state: Partial<AuthState>) => void,
) {
  await authStorage.saveSession(accessToken, refreshToken, user);
  await authStorage.saveLastEmail(user.email);
  set({
    user,
    accessToken,
    refreshToken,
    isGuest: false,
    error: null,
  });
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isGuest: false,
  isHydrating: true,
  isSubmitting: false,
  error: null,

  bootstrap: async () => {
    set({ isHydrating: true, error: null });

    const stored = await authStorage.getStoredSession();
    if (!stored) {
      set({ isHydrating: false });
      return;
    }

    // Restore session immediately so UI stays signed in while we validate
    set({
      user: stored.user,
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
      isGuest: false,
    });

    try {
      const { user } = await authApi.me(stored.accessToken);
      await authStorage.saveSession(stored.accessToken, stored.refreshToken, user);
      set({ user, isHydrating: false });
      return;
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        try {
          const tokens = await authApi.refresh(stored.refreshToken);
          const { user } = await authApi.me(tokens.accessToken);
          await applySession(tokens.accessToken, tokens.refreshToken, user, set);
          set({ isHydrating: false });
          return;
        } catch (refreshErr) {
          if (
            refreshErr instanceof ApiClientError &&
            refreshErr.status === 401
          ) {
            await authStorage.clearSession();
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isHydrating: false,
            });
            return;
          }
          // Network error during refresh — keep cached session
          set({ isHydrating: false });
          return;
        }
      }

      if (err instanceof ApiClientError && err.status === 0) {
        // Offline / API down — keep persisted session
        set({ isHydrating: false });
        return;
      }

      // Unexpected error — still keep session; user can retry later
      set({ isHydrating: false });
    }
  },

  signUp: async (email, password, displayName) => {
    set({ isSubmitting: true, error: null });
    try {
      const { user, tokens } = await authApi.register({ email, password, displayName });
      await applySession(tokens.accessToken, tokens.refreshToken, user, set);
      set({ isSubmitting: false });
      return true;
    } catch (err) {
      const message = formatAuthError(err);
      set({ isSubmitting: false, error: message });
      return false;
    }
  },

  signIn: async (email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const { user, tokens } = await authApi.login({ email, password });
      await applySession(tokens.accessToken, tokens.refreshToken, user, set);
      set({ isSubmitting: false });
      return true;
    } catch (err) {
      const message = formatAuthError(err);
      set({ isSubmitting: false, error: message });
      return false;
    }
  },

  signOut: async () => {
    const { refreshToken, accessToken } = get();
    if (refreshToken && accessToken) {
      try {
        await authApi.logout(refreshToken, accessToken);
      } catch {
        // Clear local session even if server logout fails
      }
    }
    await authStorage.clearSession();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isGuest: false,
      error: null,
    });
  },

  continueAsGuest: () => {
    set({
      isGuest: true,
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
    });
  },

  exitGuestMode: () => set({ isGuest: false }),

  clearError: () => set({ error: null }),
}));

function formatAuthError(err: unknown): string {
  if (err instanceof ApiClientError) {
    if (err.status === 0) {
      return `Cannot reach the API at ${API_URL}. On your computer, run "npm run api" from the project root.`;
    }
    return err.message;
  }
  return 'Something went wrong. Please try again.';
}

/** Use these selectors so screens re-render when auth state changes. */
export const selectIsHydrating = (s: AuthState) => s.isHydrating;
export const selectIsAuthenticated = (s: AuthState) => !!s.user && !!s.accessToken;
export const selectIsGuest = (s: AuthState) => s.isGuest;
export const selectCanUseApp = (s: AuthState) =>
  (!!s.user && !!s.accessToken) || s.isGuest;
