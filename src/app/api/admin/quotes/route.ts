import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET /api/admin/quotes — List all quote requests
 */

export async function GET() {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("quotes")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return NextResponse.json({ quotes: data || [] });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message, quotes: [] }, { status: 500 });
    }
}
