import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * PUT /api/admin/quotes/[id] — Update quote status
 * DELETE /api/admin/quotes/[id] — Delete a quote
 */

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from("quotes")
            .update({ status: body.status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/quotes");

        return NextResponse.json({ quote: data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const supabase = createServerClient();
        const { error } = await supabase.from("quotes").delete().eq("id", id);
        if (error) throw error;

        revalidatePath("/admin/quotes");

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
