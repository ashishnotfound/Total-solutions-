import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD } from "@/lib/constants";

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();
        const adminPassword = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD;

        if (password === adminPassword) {
            const response = NextResponse.json({ success: true });

            // Set a secure, HTTP-only cookie
            response.cookies.set("admin_session", adminPassword, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            return response;
        }

        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    } catch {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}

export async function DELETE() {
    // Logout route
    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_session");
    return response;
}
