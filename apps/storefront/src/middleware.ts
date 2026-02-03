import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RESERVED_SUBDOMAINS = ['www', 'api', 'admin', 'dashboard', 'app'];

function extractSubdomain(host: string): string | null {
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

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl;

  let subdomain = extractSubdomain(host);

  if (!subdomain) {
    subdomain =
      request.headers.get('x-subdomain') ||
      url.searchParams.get('store') ||
      request.cookies.get('store')?.value ||
      null;
  }

  if (subdomain) {
    const response = NextResponse.next();
    response.headers.set('x-store-subdomain', subdomain);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
