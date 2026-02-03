import { headers } from 'next/headers';

const RESERVED_SUBDOMAINS = ['www', 'api', 'admin', 'dashboard', 'app'];

export async function getSubdomain(): Promise<string | null> {
  const headersList = await headers();
  const storedSubdomain = headersList.get('x-store-subdomain');
  if (storedSubdomain) {
    return storedSubdomain;
  }

  const host = headersList.get('host') || '';
  const hostname = host.split(':')[0];

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (!RESERVED_SUBDOMAINS.includes(subdomain)) {
      return subdomain;
    }
  }

  return null;
}
