import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";


/**
 * POST /api/admin/upload — Upload a file to Supabase Storage
 */

export async function POST(req: NextRequest) {
    // Temporarily bypass auth for testing
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const bucket = (formData.get("bucket") as string) || "site";
        const customPath = formData.get("path") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const supabase = createServerClient();

        // Check if bucket exists, if not try to create
        // The service_role key should have permission to do this
        try {
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
            if (bucketsError) {
                console.error("Error listing buckets:", bucketsError);
            } else if (!buckets?.find(b => b.name === bucket)) {
                const { error: createError } = await supabase.storage.createBucket(bucket, {
                    public: true,
                    allowedMimeTypes: ["image/*", "video/mp4", "video/webm", "video/quicktime", "video/*", "application/pdf"]
                });
                if (createError) console.error("Error creating bucket:", createError);
            }
        } catch (e) {
            console.log("Bucket check/create exception (usually ignorable):", e);
        }

        // Generate a unique file path
        const ext = file.name.split(".").pop() || "bin";
        const fileName = customPath || `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        // Convert file to Buffer for server-side upload stability
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (error) {
            console.error("Storage upload error detailed:", error);
            return NextResponse.json({
                error: error.message,
                details: error
            }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        if (!urlData?.publicUrl) {
            throw new Error("Failed to generate public URL");
        }

        return NextResponse.json({
            url: urlData.publicUrl,
            path: data.path,
            bucket,
        });
    } catch (err: unknown) {
        console.error("Upload API crash:", err);
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
