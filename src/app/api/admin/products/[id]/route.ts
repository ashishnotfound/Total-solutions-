import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * PUT /api/admin/products/[id] — Update a product
 * DELETE /api/admin/products/[id] — Delete a product
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
            .from("products")
            .update({
                slug: body.slug,
                category_id: body.category_id,
                name: body.name,
                short_description: body.short_description,
                description: body.description,
                specifications: body.specifications,
                materials: body.materials,
                image: body.image,
                gallery: body.gallery,
                featured: body.featured,
                price: body.price,
                sort_order: body.sort_order,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/products");
        revalidatePath("/products");
        revalidatePath(`/products/${data.slug}`);
        revalidatePath("/");

        return NextResponse.json({ product: data });
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
            .from("products")
            .delete({ count: 'exact' })
            .eq("id", cleanId);

        if (error) throw error;

        if (count === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        revalidatePath("/admin/products");
        revalidatePath("/products");
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
