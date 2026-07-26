import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Sun, Moon, LogOut, ChevronDown, User as UserIcon, Bell, Menu } from 'lucide-react';
import { authStore } from '@/stores/authStore';
import { themeStore, toggleTheme, toggleMobileMenu } from '@/stores/uiStore';
import { clearSession } from '@/stores/authStore';
import { isUsingMocks, logoutFromKeycloak } from '@/services/authService';
import { ROLE_LABELS } from '@/utils/roleLabels';

interface TopbarProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Topbar({ title, breadcrumbs = [] }: TopbarProps) {
  const { session } = useStore(authStore);
  const theme = useStore(themeStore);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    if (isUsingMocks()) {
      clearSession();
      window.location.href = '/login';
    } else {
      clearSession();
      logoutFromKeycloak();
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-primary-100 bg-white/90 px-4 backdrop-blur dark:border-primary-900/40 dark:bg-surface-darkCard/90 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-primary-900 dark:text-primary-50">{title}</h1>
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-primary-500 dark:text-primary-400">
            <a href="/dashboard" className="hover:text-primary-700 dark:hover:text-primary-200">
              Inicio
            </a>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1">
                <span aria-hidden="true">/</span>
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-primary-700 dark:hover:text-primary-200">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-primary-700 dark:text-primary-200">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
          aria-label="Notificaciones"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-500" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-primary-50 dark:hover:bg-primary-900/30"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-100">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-primary-900 dark:text-primary-50">
                {session?.user.name ?? 'Invitado'}
              </p>
              <p className="text-[11px] leading-tight text-primary-500 dark:text-primary-400">
                {session ? ROLE_LABELS[session.user.role] : ''}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-primary-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-primary-100 bg-white py-1 shadow-soft dark:border-primary-900/40 dark:bg-surface-darkCard">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-900/30"
              >
                Mi perfil
              </a>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
