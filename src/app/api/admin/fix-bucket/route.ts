import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = createServerClient();
        const buckets = ['site', 'quotes', 'reviews', 'categories', 'gallery', 'products'];
        const results = [];

        for (const bucket of buckets) {
            console.log(`Updating bucket '${bucket}'...`);
            // Try to create if doesn't exist, then update
            try {
                await supabase.storage.createBucket(bucket, { public: true });
            } catch (e) { }

            const { data, error } = await supabase.storage.updateBucket(bucket, {
                allowedMimeTypes: ["image/*", "video/mp4", "video/webm", "video/quicktime", "video/*", "application/pdf"],
                public: true
            });

            if (error) {
                console.error(`Error updating bucket ${bucket}:`, error);
                results.push({ bucket, error: error.message });
            } else {
                results.push({ bucket, success: true });
            }
        }

        return NextResponse.json({ success: true, results });
    } catch {
        return NextResponse.json({ error: "Catch block" }, { status: 500 });
    }
}
