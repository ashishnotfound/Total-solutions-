"use server";

import { submitQuote, submitReview } from "@/lib/data";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "totalsolutionsnoida@gmail.com";

async function uploadFile(file: File, bucket: string) {
    if (!file || file.size === 0) return null;

    const supabase = createServerClient();
    const ext = file.name.split(".").pop() || "bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true,
        });

    if (error) {
        console.error(`Upload to ${bucket} failed:`, error);
        return null;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData?.publicUrl || null;
}

export async function handleQuoteSubmission(formData: FormData) {
    const file = formData.get("artwork") as File;
    let artworkUrl = null;

    if (file && file.size > 0) {
        // Limit to 50MB as per requirement
        if (file.size > 50 * 1024 * 1024) {
            return { success: false, error: "File size exceeds 50MB limit." };
        }
        artworkUrl = await uploadFile(file, "quotes");
    }

    const name = (formData.get("name") as string) || "";
    // Basic spam protection
    if (name.toUpperCase().includes("DISCORD_") || name.includes("http") || name.includes("webhook")) {
        return { success: false, error: "Submission rejected due to potential spam content." };
    }

    const data = {
        name: formData.get("name") as string,
        company: (formData.get("company") as string) || undefined,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        product: (formData.get("product") as string) || undefined,
        quantity: (formData.get("quantity") as string) || undefined,
        artworkUrl: artworkUrl || undefined,
        deliveryAddress: (formData.get("deliveryAddress") as string) || undefined,
        timeline: (formData.get("timeline") as string) || undefined,
        message: (formData.get("message") as string) || undefined,
    };

    const result = await submitQuote(data);

    if (result.success && resend) {
        try {
            await resend.emails.send({
                from: "Total Solutions <noreply@resend.dev>",
                to: [ADMIN_EMAIL],
                subject: `New Quote Request from ${data.name}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 12px;">
                        <h1 style="color: #1FA352; font-size: 24px;">New Quote Request</h1>
                        <p style="font-size: 16px;">You have received a new lead from the website.</p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; color: #64748b;">Name:</td><td style="padding: 8px 0; font-weight: bold;">${data.name}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;">Email:</td><td style="padding: 8px 0; font-weight: bold;">${data.email}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0; font-weight: bold;">${data.phone}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;">Product:</td><td style="padding: 8px 0; font-weight: bold;">${data.product || "Not specified"}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;">Quantity:</td><td style="padding: 8px 0; font-weight: bold;">${data.quantity || "N/A"}</td></tr>
                            <tr><td style="padding: 8px 0; color: #64748b;">Timeline:</td><td style="padding: 8px 0; font-weight: bold;">${data.timeline || "N/A"}</td></tr>
                        </table>
                        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; borderRadius: 8px;">
                            <p style="margin: 0; font-size: 14px; color: #64748b; margin-bottom: 8px;">Message:</p>
                            <p style="margin: 0; font-size: 15px; line-height: 1.6;">${data.message || "No message provided."}</p>
                        </div>
                        ${artworkUrl ? `
                        <div style="margin-top: 20px;">
                            <a href="${artworkUrl}" style="display: inline-block; padding: 12px 24px; background: #1FA352; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Artwork File</a>
                        </div>
                        ` : ''}
                    </div>
                `
            });
        } catch (error) {
            console.error("Failed to send email", error);
        }
    }

    return result;
}

export async function handleReviewSubmission(formData: FormData) {
    try {
        const photoFile = formData.get("photo") as File;
        let photoUrl = null;

        if (photoFile && photoFile.size > 0) {
            photoUrl = await uploadFile(photoFile, "reviews");
        }

        const ratingRaw = formData.get("rating");
        const rating = ratingRaw ? parseInt(ratingRaw as string) : 5;

        const data = {
            name: (formData.get("name") as string) || "Anonymous",
            company: (formData.get("company") as string) || undefined,
            rating: isNaN(rating) ? 5 : rating,
            text: (formData.get("text") as string) || "",
            photo: photoUrl || undefined,
        };

        if (!data.text) {
            return { success: false, error: "Review text is required." };
        }

        const result = await submitReview(data);

        if (result.success && resend) {
            try {
                await resend.emails.send({
                    from: "Total Solutions <noreply@resend.dev>",
                    to: [ADMIN_EMAIL],
                    subject: `New Review Submitted by ${data.name}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 12px;">
                            <h1 style="color: #FF6B1A; font-size: 24px;">New Review Received</h1>
                            <p style="font-size: 16px;">A new customer review has been submitted and is pending approval.</p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                            <p><strong>Name:</strong> ${data.name}</p>
                            <p><strong>Rating:</strong> ${"⭐".repeat(data.rating)} (${data.rating}/5)</p>
                            <p style="background: #fff8f1; padding: 16px; border-left: 4px solid #FF6B1A;">"${data.text}"</p>
                            <p style="font-size: 0.85rem; color: #64748b;">Review ID: ${Math.random().toString(36).slice(2, 10).toUpperCase()}</p>
                            <p><a href="https://totalsolutions.vercel.app/admin/reviews">Go to Admin Panel to Approve</a></p>
                        </div>
                    `
                });
            } catch (error) {
                console.error("Failed to send email", error);
            }
        }

        return result;
    } catch (error) {
        console.error("handleReviewSubmission final error:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." };
    }
}
