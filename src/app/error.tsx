"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 16 }}>
          Something went wrong
        </h1>
        <p style={{ color: "var(--text-light)", marginBottom: 32 }}>
          We encountered an unexpected error. You can try refreshing the page or go back to the homepage.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              background: "var(--bg-subtle)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Home size={16} />
            Home
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details style={{ marginTop: 32, textAlign: "left" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>
              Error details
            </summary>
            <pre
              style={{
                marginTop: 12,
                padding: 12,
                background: "var(--bg-subtle)",
                borderRadius: "8px",
                fontSize: "0.85rem",
                overflow: "auto",
              }}
            >
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
