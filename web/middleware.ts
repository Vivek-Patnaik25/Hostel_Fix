import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Protect Student Routes
        if (path.startsWith('/student') && token?.role !== 'student') {
            // Redirect non-students to their respective dashboards
            if (token?.role === 'staff') return NextResponse.redirect(new URL('/staff/dashboard', req.url));
            if (token?.role === 'admin') return NextResponse.redirect(new URL('/staff/dashboard', req.url)); // Admin uses staff dashboard for now
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Protect Staff Routes
        if (path.startsWith('/staff') && token?.role !== 'staff' && token?.role !== 'admin') {
            if (token?.role === 'student') return NextResponse.redirect(new URL('/student/dashboard', req.url));
            return NextResponse.redirect(new URL('/', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ['/student/:path*', '/staff/:path*', '/admin/:path*']
};
