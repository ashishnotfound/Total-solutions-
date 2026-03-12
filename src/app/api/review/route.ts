import { NextRequest, NextResponse } from "next/server";
import { submitReview } from "@/lib/data";

/**
 * POST /api/review — Submit a public review.
 * 
 * Review is saved with status "pending" — admin must approve it
 * before it shows on the public site.
 */

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.name || !body.text || !body.rating) {
            return NextResponse.json(
                { error: "Name, text, and rating are required" },
                { status: 400 }
            );
        }

        if (body.rating < 1 || body.rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        const result = await submitReview({
            name: body.name,
            company: body.company,
            rating: body.rating,
            text: body.text,
            photo: body.photo,
            video: body.video,
            audio: body.audio,
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
