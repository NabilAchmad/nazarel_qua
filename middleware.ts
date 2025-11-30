// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const url = request.nextUrl.clone();

    // Jika user mau ke halaman admin tapi tidak ada token -> login
    if (url.pathname.startsWith('/admin')) {
        if (!token) {
            url.pathname = '/auth/login';
            return NextResponse.redirect(url);
        }
    }

    // Jika user sudah login tapi mau ke halaman login -> dashboard
    if (url.pathname.startsWith('/auth/login')) {
        if (token) {
            url.pathname = '/admin/dashboard';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/auth/login'],
};