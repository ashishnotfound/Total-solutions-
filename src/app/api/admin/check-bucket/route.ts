import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    // Temporarily bypass auth for testing
    try {
        const supabase = createServerClient();
        
        // List all buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
            return NextResponse.json({ 
                error: "Failed to list buckets", 
                details: bucketsError 
            }, { status: 500 });
        }

        // Check if gallery bucket exists
        const galleryBucket = buckets?.find(b => b.name === 'gallery');
        
        if (!galleryBucket) {
            // Try to create gallery bucket
            const { error: createError } = await supabase.storage.createBucket('gallery', {
                public: true,
                allowedMimeTypes: ["image/*", "video/mp4", "video/webm", "video/quicktime"],
                fileSizeLimit: 10485760 // 10MB
            });

            if (createError) {
                return NextResponse.json({ 
                    error: "Failed to create gallery bucket", 
                    details: createError 
                }, { status: 500 });
            }
        }

        // Test upload permissions with an image
        const testFileName = `test-${Date.now()}.jpg`;
        const testImageData = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]); // Minimal JPEG header
        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(testFileName, testImageData, {
                contentType: 'image/jpeg'
            });

        if (uploadError) {
            return NextResponse.json({ 
                error: "Upload test failed", 
                details: uploadError 
            }, { status: 500 });
        }

        // Clean up test file
        await supabase.storage.from('gallery').remove([testFileName]);

        return NextResponse.json({ 
            success: true,
            message: "Gallery bucket is ready",
            buckets: buckets?.map(b => b.name)
        });

    } catch (error) {
        console.error("Bucket check error:", error);
        return NextResponse.json({ 
            error: "Bucket check failed", 
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
