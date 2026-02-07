import {
  Users,
  Palette,
  Package,
  Settings,
  PanelLeft,
  ShoppingCart,
  LayoutDashboard,
} from 'lucide-react';

export interface NavConfigItem {
  icon: React.ReactNode;
  title: string;
  path: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export interface NavSection {
  subheader: string;
  items: NavConfigItem[];
}

export const navSections: NavSection[] = [
  {
    subheader: 'Overview',
    items: [
      { icon: <LayoutDashboard size={20} />, title: 'Dashboard', path: '/dashboard' },
    ],
  },
  {
    subheader: 'Management',
    items: [
      { icon: <ShoppingCart size={20} />, title: 'Orders', path: '/orders' },
      { icon: <Package size={20} />, title: 'Products', path: '/products' },
      { icon: <Users size={20} />, title: 'Customers', path: '/customers' },
    ],
  },
  {
    subheader: 'Store',
    items: [
      { icon: <Palette size={20} />, title: 'Theme', path: '/store/theme' },
      { icon: <PanelLeft size={20} />, title: 'Landing Page', path: '/store/landing-page' },
      { icon: <Settings size={20} />, title: 'Settings', path: '/settings' },
    ],
  },
];

export const navConfig: NavConfigItem[] = navSections.flatMap((s) => s.items);
