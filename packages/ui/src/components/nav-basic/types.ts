import type { ReactNode, HTMLAttributes } from 'react';

export type NavBasicItemBaseProps = {
  title: string;
  path: string;
  icon?: ReactNode;
  caption?: string;
  children?: NavBasicItemBaseProps[];
};

export type NavBasicItemStateProps = {
  depth?: number;
  open?: boolean;
  active?: boolean;
  hasChild?: boolean;
  externalLink?: boolean;
};

export type NavBasicSlotProps = {
  rootItem?: string;
  subItem?: string;
};

export type NavBasicListProps = {
  data: NavBasicItemBaseProps;
  depth: number;
  slotProps?: NavBasicSlotProps;
};

export type NavBasicSubListProps = {
  data: NavBasicItemBaseProps[];
  depth: number;
  slotProps?: NavBasicSlotProps;
};

export type NavBasicProps = HTMLAttributes<HTMLElement> & {
  data: NavBasicItemBaseProps[];
  slotProps?: NavBasicSlotProps;
};
