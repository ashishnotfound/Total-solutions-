"use client";
import Link from "next/link";
import { getCurrentUser, signOut } from "@/lib/supabase/auth";
import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";

export default function AuthButton() {
    const [user, setUser] = useState<{ email?: string } | null>(null);

    useEffect(() => {
        getCurrentUser().then(setUser).catch(() => setUser(null));
    }, []);

    if (!user) {
        return (
            <Link href="/admin/login" className="btn btn-primary">
                Admin Login
            </Link>
        );
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                <User size={16} style={{ marginRight: 4 }} />
                {user.email}
            </span>
            <button
                onClick={async () => {
                    await signOut();
                    setUser(null);
                    window.location.href = "/admin/login";
                }}
                className="btn btn-ghost"
                style={{ fontSize: "0.9rem" }}
            >
                <LogOut size={16} style={{ marginRight: 4 }} />
                Logout
            </button>
        </div>
    );
}
