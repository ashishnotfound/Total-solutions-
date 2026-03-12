import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { withAdminAuth } from "@/lib/auth";

/**
 * GET /api/orders — List all orders (admin only)
 * POST /api/orders — Create a new order
 */

export const GET = withAdminAuth(async () => {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ orders: data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = createServerClient();

        // Basic validation
        const hasPrimaryProduct = body.productId && body.productName;
        const hasItemsArray = body.items && Array.isArray(body.items) && body.items.length > 0;

        if (!hasPrimaryProduct && !hasItemsArray) {
            return NextResponse.json({
                error: "Please select at least one product"
            }, { status: 400 });
        }

        if (!body.quantity && !hasItemsArray) {
            return NextResponse.json({ error: "Quantity is required" }, { status: 400 });
        }

        if (!body.deliveryAddress || !body.timeline) {
            return NextResponse.json({
                error: "Missing required fields: deliveryAddress, timeline"
            }, { status: 400 });
        }

        // Validate user information
        if (!body.userName || !body.userEmail || !body.userPhone) {
            return NextResponse.json({
                error: "Missing user information: userName, userEmail, userPhone"
            }, { status: 400 });
        }

        // Prepare items text for storage if no dedicated column
        let itemsText = "";
        if (body.items && Array.isArray(body.items)) {
            itemsText = body.items
                .map((item: {name: string, quantity: string}) => `- ${item.name}: ${item.quantity}`)
                .join("\n");
        }

        const notes = body.additionalNotes || "";
        const combinedNotes = itemsText 
            ? `ITEMS ORDERED:\n${itemsText}\n\nADDITIONAL NOTES:\n${notes}`
            : notes;

        const { data, error } = await supabase
            .from("orders")
            .insert({
                product_id: body.productId || "multi",
                product_name: body.productName || "Multiple Items",
                quantity: body.quantity || "See items",
                delivery_address: body.deliveryAddress,
                timeline: body.timeline,
                specifications: body.specifications || null,
                additional_notes: combinedNotes || null,
                user_name: body.userName,
                user_email: body.userEmail,
                user_phone: body.userPhone,
                status: "pending",
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ order: data }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
