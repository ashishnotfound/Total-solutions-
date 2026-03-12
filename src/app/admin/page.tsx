"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Package,
    Star,
    Image as ImageIcon,
    MessageSquare,
    ChevronRight,
    Activity,
    ShoppingCart,
    TrendingUp,
    ArrowUpRight,
    Server,
    Database,
    Wifi,
    Shield,
    Settings
} from "lucide-react";
import { getProducts, getGalleryItems, getAdminReviews, getQuotes, getQueries } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";

/* ── Animated counter hook ── */
function useAnimatedCounter(target: number | string, duration = 1200) {
    const [count, setCount] = useState(0);
    const numTarget = typeof target === "string" ? parseFloat(target) : target;
    const isFloat = typeof target === "string" && target.includes(".");

    useEffect(() => {
        if (numTarget === 0) return;
        const startTime = performance.now();
        const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * numTarget;
            setCount(current);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [numTarget, duration]);

    if (isFloat) return count.toFixed(1);
    return Math.round(count);
}

function AnimatedStat({ value }: { value: number | string }) {
    const display = useAnimatedCounter(value, 1400);
    return <>{display}</>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        reviews: 0,
        gallery: 0,
        quotes: 0,
        newQuotes: 0,
        queries: 0,
        avgRating: "0.0",
    });
    const [loading, setLoading] = useState(true);
    const { settings } = useSettings();
    const mediaBlocks: {id: string, url: string}[] = Array.isArray(settings?.media_blocks) ? settings.media_blocks as {id: string, url: string}[] : [];
    
    const getMediaUrl = (id: string, fallback: string) => {
        const block = mediaBlocks.find(b => b.id === id);
        return block?.url || fallback;
    };

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [p, g, r, q, queries] = await Promise.all([
                    getProducts(),
                    getGalleryItems(),
                    getAdminReviews(),
                    getQuotes(),
                    getQueries()
                ]);

                const avgRating = r.length > 0
                    ? (r.reduce((acc, curr) => acc + curr.rating, 0) / r.length).toFixed(1)
                    : "0.0";

                setStats({
                    products: p.length,
                    gallery: g.length,
                    reviews: r.length,
                    quotes: q.length,
                    newQuotes: q.filter(x => x.status === 'new').length,
                    queries: queries.length,
                    avgRating: avgRating,
                });
            } catch (error) {
                console.error("Dashboard load failed", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const statCards = [
        {
            label: "Total Products",
            value: stats.products,
            icon: Package,
            gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
            bgTint: "rgba(59, 130, 246, 0.08)",
            iconBg: "rgba(59, 130, 246, 0.12)",
            iconColor: "#3b82f6",
            change: "+12%",
            trend: "up"
        },
        {
            label: "New Inquiries",
            value: stats.newQuotes,
            icon: MessageSquare,
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            bgTint: "rgba(16, 185, 129, 0.08)",
            iconBg: "rgba(16, 185, 129, 0.12)",
            iconColor: "#10b981",
            change: "High priority",
            trend: "up"
        },
        {
            label: "Gallery Assets",
            value: stats.gallery,
            icon: ImageIcon,
            gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            bgTint: "rgba(139, 92, 246, 0.08)",
            iconBg: "rgba(139, 92, 246, 0.12)",
            iconColor: "#8b5cf6",
            change: "Latest updates",
            trend: "up"
        },
        {
            label: "Avg. Rating",
            value: stats.avgRating,
            icon: Star,
            gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            bgTint: "rgba(245, 158, 11, 0.08)",
            iconBg: "rgba(245, 158, 11, 0.12)",
            iconColor: "#f59e0b",
            change: "From 120+ reviews",
            trend: "up"
        },
    ];

    const quickActions = [
        { href: "/admin/products", icon: Package, title: "Manage Products", desc: "Add and edit products", color: "#3b82f6" },
        { href: "/admin/services", icon: Settings, title: "Service Offerings", desc: "Edit your core services", color: "#10b981" },
        { href: "/admin/quotes", icon: ShoppingCart, title: "Quote Requests", desc: "Manage customer leads and service inquiries.", color: "#8b5cf6" },
        { href: "/admin/reviews", icon: Star, title: "Customer Reviews", desc: "Moderate feedback", color: "#f59e0b" },
        { href: "/admin/gallery", icon: ImageIcon, title: "Gallery", desc: "Manage portfolio", color: "#6366f1" },
        { href: "/admin/config", icon: Activity, title: "Settings", desc: "Site configuration", color: "#64748b" },
    ];

    const systemItems = [
        { label: "Database", status: "Connected", icon: Database },
        { label: "API", status: "Active", icon: Server },
        { label: "Network", status: "Stable", icon: Wifi },
        { label: "Security", status: "Protected", icon: Shield },
    ];

    return (
        <div>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                
                {/* ── Dashboard Banner ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: 40, height: 180, borderRadius: 24, overflow: "hidden", position: "relative", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-md)" }}
                >
                    <Image 
                        src={getMediaUrl("dashboard_banner", "https://images.unsplash.com/photo-1626786139196-1cc4e64f4347?q=80&w=2070")} 
                        alt="Dashboard Banner" 
                        fill 
                        style={{ objectFit: "cover" }} 
                        priority 
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 100%)" }} />
                    <div style={{ position: "absolute", bottom: 32, left: 32 }}>
                        <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Welcome to the Console</h1>
                        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", fontWeight: 500 }}>Here&apos;s an overview of your printing business operations.</p>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: 40 }}
                >
                    <h1 style={{
                        fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                        fontWeight: 800,
                        color: "#0f172a",
                        letterSpacing: "-0.025em",
                        marginBottom: 6,
                        lineHeight: 1.2
                    }}>
                        Dashboard Overview
                    </h1>
                    <p style={{
                        fontSize: "1rem",
                        color: "#64748b",
                        fontWeight: 500,
                        lineHeight: 1.5
                    }}>
                        Welcome back! Here&apos;s what&apos;s happening with your store.
                    </p>
                </motion.div>

                {/* ── Stats Grid ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 20,
                    marginBottom: 40
                }}>
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                            whileHover={{ y: -4, transition: { duration: 0.25 } }}
                            style={{
                                background: "var(--bg-card)",
                                borderRadius: "var(--radius-xl)",
                                padding: "32px 28px",
                                border: "1px solid var(--border-light)",
                                boxShadow: "var(--shadow-sm)",
                                cursor: "default",
                                transition: "all 0.3s var(--ease-spring)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                            className="admin-stat-card"
                        >
                            {/* Subtle accent line at top */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 3,
                                background: stat.gradient,
                                borderRadius: "16px 16px 0 0",
                                opacity: 0.8
                            }} />

                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    background: stat.iconBg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0
                                }}>
                                    <stat.icon size={22} color={stat.iconColor} />
                                </div>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    padding: "4px 10px",
                                    borderRadius: 20,
                                    background: stat.trend === "up" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    color: stat.trend === "up" ? "#059669" : "#dc2626",
                                    letterSpacing: "-0.01em",
                                }}>
                                    {stat.trend === "up" && <TrendingUp size={13} />}
                                    {stat.change}
                                </div>
                            </div>

                            <div style={{ marginBottom: 4 }}>
                                <motion.div
                                    style={{
                                        fontSize: "2.6rem",
                                        fontWeight: 800,
                                        color: "var(--text)",
                                        lineHeight: 1.1,
                                        letterSpacing: "-0.04em"
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <AnimatedStat value={stat.value} />
                                </motion.div>
                            </div>
                            <p style={{
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                color: "var(--text-light)",
                                letterSpacing: "-0.01em"
                            }}>
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* ── Quick Actions ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ marginBottom: 40 }}
                >
                    <h2 style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        marginBottom: 20,
                        letterSpacing: "-0.02em"
                    }}>
                        Quick Actions
                    </h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 16,
                    }}>
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={action.href}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 + index * 0.06 }}
                                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            >
                                <Link
                                    href={action.href}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                        background: "var(--bg-card)",
                                        borderRadius: "var(--radius-lg)",
                                        padding: "24px 22px",
                                        border: "1px solid var(--border-light)",
                                        boxShadow: "var(--shadow-xs)",
                                        textDecoration: "none",
                                        transition: "all 0.3s var(--ease-spring)",
                                    }}
                                    className="admin-action-card"
                                >
                                    <div style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        background: `${action.color}14`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        transition: "transform 0.25s ease",
                                    }}>
                                        <action.icon size={20} color={action.color} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{
                                            fontSize: "0.98rem",
                                            fontWeight: 700,
                                            color: "var(--text)",
                                            marginBottom: 4,
                                            letterSpacing: "-0.01em"
                                        }}>
                                            {action.title}
                                        </h3>
                                        <p style={{
                                            fontSize: "0.86rem",
                                            color: "var(--text-light)",
                                            fontWeight: 500
                                        }}>
                                            {action.desc}
                                        </p>
                                    </div>
                                    <ArrowUpRight
                                        size={18}
                                        color="#cbd5e1"
                                        style={{ flexShrink: 0, transition: "all 0.25s ease" }}
                                        className="action-arrow"
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Recent Activity ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 20,
                    marginBottom: 32
                }}>
                    {/* Recent Quotes */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            background: "var(--bg-card)",
                            borderRadius: "var(--radius-xl)",
                            padding: "32px",
                            border: "1px solid var(--border-light)",
                            boxShadow: "var(--shadow-xs)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <h3 style={{
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                color: "var(--text)",
                                letterSpacing: "-0.01em"
                            }}>
                                Recent Quotes
                            </h3>
                            <Link
                                href="/admin/quotes"
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    color: "#1FA352",
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    transition: "opacity 0.2s"
                                }}
                            >
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f1f5f9", animation: "pulse 2s infinite" }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ height: 12, background: "#f1f5f9", borderRadius: 6, marginBottom: 8, width: "70%", animation: "pulse 2s infinite" }} />
                                            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 6, width: "40%", animation: "pulse 2s infinite" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 16,
                                    background: "rgba(0,0,0,0.03)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 14px"
                                }}>
                                    <ShoppingCart size={24} color="#cbd5e1" />
                                </div>
                                <p style={{ color: "#94a3b8", fontSize: "0.88rem", fontWeight: 500 }}>No recent quotes</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Recent Reviews */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        style={{
                            background: "#ffffff",
                            borderRadius: 16,
                            padding: "28px",
                            border: "1px solid rgba(0,0,0,0.05)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <h3 style={{
                                fontSize: "1.05rem",
                                fontWeight: 700,
                                color: "#0f172a",
                                letterSpacing: "-0.01em"
                            }}>
                                Recent Reviews
                            </h3>
                            <Link
                                href="/admin/reviews"
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    color: "#1FA352",
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    transition: "opacity 0.2s"
                                }}
                            >
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f1f5f9", animation: "pulse 2s infinite" }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ height: 12, background: "#f1f5f9", borderRadius: 6, marginBottom: 8, width: "70%", animation: "pulse 2s infinite" }} />
                                            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 6, width: "40%", animation: "pulse 2s infinite" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 16,
                                    background: "rgba(0,0,0,0.03)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 14px"
                                }}>
                                    <Star size={24} color="#cbd5e1" />
                                </div>
                                <p style={{ color: "#94a3b8", fontSize: "0.88rem", fontWeight: 500 }}>No recent reviews</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ── System Status ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        background: "#ffffff",
                        borderRadius: 16,
                        padding: "28px",
                        border: "1px solid rgba(0,0,0,0.05)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#10b981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.15)"
                        }}
                            className="admin-pulse-dot"
                        />
                        <h3 style={{
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            color: "#0f172a",
                            letterSpacing: "-0.01em"
                        }}>
                            System Status
                        </h3>
                        <span style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#059669",
                            background: "rgba(16, 185, 129, 0.08)",
                            padding: "3px 10px",
                            borderRadius: 20,
                            marginLeft: 4,
                        }}>
                            All Operational
                        </span>
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 12,
                    }}>
                        {systemItems.map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 + i * 0.08 }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "14px 16px",
                                    borderRadius: 12,
                                    background: "rgba(0,0,0,0.015)",
                                    border: "1px solid rgba(0,0,0,0.04)",
                                }}
                            >
                                <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: "rgba(16, 185, 129, 0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <item.icon size={16} color="#10b981" />
                                </div>
                                <div>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                                        {item.label}
                                    </p>
                                    <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#10b981" }}>
                                        {item.status}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div >
    );
}
