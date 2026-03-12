"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { useSettings } from "@/context/SettingsContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const pathname = usePathname();
    const { settings } = useSettings();

    const siteName = (settings?.company_name as string) || SITE.name;
    const logo = (settings?.logo as string) || "";
    const showLogo = logo && !logoError;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.8)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: scrolled ? "1px solid var(--border-light)" : "1px solid transparent",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.04)" : "none",
            }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 64,
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontWeight: 800,
                        fontSize: "1.35rem",
                        color: "var(--primary)",
                        letterSpacing: "-0.5px",
                    }}
                >
                    {showLogo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={logo}
                            alt={siteName}
                            onError={() => setLogoError(true)}
                            style={{ height: 44, maxWidth: 160, objectFit: "contain", objectPosition: "left", display: "block" }}
                        />
                    ) : (
                        <>
                            <span
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: "var(--primary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "0.9rem",
                                    fontWeight: 900,
                                }}
                            >
                                TS
                            </span>
                            <span className="logo-text" style={{ fontSize: "1.15rem" }}>{siteName}</span>
                        </>
                    )}
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                        className="desktop-nav"
                        style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: 10,
                                        fontSize: "0.95rem",
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? "var(--primary)" : "var(--text)",
                                        background: isActive ? "var(--primary-light)" : "transparent",
                                        transition: "all 0.3s var(--ease-spring)",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = "var(--primary)";
                                            e.currentTarget.style.background = "var(--primary-light)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = "var(--text)";
                                            e.currentTarget.style.background = "transparent";
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                    <Link
                        href="/contact"
                        className="btn btn-primary btn-sm"
                        style={{ marginLeft: 12 }}
                    >
                        <Phone size={16} />
                        Get a Quote
                    </Link>
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                        style={{
                            display: "none",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 8,
                        }}
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        style={{
                            background: "white",
                            borderTop: "1px solid var(--border)",
                            overflow: "hidden",
                            backdropFilter: "blur(10px)",
                        }}
                        className="mobile-nav-panel"
                    >
                        <div style={{ padding: "16px 24px" }}>
                            {NAV_LINKS.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        style={{
                                            display: "block",
                                            padding: "12px 0",
                                            fontWeight: 500,
                                            fontSize: "1rem",
                                            borderBottom: "1px solid var(--border-light)",
                                            color:
                                                pathname === link.href
                                                    ? "var(--primary)"
                                                    : "var(--text)",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = "var(--primary)";
                                            e.currentTarget.style.paddingLeft = "8px";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (pathname !== link.href) {
                                                e.currentTarget.style.color = "var(--text)";
                                                e.currentTarget.style.paddingLeft = "0";
                                            }
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: NAV_LINKS.length * 0.1, duration: 0.3 }}
                            >
                                <Link
                                    href="/contact"
                                    className="btn btn-primary"
                                    onClick={() => setOpen(false)}
                                    style={{ width: "100%", marginTop: 16, textAlign: "center" }}
                                >
                                    Get a Quote
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .logo-text {
            display: none;
          }
        }
      `}</style>
        </header>
    );
}
