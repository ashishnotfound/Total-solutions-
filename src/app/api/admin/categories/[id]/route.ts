import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * PUT /api/admin/categories/[id] — Update a category
 * DELETE /api/admin/categories/[id] — Delete a category
 */

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const supabase = createServerClient();
        const body = await req.json();

        const { data, error } = await supabase
            .from("categories")
            .update({
                slug: body.slug,
                name: body.name,
                description: body.description,
                image: body.image,
                icon: body.icon,
                sort_order: body.sort_order,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/categories");
        revalidatePath("/products");
        revalidatePath("/");

        return NextResponse.json({ category: data });
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
        const cleanId = id.trim();
        const supabase = createServerClient();

        const { error, count } = await supabase
            .from("categories")
            .delete({ count: 'exact' })
            .eq("id", cleanId);

        if (error) throw error;

        if (count === 0) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        revalidatePath("/admin/categories");
        revalidatePath("/products");
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
