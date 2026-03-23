import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const { path, bucket } = await req.json();

        if (!path || !bucket) {
            return NextResponse.json({ 
                error: "Missing path or bucket" 
            }, { status: 400 });
        }

        const supabase = createServerClient();

        // Delete file from Supabase Storage
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            console.error("Storage delete error:", error);
            return NextResponse.json({ 
                error: error.message 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true,
            message: "File deleted successfully"
        });

    } catch (error) {
        console.error("Delete API error:", error);
        return NextResponse.json({ 
            error: "Delete failed" 
        }, { status: 500 });
    }
}
