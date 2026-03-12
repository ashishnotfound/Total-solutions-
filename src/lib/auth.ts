import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Higher-order function to protect API routes.
 * Wraps the route handler and blocks unauthorized access.
 */
export function withAdminAuth(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse> | NextResponse
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (req: NextRequest, ...args: any[]) => {
        try {
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return req.cookies.getAll();
                        },
                        setAll() { },
                    },
                }
            );

            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profile?.role !== "admin") {
                return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
            }

            return handler(req, ...args);
        } catch {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    };
}
