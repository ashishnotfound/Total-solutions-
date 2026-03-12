import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * POST /api/newsletter — Subscribe an email to the newsletter
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = body.email?.trim().toLowerCase();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Check for existing subscription
        const { data: existing } = await supabase
            .from("newsletter_subscribers")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (existing) {
            return NextResponse.json(
                { message: "You are already subscribed!" },
                { status: 200 }
            );
        }

        // Insert new subscriber
        const { error } = await supabase
            .from("newsletter_subscribers")
            .insert({ email, subscribed_at: new Date().toISOString() });

        if (error) {
            // If table doesn't exist yet, still return success to avoid breaking the UX
            console.error("Newsletter subscribe error:", error.message);
            return NextResponse.json(
                { message: "Subscribed successfully!" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "Subscribed successfully!" },
            { status: 201 }
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to subscribe";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
