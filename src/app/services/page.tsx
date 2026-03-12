"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Printer, Monitor, Package, Megaphone, Scissors, Server, Settings, LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSettings } from "@/context/SettingsContext";

/* ── Fallback static services ── */
const defaultServices = [
    {
        icon: Printer,
        title: "Offset Printing",
        desc: "High-volume, cost-effective offset printing for business cards, letterheads, brochures, catalogues, and all corporate stationery. We deliver vivid, consistent colours using our state-of-the-art multi-colour offset press.",
        color: "var(--primary)",
        bg: "linear-gradient(135deg, #e8f5ee, #d4edda)",
    },
    {
        icon: Monitor,
        title: "Digital / Flex / Vinyl Printing",
        desc: "From flex banners and vinyl wraps to high-resolution digital prints — we produce eye-catching large-format graphics for hoardings, retail signage, vehicle wraps, standees, and more.",
        color: "var(--accent)",
        bg: "linear-gradient(135deg, #fff3ec, #ffe0cc)",
    },
    {
        icon: Package,
        title: "Packaging Solutions",
        desc: "Custom packaging for retail, pharma, food, and e-commerce. From mono cartons to corrugated boxes, we handle design, printing, die-cutting, and assembly — all in-house.",
        color: "#6366f1",
        bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
    },
    {
        icon: Megaphone,
        title: "Promotional Items",
        desc: "Branded merchandise that creates lasting impressions — T-shirts, mugs, pens, trophies, ID cards, bags, and more. Ideal for corporate events, trade shows, and team gifting.",
        color: "#ec4899",
        bg: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
    },
    {
        icon: Scissors,
        title: "Finishing & Installation",
        desc: "Complete post-press services including lamination, embossing, foiling, die-cutting, binding, and on-site installation of signage, glow boards, and acrylic displays.",
        color: "#f59e0b",
        bg: "linear-gradient(135deg, #fefce8, #fef3c7)",
    },
];

const iconMap: Record<string, LucideIcon> = {
    Printer, Monitor, Package, Megaphone, Scissors, Server, Settings
};

interface ServiceItem {
    title: string;
    desc: string;
    image?: string;
    icon?: LucideIcon;
    iconName?: string;
    color?: string;
    bg?: string;
}

export default function ServicesPage() {
    const { settings } = useSettings();
    const dynamicServices = settings?.services_content as {title: string, content: string, image?: string, subtitle?: string, active?: boolean, order: number}[] | undefined;
    
    // Process services either from dynamic settings or defaults
    const servicesToDisplay: ServiceItem[] = (dynamicServices && dynamicServices.length > 0) 
        ? dynamicServices
            .filter(s => s.active !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(s => ({
                title: s.title,
                desc: s.content,
                image: s.image,
                iconName: s.subtitle, // Using subtitle for icon name if image is absent
                color: "var(--primary)",
                bg: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
            }))
        : defaultServices;

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 72 }}>
                {/* Hero */}
                <section
                    style={{
                        padding: "64px 0",
                        background: "linear-gradient(135deg, rgba(31,163,82,0.06), rgba(255,107,26,0.04))",
                        textAlign: "center",
                    }}
                >
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="badge badge-primary" style={{ marginBottom: 16 }}>
                                Our Expertise
                            </span>
                            <h1 style={{ marginBottom: 12 }}>Our Services</h1>
                            <p
                                style={{
                                    color: "var(--text-light)",
                                    fontSize: "1.1rem",
                                    maxWidth: 600,
                                    margin: "0 auto",
                                }}
                            >
                                End-to-end printing, branding, and finishing services — all
                                under one roof.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Service Cards */}
                <section style={{ padding: "80px 0" }}>
                    <div className="container" style={{ maxWidth: 1000 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
                            {servicesToDisplay.map((s, i) => {
                                const isEven = i % 2 === 0;
                                const IconComp = s.icon || (s.iconName && iconMap[s.iconName]) || Settings;
                                
                                return (
                                    <motion.div
                                        key={s.title}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08, duration: 0.6 }}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                            gap: 48,
                                            alignItems: "center",
                                            padding: "40px 0",
                                        }}
                                        className="service-item-grid"
                                    >
                                        {/* Visual Element */}
                                        <div
                                            style={{
                                                order: isEven ? 0 : 1,
                                                aspectRatio: "16/10",
                                                borderRadius: 32,
                                                background: s.bg || "#f8fafc",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                position: "relative",
                                                overflow: "hidden",
                                                boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                                                border: "1px solid rgba(0,0,0,0.03)"
                                            }}
                                        >
                                            {s.image ? (
                                                <Image 
                                                    src={s.image} 
                                                    alt={s.title} 
                                                    fill 
                                                    style={{ objectFit: "cover" }} 
                                                />
                                            ) : (
                                                <IconComp size={84} strokeWidth={1.5} style={{ color: s.color || "var(--primary)" }} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{ order: isEven ? 1 : 0, padding: "0 10px" }}>
                                            <h2
                                                style={{
                                                    fontSize: "2rem",
                                                    fontWeight: 900,
                                                    marginBottom: 20,
                                                    letterSpacing: "-0.5px"
                                                }}
                                            >
                                                {s.title}
                                            </h2>
                                            <p
                                                style={{
                                                    fontSize: "1.05rem",
                                                    color: "var(--text-light)",
                                                    lineHeight: 1.8,
                                                    marginBottom: 32,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {s.desc}
                                            </p>
                                            <Link
                                                href={`/contact?service=${encodeURIComponent(s.title)}`}
                                                className="btn btn-primary"
                                                style={{ borderRadius: 14, height: 48, padding: "0 24px" }}
                                            >
                                                Get a Quote <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

        </>
    );
}
