import { atom } from 'nanostores';
import type { AuthState, Session } from '@/types/auth';

const STORAGE_KEY = 'agroflowers_session';

const initialState: AuthState = {
  session: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authStore = atom<AuthState>(initialState);

function readStoredSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as Session;
    if (session.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function initAuth(): void {
  const session = readStoredSession();
  authStore.set({
    session,
    isAuthenticated: Boolean(session),
    isLoading: false,
  });
}

export function setSession(session: Session): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  authStore.set({ session, isAuthenticated: true, isLoading: false });
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  authStore.set({ session: null, isAuthenticated: false, isLoading: false });
}

export function getSession(): Session | null {
  return authStore.get().session;
}
