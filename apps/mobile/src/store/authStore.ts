import { create } from 'zustand';
import type { AuthUser } from '@vibecheck/shared-types';
import { ApiClientError } from '@vibecheck/api-client';
import { authApi } from '../services/authApi';
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

  isAuthenticated: () => boolean;
  canUseApp: () => boolean;
}

async function persistSession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
  set: (state: Partial<AuthState>) => void,
) {
  await authStorage.saveTokens(accessToken, refreshToken);
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
    try {
      const stored = await authStorage.getStoredTokens();
      if (!stored) {
        set({ isHydrating: false });
        return;
      }

      try {
        const { user } = await authApi.me(stored.accessToken);
        set({
          user,
          accessToken: stored.accessToken,
          refreshToken: stored.refreshToken,
          isGuest: false,
          isHydrating: false,
        });
        return;
      } catch (err) {
        if (!(err instanceof ApiClientError) || err.status !== 401) {
          await authStorage.clearTokens();
          set({ isHydrating: false });
          return;
        }
      }

      const tokens = await authApi.refresh(stored.refreshToken);
      const { user } = await authApi.me(tokens.accessToken);
      await authStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
      set({
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isGuest: false,
        isHydrating: false,
      });
    } catch {
      await authStorage.clearTokens();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isHydrating: false,
      });
    }
  },

  signUp: async (email, password, displayName) => {
    set({ isSubmitting: true, error: null });
    try {
      const { user, tokens } = await authApi.register({ email, password, displayName });
      await persistSession(tokens.accessToken, tokens.refreshToken, user, set);
      set({ isSubmitting: false });
      return true;
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Could not create account. Try again.';
      set({ isSubmitting: false, error: message });
      return false;
    }
  },

  signIn: async (email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const { user, tokens } = await authApi.login({ email, password });
      await persistSession(tokens.accessToken, tokens.refreshToken, user, set);
      set({ isSubmitting: false });
      return true;
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Could not sign in. Try again.';
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
    await authStorage.clearTokens();
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

  isAuthenticated: () => !!get().user && !!get().accessToken,
  canUseApp: () => get().isAuthenticated() || get().isGuest,
}));
