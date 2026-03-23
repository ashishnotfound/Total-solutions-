import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const bucket = searchParams.get('bucket');

        if (!bucket) {
            return NextResponse.json({ 
                error: "Missing bucket parameter" 
            }, { status: 400 });
        }

        const supabase = createServerClient();

        // List files in bucket
        const { data, error } = await supabase.storage
            .from(bucket)
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error("Storage list error:", error);
            return NextResponse.json({ 
                error: error.message 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true,
            files: data || []
        });

    } catch (error) {
        console.error("List files API error:", error);
        return NextResponse.json({ 
            error: "Failed to list files" 
        }, { status: 500 });
    }
}
