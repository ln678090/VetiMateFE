'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

import { APP_NAVIGATION_ITEMS, canAccessNavigationItem } from '@/config/app-navigation';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';
import { useAuthStore } from '@/stores/auth.store';

function getRoutePath(href: string): string {
  return href.split('?')[0] ?? href;
}

function isActiveRoute(pathname: string, href: string): boolean {
  const routePath = getRoutePath(href);

  if (routePath === '/dashboard') {
    return pathname === routePath;
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const authorities = useMemo(() => getAuthoritiesFromToken(accessToken), [accessToken]);

  const groupedItems = useMemo(() => {
    const visible = APP_NAVIGATION_ITEMS.filter(
      (item) => item.showInSidebar !== false && canAccessNavigationItem(item, authorities)
    );

    const groups: Record<string, typeof visible> = {};
    const ungrouped: typeof visible = [];

    visible.forEach((item) => {
      if (item.group) {
        if (!groups[item.group]) groups[item.group] = [];
        groups[item.group].push(item);
      } else {
        ungrouped.push(item);
      }
    });

    return { groups, ungrouped };
  }, [authorities]);

  const displayName = user?.fullName ?? user?.username ?? 'Tài khoản';

  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || 'U';

  function closeMobileSidebar() {
    setMobileOpen(false);
  }

  function toggleDesktopSidebar() {
    setCollapsed((current) => !current);
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
        {!collapsed && (
          <Link href="/" onClick={closeMobileSidebar} className="font-bold tracking-tight">
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              PetCare
            </span>
          </Link>
        )}

        <button
          type="button"
          onClick={toggleDesktopSidebar}
          className="hidden rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:inline-flex dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
        </button>

        <button
          type="button"
          onClick={closeMobileSidebar}
          className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:hidden dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label="Đóng menu"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav aria-label="Điều hướng chính" className="flex-1 space-y-4 overflow-y-auto p-3">
        {groupedItems.ungrouped.length > 0 && (
          <div className="space-y-1">
            {groupedItems.ungrouped.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  onClick={closeMobileSidebar}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'flex h-11 items-center rounded-xl transition-all',
                    collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                    active
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-rose-400',
                  ].join(' ')}
                >
                  <Icon className="size-5 shrink-0" strokeWidth={2} />
                  {!collapsed && <span className="truncate text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        )}

        {Object.entries(groupedItems.groups).map(([groupName, items]) => (
          <div key={groupName} className="space-y-1">
            {!collapsed ? (
              <h3 className="mb-2 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {groupName}
              </h3>
            ) : (
              <div className="my-4 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
            )}

            {items.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  onClick={closeMobileSidebar}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'flex h-11 items-center rounded-xl transition-all',
                    collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                    active
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm'
                      : 'text-zinc-600 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-rose-400',
                  ].join(' ')}
                >
                  <Icon className="size-5 shrink-0" strokeWidth={2} />
                  {!collapsed && <span className="truncate text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
        <div
          className={[
            'flex items-center rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900',
            collapsed ? 'justify-center' : 'gap-3',
          ].join(' ')}
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-sm font-semibold text-white">
            {avatarLetter}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                {displayName}
              </p>

              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {authorities.join(', ') || 'Đang xác thực'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-700 shadow-sm lg:hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
        aria-label="Mở menu"
        aria-expanded={mobileOpen}
      >
        <Menu className="size-5" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex bg-white transition-all duration-300 dark:bg-zinc-950',
          'lg:static lg:z-auto',
          collapsed ? 'lg:w-20' : 'lg:w-72',
          mobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex w-full flex-col border-r border-zinc-200 dark:border-zinc-800">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
