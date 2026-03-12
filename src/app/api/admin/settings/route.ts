import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { withAdminAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * GET /api/admin/settings — Get all settings
 * PUT /api/admin/settings — Update settings (upsert)
 */

export const GET = withAdminAuth(async () => {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase.from("settings").select("*");
        if (error) throw error;

        // Convert array of { key, value } to object
        const settings: Record<string, unknown> = {};
        data?.forEach((row) => {
            settings[row.key] = row.value;
        });

        return NextResponse.json({ settings });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
});

export const PUT = withAdminAuth(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const supabase = createServerClient();

        // Upsert each setting
        const entries = Object.entries(body);

        for (const [key, value] of entries) {
            const { error } = await supabase
                .from("settings")
                .upsert({ key, value }, { onConflict: "key" });
            if (error) throw error;
        }

        // Clear cache
        revalidatePath("/", "layout");

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
});
