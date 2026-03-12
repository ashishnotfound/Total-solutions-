"use client";
import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    Star,
    Image as ImageIcon,
    MessageSquare,
    Settings,
    ChevronLeft,
    Menu,
    X,
    ShoppingCart,
    HelpCircle,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import AuthButton from "@/components/AuthButton";

const sidebarLinks = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin", category: "System" },
    { icon: Package, label: "Inventory", href: "/admin/products", category: "Catalog" },
    { icon: FolderOpen, label: "Categories", href: "/admin/categories", category: "Catalog" },
    { icon: Settings, label: "Services", href: "/admin/services", category: "Catalog" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders", category: "Engagement" },
    { icon: HelpCircle, label: "Queries", href: "/admin/queries", category: "Engagement" },
    { icon: Star, label: "Moderation", href: "/admin/reviews", category: "Engagement" },
    { icon: MessageSquare, label: "Leads", href: "/admin/quotes", category: "Engagement" },
    { icon: ImageIcon, label: "Assets", href: "/admin/gallery", category: "Digital" },
    { icon: Settings, label: "Platform", href: "/admin/settings", category: "System" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 900);
            if (window.innerWidth <= 900) {
                setCollapsed(false);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const groupedLinks = sidebarLinks.reduce((acc, link) => {
        if (!acc[link.category]) acc[link.category] = [];
        acc[link.category].push(link);
        return acc;
    }, {} as Record<string, typeof sidebarLinks>);

    const sidebarWidth = isMobile ? 0 : (collapsed ? 80 : 272);

    const sidebarContent = (
        <>
            {/* Logo area */}
            <div style={{
                padding: collapsed && !isMobile ? "28px 16px" : "28px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed && !isMobile ? "center" : "space-between",
                marginBottom: 8
            }}>
                {(!collapsed || isMobile) && (
                    <Link href="/admin" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontWeight: 800,
                        fontSize: "1.15rem",
                        color: "white",
                        letterSpacing: "-0.5px",
                        textDecoration: "none"
                    }}>
                        <div style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #1FA352 0%, #10b981 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.82rem",
                            fontWeight: 900,
                            color: "white",
                            boxShadow: "0 2px 8px rgba(31, 163, 82, 0.3)"
                        }}>
                            TS
                        </div>
                        <span>CORE</span>
                    </Link>
                )}
                {collapsed && !isMobile && (
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #1FA352 0%, #10b981 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 900,
                        fontSize: "0.82rem",
                        boxShadow: "0 2px 8px rgba(31, 163, 82, 0.3)"
                    }}>
                        T
                    </div>
                )}
                {!collapsed && !isMobile && (
                    <button
                        onClick={() => setCollapsed(true)}
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "none",
                            color: "rgba(255,255,255,0.4)",
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                        }}
                        className="admin-sidebar-btn"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}
                {isMobile && (
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "none",
                            color: "rgba(255,255,255,0.5)",
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {collapsed && !isMobile && (
                <button
                    onClick={() => setCollapsed(false)}
                    style={{
                        margin: "0 auto 24px",
                        background: "rgba(255,255,255,0.06)",
                        border: "none",
                        color: "rgba(255,255,255,0.35)",
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                    className="admin-sidebar-btn"
                >
                    <Menu size={18} />
                </button>
            )}

            {/* Navigation */}
            <nav style={{
                flex: 1,
                padding: collapsed && !isMobile ? "0 12px" : "0 14px",
                overflowY: "auto",
                overflowX: "hidden"
            }}>
                {Object.entries(groupedLinks).map(([category, links]) => (
                    <div key={category} style={{ marginBottom: 28 }}>
                        {(!collapsed || isMobile) && (
                            <p style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "1.4px",
                                color: "rgba(255,255,255,0.2)",
                                padding: "0 14px 12px",
                            }}>
                                {category}
                            </p>
                        )}
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => isMobile && setMobileMenuOpen(false)}
                                    title={collapsed && !isMobile ? link.label : ""}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        justifyContent: collapsed && !isMobile ? "center" : "flex-start",
                                        padding: collapsed && !isMobile ? "12px 0" : "11px 16px",
                                        borderRadius: 12,
                                        margin: "3px 0",
                                        textDecoration: "none",
                                        background: isActive ? "rgba(31, 163, 82, 0.12)" : "transparent",
                                        color: isActive ? "#34d399" : "rgba(255,255,255,0.45)",
                                        transition: "all 0.25s ease",
                                        position: "relative",
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: "0.9rem",
                                        letterSpacing: "-0.01em",
                                        borderLeft: isActive && (!collapsed || isMobile) ? "3px solid #1FA352" : "3px solid transparent",
                                    }}
                                    className="admin-nav-link"
                                >
                                    <Icon size={19} style={{ flexShrink: 0 }} />
                                    {(!collapsed || isMobile) && <span>{link.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Auth button */}
            <div style={{
                padding: "20px",
                borderTop: "1px solid rgba(255,255,255,0.06)"
            }}>
                <AuthButton />
            </div>
        </>
    );  // end sidebarContent

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#f5f7fa",
            color: "#0f172a"
        }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside
                    style={{
                        width: collapsed ? 80 : 272,
                        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 100,
                        background: "linear-gradient(195deg, #131b2e 0%, #0f172a 50%, #111827 100%)",
                        position: "fixed",
                        height: "100vh",
                        borderRight: "1px solid rgba(255,255,255,0.04)"
                    }}
                >
                    {sidebarContent}
                </aside>
            )}

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobile && mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.45)",
                                zIndex: 998,
                                backdropFilter: "blur(6px)"
                            }}
                        />
                        <motion.aside
                            initial={{ x: -280, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -280, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                width: 272,
                                display: "flex",
                                flexDirection: "column",
                                zIndex: 999,
                                background: "linear-gradient(195deg, #131b2e 0%, #0f172a 50%, #111827 100%)",
                                position: "fixed",
                                height: "100vh",
                                borderRight: "1px solid rgba(255,255,255,0.04)",
                                left: 0,
                                top: 0,
                            }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <main style={{
                flex: 1,
                marginLeft: sidebarWidth,
                transition: "margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                minWidth: 0
            }}>
                {/* Header */}
                <header style={{
                    padding: isMobile ? "14px 18px" : "18px 40px",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    background: "#ffffff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {isMobile && (
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                style={{
                                    background: "none",
                                    border: "1px solid #e2e8f0",
                                    padding: 8,
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.2s ease",
                                }}
                                className="admin-mobile-menu-btn"
                            >
                                <Menu size={20} />
                            </button>
                        )}
                        <div>
                            <h1 style={{
                                fontSize: isMobile ? "1.2rem" : "1.5rem",
                                fontWeight: 800,
                                color: "#0f172a",
                                letterSpacing: "-0.025em",
                                lineHeight: 1.2
                            }}>
                                {sidebarLinks.find(l => l.href === pathname)?.label || "Admin"}
                            </h1>
                            <p style={{
                                color: "#94a3b8",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                marginTop: 2
                            }}>
                                System management & insights
                            </p>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div style={{
                    padding: isMobile ? "20px 16px" : "28px 40px",
                    minHeight: "calc(100vh - 140px)"
                }}>
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {children}
                    </motion.div>
                </div>

                {/* Footer status bar */}
                <footer style={{
                    padding: isMobile ? "14px 18px" : "16px 40px",
                    borderTop: "1px solid rgba(0,0,0,0.04)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#94a3b8",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    flexWrap: "wrap",
                    gap: 8,
                    background: "#ffffff",
                }}>
                    <div style={{ display: "flex", gap: 24 }}>
                        <span>&copy; {new Date().getFullYear()} Total Solutions</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "#10b981",
                                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.15)"
                            }}
                            className="admin-pulse-dot"
                        />
                        System Active
                    </div>
                </footer>

                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            borderRadius: '14px',
                            background: '#0f172a',
                            color: '#fff',
                            fontSize: '0.9rem',
                            padding: '14px 22px',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                            fontWeight: 600
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </main>
        </div>
    );
}
