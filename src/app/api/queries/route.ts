import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { withAdminAuth } from "@/lib/auth";

/**
 * GET /api/queries — List all queries (admin only)
 * POST /api/queries — Create a new query
 */

export const GET = withAdminAuth(async () => {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("queries")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ queries: data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = createServerClient();

        // Basic validation
        if (!body.message) {
            return NextResponse.json({
                error: "Missing required field: message"
            }, { status: 400 });
        }

        // Validate user information
        if (!body.userName || !body.userEmail || !body.userPhone) {
            return NextResponse.json({
                error: "Missing user information: userName, userEmail, userPhone"
            }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("queries")
            .insert({
                product_id: body.productId || null,
                product_name: body.productName || null,
                message: body.message,
                user_name: body.userName,
                user_email: body.userEmail,
                user_phone: body.userPhone,
                status: "pending",
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ query: data }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
