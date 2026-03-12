"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { signIn } from "@/lib/supabase/auth";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import { SITE } from "@/lib/constants";

export default function AdminLoginPage() {
    const router = useRouter();
    const { settings } = useSettings();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const siteName = (settings?.company_name as string) || SITE.name;
    const logoUrl = (settings?.logo as string) || "";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await signIn(email, password);
            router.push("/admin");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Authentication failed. Please check your credentials.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            background: "#0f172a",
            overflow: "hidden"
        }}>
            {/* Background Image with Overlay */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <Image
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070"
                    alt="Abstract Industrial"
                    fill
                    priority
                    style={{ objectFit: "cover", opacity: 0.4 }}
                />
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.8) 100%)",
                    backdropFilter: "blur(4px)"
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    width: "100%",
                    maxWidth: 440,
                    padding: "48px 40px",
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 32,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    position: "relative",
                    zIndex: 1,
                    margin: 20
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    {logoUrl ? (
                        <div style={{ position: "relative", width: 140, height: 60, margin: "0 auto 32px" }}>
                            <Image src={logoUrl} alt={siteName} fill style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            style={{
                                width: 64,
                                height: 64,
                                background: "linear-gradient(135deg, var(--primary), #15803d)",
                                borderRadius: 20,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                                boxShadow: "0 10px 20px rgba(31, 163, 82, 0.3)"
                            }}
                        >
                            <ShieldCheck size={32} color="white" />
                        </motion.div>
                    )}
                    <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8 }}>{siteName} Admin</h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", fontWeight: 500 }}>Enter your credentials to manage records</p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                color: "#fca5a5",
                                padding: "12px 16px",
                                borderRadius: 14,
                                marginBottom: 24,
                                fontSize: "0.85rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 10
                            }}
                        >
                            <span style={{ fontWeight: 800 }}>Error:</span> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ position: "relative" }}>
                        <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, display: "block", marginLeft: 4 }}>
                            Corporate Email
                        </label>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@totalsolutions.com"
                                style={{
                                    width: "100%",
                                    height: 54,
                                    padding: "0 16px 0 48px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 16,
                                    color: "white",
                                    fontSize: "0.95rem",
                                    outline: "none",
                                    transition: "all 0.3s"
                                }}
                                className="login-input"
                            />
                        </div>
                    </div>

                    <div style={{ position: "relative" }}>
                        <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, display: "block", marginLeft: 4 }}>
                            Secret Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: "100%",
                                    height: 54,
                                    padding: "0 48px 0 48px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 16,
                                    color: "white",
                                    fontSize: "0.95rem",
                                    outline: "none",
                                    transition: "all 0.3s"
                                }}
                                className="login-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", display: "flex", alignItems: "center" }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            height: 56,
                            background: "linear-gradient(135deg, var(--primary), #166534)",
                            color: "white",
                            borderRadius: 16,
                            fontWeight: 800,
                            fontSize: "1rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 15px 30px -10px rgba(31, 163, 82, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            marginTop: 12,
                            transition: "all 0.3s"
                        }}
                    >
                        {loading ? <LoadingSpinner size={20} color="white" /> : "Verify Identity"}
                    </button>
                </form>

                <div style={{ marginTop: 32, textAlign: "center" }}>
                    <Link href="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <ArrowLeft size={14} /> Escape to Website
                    </Link>
                </div>
            </motion.div>

            <style jsx>{`
                .login-input:focus {
                    background: rgba(255,255,255,0.08) !important;
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 4px rgba(31, 163, 82, 0.15) !important;
                }
                button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 40px -10px rgba(31, 163, 82, 0.5) !important;
                }
                button:active:not(:disabled) {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
}
