const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';
const STATIC_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN;

function getToken() {
  if (typeof window === 'undefined') {
    return STATIC_TOKEN;
  }

  return window.localStorage.getItem('baazarify_token') ?? STATIC_TOKEN;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has('content-type') && !(options.body instanceof FormData)) {
    headers.set('content-type', 'application/json');
  }

  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message ?? 'Request failed';
    throw new Error(message);
  }

  return data as T;
}
