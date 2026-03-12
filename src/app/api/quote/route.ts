import { NextRequest, NextResponse } from "next/server";
import { submitQuote } from "@/lib/data";

/**
 * POST /api/quote — Submit a public quote request.
 * 
 * Saves to Supabase (if configured) and optionally sends an email
 * notification to the configured email address.
 */

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.name || !body.email || !body.phone) {
            return NextResponse.json(
                { error: "Name, email, and phone are required" },
                { status: 400 }
            );
        }

        // Save to database
        const result = await submitQuote({
            name: body.name,
            company: body.company,
            email: body.email,
            phone: body.phone,
            product: body.product,
            quantity: body.quantity,
            artworkUrl: body.artworkUrl,
            deliveryAddress: body.deliveryAddress,
            timeline: body.timeline,
            message: body.message,
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // TODO: Send email notification using Resend / SendGrid / Nodemailer
        // Example with Resend:
        //
        // import { Resend } from 'resend';
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //   from: 'noreply@totalsolutions.co.in',
        //   to: SITE.email,
        //   subject: `New Quote Request: ${body.product || 'General Inquiry'}`,
        //   html: `<h2>New Quote Request</h2>
        //     <p><strong>Name:</strong> ${body.name}</p>
        //     <p><strong>Company:</strong> ${body.company || 'N/A'}</p>
        //     <p><strong>Email:</strong> ${body.email}</p>
        //     <p><strong>Phone:</strong> ${body.phone}</p>
        //     <p><strong>Product:</strong> ${body.product || 'N/A'}</p>
        //     <p><strong>Quantity:</strong> ${body.quantity || 'N/A'}</p>
        //     <p><strong>Delivery:</strong> ${body.deliveryAddress || 'N/A'}</p>
        //     <p><strong>Timeline:</strong> ${body.timeline || 'N/A'}</p>
        //     <p><strong>Message:</strong> ${body.message || 'N/A'}</p>`,
        // });



        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
