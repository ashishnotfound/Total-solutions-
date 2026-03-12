import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * GET /api/admin/gallery — List all gallery items
 * POST /api/admin/gallery — Create a gallery item
 */

export async function GET() {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("sort_order");
        if (error) throw error;
        return NextResponse.json({ gallery: data || [] });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message, gallery: [] }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from("gallery")
            .insert({
                title: body.title,
                category: body.category,
                type: body.type || "image",
                src: body.src,
                thumbnail: body.thumbnail || body.src,
                sort_order: body.sort_order || 0,
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/gallery");
        revalidatePath("/gallery");
        revalidatePath("/");

        return NextResponse.json({ item: data }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
