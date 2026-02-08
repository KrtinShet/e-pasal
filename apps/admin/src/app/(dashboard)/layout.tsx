'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem, NavGroup, useSidebar, DashboardLayout } from '@baazarify/ui';

import { adminNavItems } from '@/config/nav-config';

function AdminSidebarBrand() {
  const { collapsed } = useSidebar();

  return (
    <Link href="/" className="flex items-center gap-2 px-3 py-2">
      <span className="text-lg font-bold">{collapsed ? 'B' : 'Baazarify Admin'}</span>
    </Link>
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <DashboardLayout
      sidebarStorageKey="baazarify.admin.sidebar.collapsed"
      sidebarHeader={<AdminSidebarBrand />}
      sidebarContent={
        <NavGroup>
          {adminNavItems.map((item) => (
            <NavItem
              key={item.href}
              as={Link}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/')
              }
            />
          ))}
        </NavGroup>
      }
    >
      {children}
    </DashboardLayout>
  );
}
