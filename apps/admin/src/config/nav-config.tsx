import { Home, Store, Users, Settings, BarChart3 } from 'lucide-react';

export const adminNavItems = [
  { href: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { href: '/stores', label: 'Stores', icon: <Store size={20} /> },
  { href: '/users', label: 'Users', icon: <Users size={20} /> },
  { href: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { href: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];
