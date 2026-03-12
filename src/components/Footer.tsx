"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
    const { settings } = useSettings();

    const info = {
        name: (settings?.company_name as string) || SITE.name,
        tagline: ((settings?.tagline as string) || SITE.tagline).replace(/--+$/, ""),
        email: (settings?.email as string) || SITE.email,
        phones: Array.isArray(settings?.phones) ? (settings.phones as string[]) : SITE.phones,
        office: {
            label: SITE.addresses.office.label,
            line1: (settings?.office_address_1 as string) || SITE.addresses.office.line1,
            line2: (settings?.office_address_2 as string) || SITE.addresses.office.line2,
        },
        whatsapp: (settings?.whatsapp as string) || SITE.whatsapp || "",
    };

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubscribe = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setStatus("loading");
        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to subscribe");
            }

            setStatus("success");
            setEmail("");
            toast.success(result.message || "Subscribed to newsletter successfully!");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            setStatus("idle");
            const message = error instanceof Error ? error.message : "Failed to subscribe. Please try again later.";
            toast.error(message);
        }
    };

    return (
        <footer
            style={{
                background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
                color: "rgba(255,255,255,0.8)",
                paddingTop: 80,
                paddingBottom: 0,
                borderTop: "1px solid rgba(255,255,255,0.05)"
            }}
        >
            <div className="container">
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: 48,
                        paddingBottom: 48,
                    }}
                >
                    {/* Company Info */}
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                fontWeight: 800,
                                fontSize: "1.3rem",
                                color: "var(--primary)",
                                marginBottom: 16,
                            }}
                        >
                            <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--primary)" }}>{info.name}</span>
                        </div>
                        <p
                            style={{
                                fontSize: "0.95rem",
                                lineHeight: 1.7,
                                color: "rgba(255,255,255,0.5)",
                                marginBottom: 24,
                            }}
                        >
                            {info.tagline}
                        </p>
                        <p
                            style={{
                                fontSize: "0.85rem",
                                color: "rgba(255,255,255,0.35)",
                                fontWeight: 500
                            }}
                        >
                            © {new Date().getFullYear()} {info.name}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontWeight: 700,
                                fontSize: "1rem",
                                marginBottom: 20,
                                color: "white",
                            }}
                        >
                            Quick Links
                        </h4>
                        {[
                            { label: "Products", href: "/products" },
                            { label: "Services", href: "/services" },
                            { label: "Gallery", href: "/gallery" },
                            { label: "About Us", href: "/about" },
                            { label: "Reviews", href: "/reviews" },
                            { label: "Admin Panel", href: "/admin" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    display: "block",
                                    marginBottom: 12,
                                    fontSize: "0.9rem",
                                    color: "rgba(255,255,255,0.5)",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.color = "var(--primary)")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Contact Detail */}
                    <div>
                        <h4
                            style={{
                                fontWeight: 700,
                                fontSize: "1rem",
                                marginBottom: 20,
                                color: "white",
                            }}
                        >
                            Contact Us
                        </h4>
                        <div
                            style={{ display: "flex", flexDirection: "column", gap: 16 }}
                        >
                            <div
                                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                            >
                                <MapPin
                                    size={18}
                                    style={{ color: "var(--primary)", marginTop: 2 }}
                                />
                                <div style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>
                                    <p>{info.office.line1}</p>
                                    <p>{info.office.line2}</p>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", alignItems: "center", gap: 12 }}
                            >
                                <Phone size={18} style={{ color: "var(--primary)" }} />
                                <div style={{ fontSize: "0.88rem" }}>
                                    {info.phones.map(p => <p key={p}>{p}</p>)}
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", alignItems: "center", gap: 12 }}
                            >
                                <Mail size={18} style={{ color: "var(--primary)" }} />
                                <a
                                    href={`mailto:${info.email}`}
                                    style={{ fontSize: "0.88rem", color: "inherit" }}
                                >
                                    {info.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h4
                            style={{
                                fontWeight: 700,
                                fontSize: "1rem",
                                marginBottom: 20,
                                color: "white",
                            }}
                        >
                            Newsletter
                        </h4>
                        <p
                            style={{
                                fontSize: "0.88rem",
                                color: "rgba(255,255,255,0.5)",
                                marginBottom: 16,
                            }}
                        >
                            Subscribe to get latest updates and offers.
                        </p>
                        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                            <input
                                placeholder="Enter email address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                                style={{
                                    flex: 1,
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "var(--radius-md)",
                                    padding: "12px 16px",
                                    color: "white",
                                    fontSize: "0.9rem",
                                    outline: "none",
                                    transition: "all 0.2s"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "var(--primary)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                }}
                            />
                            <button
                                onClick={handleSubscribe}
                                disabled={status === "loading" || status === "success"}
                                className="btn btn-primary"
                                style={{ borderRadius: "var(--radius-md)", padding: "0 24px" }}
                            >
                                {status === "loading" ? "..." : status === "success" ? "✓" : "Join"}
                            </button>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            {[
                                { Icon: Facebook, url: (settings?.social_facebook as string) || SITE.social.facebook },
                                { Icon: Instagram, url: (settings?.social_instagram as string) || SITE.social.instagram },
                                { Icon: Linkedin, url: (settings?.social_linkedin as string) || SITE.social.linkedin },
                                { Icon: Twitter, url: (settings?.social_twitter as string) || SITE.social.twitter },
                            ].filter(item => item.url && item.url !== "#").map(({ Icon, url }, i) => (
                                <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "rgba(255,255,255,0.05)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = "var(--primary)";
                                        e.currentTarget.style.transform = "translateY(-3px)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        padding: "24px 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.3)",
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        © {new Date().getFullYear()} <span style={{ color: "white" }}>{info.name}</span>. In-House Precision Since {SITE.established}.
                    </div>
                    <div style={{ display: "flex", gap: 24 }}>
                        <Link href="/privacy-policy" style={{ color: "inherit" }}>
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-service" style={{ color: "inherit" }}>
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
