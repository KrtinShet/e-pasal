import type { ReactNode, HTMLAttributes } from 'react';

export type NavItemBaseProps = {
  title: string;
  path: string;
  icon?: ReactNode;
  info?: ReactNode;
  caption?: string;
  disabled?: boolean;
  roles?: string[];
  children?: NavItemBaseProps[];
};

export type NavItemStateProps = {
  depth?: number;
  open?: boolean;
  active?: boolean;
  hasChild?: boolean;
  currentRole?: string;
  externalLink?: boolean;
};

export type SlotProps = {
  gap?: number;
  currentRole?: string;
};

export type NavListProps = {
  data: NavItemBaseProps;
  depth: number;
  slotProps?: SlotProps;
};

export type NavSubListProps = {
  data: NavItemBaseProps[];
  depth: number;
  slotProps?: SlotProps;
};

export type NavGroupProps = {
  subheader?: string;
  items: NavItemBaseProps[];
  slotProps?: SlotProps;
};

export type NavSectionProps = HTMLAttributes<HTMLElement> & {
  data: {
    subheader: string;
    items: NavItemBaseProps[];
  }[];
  slotProps?: SlotProps;
};
