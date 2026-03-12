import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { withAdminAuth } from "@/lib/auth";

/**
 * PUT /api/orders/[id] — Update order status
 * DELETE /api/orders/[id] — Delete an order
 */

export const PUT = withAdminAuth(async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const supabase = createServerClient();

        // Validate status
        const validStatuses = ['pending', 'contacted', 'confirmed', 'rejected'];
        if (!body.status || !validStatuses.includes(body.status)) {
            return NextResponse.json({
                error: "Invalid status. Must be one of: pending, contacted, confirmed, rejected"
            }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("orders")
            .update({
                status: body.status,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ order: data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
});

export const DELETE = withAdminAuth(async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await context.params;
        const supabase = createServerClient();

        const { error } = await supabase
            .from("orders")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
});
