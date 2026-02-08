'use client';

import Link from 'next/link';
import { User, LogOut, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import {
  NavItem,
  NavGroup,
  UserMenu,
  SearchBar,
  DashboardLayout,
  NotificationBell,
} from '@baazarify/ui';

import { useAuth } from '@/contexts/auth-context';
import { navSections } from '@/config/nav-config';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requireStore>
      <DashboardLayout
        sidebarHeader={
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-bold text-[var(--color-text-primary)]">Baazarify</span>
          </Link>
        }
        sidebarContent={
          <>
            {navSections.map((section) => (
              <NavGroup key={section.subheader} label={section.subheader}>
                {section.items.map((item) => (
                  <NavItem
                    key={item.path}
                    as={Link}
                    href={item.path}
                    icon={item.icon}
                    label={item.title}
                    badge={item.badge}
                    badgeVariant={item.badgeVariant}
                    active={pathname === item.path || pathname.startsWith(item.path + '/')}
                  />
                ))}
              </NavGroup>
            ))}
          </>
        }
        headerRightContent={
          <div className="flex items-center gap-1">
            <SearchBar placeholder="Search..." className="hidden md:block w-52" />
            <NotificationBell count={0} />
            {user && (
              <UserMenu
                as={Link}
                user={{
                  name: user.name || 'Merchant',
                  email: user.email,
                }}
                menuItems={[
                  {
                    label: 'Profile',
                    icon: <User size={16} />,
                    href: '/settings',
                  },
                  {
                    label: 'Settings',
                    icon: <Settings size={16} />,
                    href: '/settings',
                  },
                  { divider: true, label: '' },
                  {
                    label: 'Sign out',
                    icon: <LogOut size={16} />,
                    variant: 'danger' as const,
                    onClick: () => {
                      logout();
                      router.push('/login');
                    },
                  },
                ]}
              />
            )}
          </div>
        }
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
