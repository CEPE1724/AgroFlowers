import { useStore } from '@nanostores/react';
import clsx from 'clsx';
import { Flower2, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { authStore } from '@/stores/authStore';
import { sidebarCollapsedStore, toggleSidebar, mobileMenuOpenStore, closeMobileMenu } from '@/stores/uiStore';
import { hasAnyRole, PERMISSIONS } from '@/utils/permissions';
import { navItems } from './navConfig';

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  const { session } = useStore(authStore);
  const collapsed = useStore(sidebarCollapsedStore);
  const mobileOpen = useStore(mobileMenuOpenStore);

  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true;
    if (!session) return false;
    return hasAnyRole(PERMISSIONS[item.permission] as never);
  });

  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 flex h-full flex-col border-r border-primary-100 bg-white transition-all duration-200 dark:border-primary-900/40 dark:bg-surface-darkCard',
          collapsed ? 'md:w-[76px]' : 'md:w-64',
          'w-64 transition-transform',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
      <div className="flex h-16 items-center gap-2 border-b border-primary-100 px-4 dark:border-primary-900/40">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Flower2 className="h-5 w-5" />
        </div>
        {showLabels && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-primary-800 dark:text-primary-100">AgroFlowers AI</p>
            <p className="truncate text-[11px] text-primary-500 dark:text-primary-400">Exportación de flores</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4" aria-label="Navegación principal">
        {visibleItems.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-900/30'
              )}
              title={!showLabels ? item.label : undefined}
              onClick={closeMobileMenu}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {showLabels && <span className="truncate">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      <div className="hidden border-t border-primary-100 p-2 dark:border-primary-900/40 md:block">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-primary-500 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30"
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
        </button>
      </div>
      </aside>
    </>
  );
}
