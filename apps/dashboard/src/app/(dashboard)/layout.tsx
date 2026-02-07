'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem, NavGroup, DashboardLayout } from '@baazarify/ui';

import { navConfig } from '@/config/nav-config';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute requireStore>
      <DashboardLayout
        sidebarHeader={
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2">
            <span className="text-lg font-bold">Baazarify</span>
          </Link>
        }
        sidebarContent={
          <NavGroup>
            {navConfig.map((item) => (
              <NavItem
                key={item.path}
                as={Link}
                href={item.path}
                icon={item.icon}
                label={item.title}
                badge={item.badge}
                active={pathname === item.path || pathname.startsWith(item.path + '/')}
              />
            ))}
          </NavGroup>
        }
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
