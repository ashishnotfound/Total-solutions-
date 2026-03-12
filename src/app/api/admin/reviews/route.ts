import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * GET /api/admin/reviews — List all reviews (including pending)
 * POST /api/admin/reviews — Create a review (admin use)
 */

export async function GET() {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return NextResponse.json({ reviews: data || [] });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message, reviews: [] }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from("reviews")
            .insert({
                name: body.name,
                company: body.company || null,
                rating: body.rating,
                text: body.text,
                photo: body.photo || null,
                video: body.video || null,
                audio: body.audio || null,
                status: body.status || "pending",
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/reviews");
        revalidatePath("/reviews");

        return NextResponse.json({ review: data }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
