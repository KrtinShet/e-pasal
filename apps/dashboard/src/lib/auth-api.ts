import { setTokens, apiRequest, clearTokens } from './api';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  storeId?: string;
  phone?: string;
  hasStore: boolean;
  onboardingCompleted: boolean;
  emailVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: AuthUser;
    tokens: AuthTokens;
  };
}

interface RegisterResponse {
  success: boolean;
  data: {
    user: AuthUser;
    tokens: AuthTokens;
  };
}

interface MeResponse {
  success: boolean;
  data: AuthUser;
}

interface OnboardingResponse {
  success: boolean;
  data: {
    user: AuthUser;
    store: {
      id: string;
      name: string;
      subdomain: string;
    };
    tokens: AuthTokens;
  };
}

export type { AuthUser, AuthTokens };

export async function loginApi(email: string, password: string) {
  const res = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
  return res.data;
}

export async function registerApi(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}) {
  const res = await apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
  return res.data;
}

export async function getMeApi() {
  const res = await apiRequest<MeResponse>('/auth/me');
  return res.data;
}

export async function logoutApi() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export async function forgotPasswordApi(email: string) {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordApi(token: string, password: string) {
  const res = await apiRequest<LoginResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
  setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
  return res.data;
}

export async function completeOnboardingApi(data: {
  storeName: string;
  subdomain: string;
  description?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  logo?: string;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}) {
  const res = await apiRequest<OnboardingResponse>('/onboarding/complete', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
  return res.data;
}

export async function checkSubdomainApi(subdomain: string) {
  const res = await apiRequest<{ success: boolean; data: { available: boolean } }>(
    `/stores/check/${encodeURIComponent(subdomain)}`
  );
  return res.data.available;
}
