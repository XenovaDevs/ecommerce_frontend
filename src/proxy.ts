import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const apiOrigin = (() => {
    try {
      return new URL(apiBaseUrl).origin;
    } catch {
      return 'http://localhost:8000';
    }
  })();

  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  const headers = response.headers;

  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-DNS-Prefetch-Control', 'on');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('X-XSS-Protection', '0');

  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    'https://sdk.mercadopago.com',
    'https://www.mercadopago.com',
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ].join(' ');

  const connectSrc = [
    "'self'",
    'https://api.mercadopago.com',
    apiOrigin,
    ...(isDevelopment ? ['ws:', 'wss:'] : []),
  ].join(' ');

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' blob: https:",
    `connect-src ${connectSrc}`,
    "frame-src 'self' https://sdk.mercadopago.com https://www.mercadopago.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  headers.set('Content-Security-Policy', csp);
  headers.set('x-nonce', nonce);

  return response;
}

export const proxyConfig = {
  matcher: ['/((?!_next|favicon.ico|images/).*)'],
};
