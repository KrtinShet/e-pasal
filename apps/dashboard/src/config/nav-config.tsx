import { Home, Users, Palette, Package, Settings, PanelLeft, ShoppingCart } from 'lucide-react';

export interface NavConfigItem {
  icon: React.ReactNode;
  title: string;
  path: string;
  badge?: string | number;
}

export const navConfig: NavConfigItem[] = [
  { icon: <Home size={20} />, title: 'Dashboard', path: '/dashboard' },
  { icon: <ShoppingCart size={20} />, title: 'Orders', path: '/orders' },
  { icon: <Package size={20} />, title: 'Products', path: '/products' },
  { icon: <Users size={20} />, title: 'Customers', path: '/customers' },
  { icon: <Palette size={20} />, title: 'Theme', path: '/store/theme' },
  { icon: <PanelLeft size={20} />, title: 'Landing Page', path: '/store/landing-page' },
  { icon: <Settings size={20} />, title: 'Settings', path: '/settings' },
];
