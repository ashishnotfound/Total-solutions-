import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * GET /api/admin/categories — List all categories
 * POST /api/admin/categories — Create a new category
 */

export async function GET() {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("sort_order");

        if (error) throw error;
        return NextResponse.json({ categories: data || [] });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message, categories: [] }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = createServerClient();
        const body = await req.json();

        // Basic validation
        if (!body.id || !body.name || !body.slug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("categories")
            .upsert({
                id: body.id,
                slug: body.slug,
                name: body.name,
                description: body.description || null,
                image: body.image || null,
                icon: body.icon || "Package",
                sort_order: body.sort_order || 0,
            }, { onConflict: "id" })
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
