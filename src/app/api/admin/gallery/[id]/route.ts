import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * DELETE /api/admin/gallery/[id] — Delete a gallery item
 */

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const cleanId = id.trim();
        const supabase = createServerClient();

        const { error, count } = await supabase
            .from("gallery")
            .delete({ count: 'exact' })
            .eq("id", cleanId);

        if (error) throw error;

        if (count === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        revalidatePath("/admin/gallery");
        revalidatePath("/gallery");
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
