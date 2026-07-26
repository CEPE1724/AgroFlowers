import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'agroflowers_theme';
const SIDEBAR_KEY = 'agroflowers_sidebar_collapsed';

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredSidebar(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(SIDEBAR_KEY) === 'true';
}

export const themeStore = atom<Theme>('light');
export const sidebarCollapsedStore = atom<boolean>(false);
export const mobileMenuOpenStore = atom<boolean>(false);

export function toggleMobileMenu(): void {
  mobileMenuOpenStore.set(!mobileMenuOpenStore.get());
}

export function closeMobileMenu(): void {
  mobileMenuOpenStore.set(false);
}

function applySidebarAttribute(collapsed: boolean): void {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.sidebarCollapsed = String(collapsed);
  }
}

export function initUi(): void {
  const theme = readStoredTheme();
  applyTheme(theme);
  const collapsed = readStoredSidebar();
  sidebarCollapsedStore.set(collapsed);
  applySidebarAttribute(collapsed);
}

export function applyTheme(theme: Theme): void {
  themeStore.set(theme);
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_KEY, theme);
  }
}

export function toggleTheme(): void {
  applyTheme(themeStore.get() === 'dark' ? 'light' : 'dark');
}

export function toggleSidebar(): void {
  const next = !sidebarCollapsedStore.get();
  sidebarCollapsedStore.set(next);
  applySidebarAttribute(next);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SIDEBAR_KEY, String(next));
  }
}
