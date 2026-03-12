import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip login page and public API routes
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    // Protect admin pages and admin API routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        try {
            // Create a Supabase client with cookie-based auth for middleware
            let response = NextResponse.next({
                request: { headers: request.headers },
            });

            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return request.cookies.getAll();
                        },
                        setAll(cookiesToSet) {
                            cookiesToSet.forEach(({ name, value }) =>
                                request.cookies.set(name, value)
                            );
                            response = NextResponse.next({
                                request: { headers: request.headers },
                            });
                            cookiesToSet.forEach(({ name, value, options }) =>
                                response.cookies.set(name, value, options)
                            );
                        },
                    },
                }
            );

            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                // For API routes, return 401
                if (pathname.startsWith("/api/admin")) {
                    return NextResponse.json(
                        { error: "Unauthorized" },
                        { status: 401 }
                    );
                }
                // For pages, redirect to login
                const url = request.nextUrl.clone();
                url.pathname = "/admin/login";
                return NextResponse.redirect(url);
            }

            return response;
        } catch {
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }
            const url = request.nextUrl.clone();
            url.pathname = "/admin/login";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
