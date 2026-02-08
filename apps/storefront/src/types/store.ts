import type { LandingPagesConfig } from '@baazarify/storefront-builder';

export interface StoreTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily?: string;
  preset?: string;
  tokens?: Record<string, unknown>;
}

export interface StoreSettings {
  currency: string;
  timezone: string;
  language: string;
  theme: StoreTheme;
}

export interface StoreContact {
  email?: string;
  phone?: string;
  address?: string;
}

export interface StoreSocial {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface StoreLandingPage {
  config?: LandingPagesConfig;
  draftConfig?: LandingPagesConfig;
}

export interface StoreData {
  _id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'free' | 'starter' | 'business' | 'platinum';
  settings: StoreSettings;
  contact: StoreContact;
  social: StoreSocial;
  landingPage?: StoreLandingPage;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
