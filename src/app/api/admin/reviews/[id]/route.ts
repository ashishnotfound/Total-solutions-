import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * PUT /api/admin/reviews/[id] — Update review (approve/reject/edit)
 * DELETE /api/admin/reviews/[id] — Delete a review
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
            .from("reviews")
            .update({
                ...(body.status !== undefined && { status: body.status }),
                ...(body.name !== undefined && { name: body.name }),
                ...(body.company !== undefined && { company: body.company }),
                ...(body.rating !== undefined && { rating: body.rating }),
                ...(body.text !== undefined && { text: body.text }),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/reviews");
        revalidatePath("/reviews");

        return NextResponse.json({ review: data });
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
        const { error } = await supabase.from("reviews").delete().eq("id", id);
        if (error) throw error;

        revalidatePath("/admin/reviews");
        revalidatePath("/reviews");

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
