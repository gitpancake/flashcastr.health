import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const username = process.env.BASIC_AUTH_USERNAME;
    const password = process.env.BASIC_AUTH_PASSWORD;

    // Skip auth if credentials not configured
    if (!username || !password) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // Allow access to login page and auth API
    if (pathname === "/login" || pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Check for session cookie
    const sessionCookie = request.cookies.get("auth_session");

    if (!sessionCookie?.value) {
        // Redirect to login page
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
