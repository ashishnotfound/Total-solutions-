"use client";

import Link from "next/link";
import { MoveLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "linear-gradient(135deg, rgba(31,163,82,0.05), rgba(255,107,26,0.05))"
        }}>
            <div style={{
                textAlign: "center",
                maxWidth: 500,
                background: "white",
                padding: "60px 40px",
                borderRadius: 24,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
            }}>
                <div style={{
                    fontSize: "8rem",
                    fontWeight: 900,
                    lineHeight: 1,
                    background: "linear-gradient(135deg, var(--primary), var(--accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 20
                }}>
                    404
                </div>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>Page Not Found</h1>
                <p style={{ color: "var(--text-light)", fontSize: "1.1rem", marginBottom: 40, lineHeight: 1.6 }}>
                    Oops! The page you are looking for doesn&apos;t exist or has been moved.
                </p>

                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-outline"
                        style={{ height: 54, borderRadius: 14, padding: "0 24px", display: "flex", alignItems: "center", gap: 8 }}
                    >
                        <MoveLeft size={18} /> Go Back
                    </button>
                    <Link
                        href="/"
                        className="btn btn-primary"
                        style={{ height: 54, borderRadius: 14, padding: "0 32px", display: "flex", alignItems: "center", gap: 8 }}
                    >
                        <Home size={18} /> Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
