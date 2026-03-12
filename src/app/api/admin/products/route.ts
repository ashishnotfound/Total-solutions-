import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * GET /api/admin/products — List all products
 * POST /api/admin/products — Create a new product
 */

export async function GET() {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("products")
            .select("*, categories(name)")
            .order("sort_order");
        if (error) throw error;
        return NextResponse.json({ products: data || [] });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message, products: [] }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = createServerClient();

        // Basic validation
        if (!body.id || !body.name || !body.slug) {
            return NextResponse.json({ error: "Missing required fields: id, name, slug" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("products")
            .upsert({
                id: body.id,
                slug: body.slug,
                category_id: body.category_id,
                name: body.name,
                short_description: body.short_description,
                description: body.description,
                specifications: body.specifications || [],
                materials: body.materials || [],
                image: body.image,
                gallery: body.gallery || [],
                featured: body.featured || false,
                price: body.price || null,
                sort_order: body.sort_order || 0,
            }, { onConflict: "id" })
            .select()
            .single();

        if (error) throw error;

        // Clear cache
        revalidatePath("/admin/products");
        revalidatePath("/products");
        revalidatePath("/");

        return NextResponse.json({ product: data }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
