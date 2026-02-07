import type { NavBasicItemBaseProps } from '../../components/nav-basic';

export const navConfig: NavBasicItemBaseProps[] = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Components',
    path: '/components',
  },
  {
    title: 'Pages',
    path: '/pages',
    children: [
      { title: 'About us', path: '/about' },
      { title: 'Contact us', path: '/contact' },
      { title: 'FAQs', path: '/faqs' },
      { title: 'Pricing', path: '/pricing' },
    ],
  },
  {
    title: 'Docs',
    path: '/docs',
  },
];
