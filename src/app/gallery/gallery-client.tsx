"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Filter, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GalleryItem } from "@/lib/data";

const filters = ["All", "Flex", "Printing", "Promotional", "Installations"];

interface Props {
    initialItems: GalleryItem[];
    activeCategory: string;
}

export default function GalleryClient({ initialItems, activeCategory }: Props) {
    const router = useRouter();
    const [lightbox, setLightbox] = useState<string | null>(null);

    const setActive = (f: string) => {
        const params = new URLSearchParams();
        if (f !== "All") params.set("category", f);
        router.push(`/gallery?${params.toString()}`, { scroll: false });
    };

    const filteredItems =
        activeCategory === "All"
            ? initialItems
            : initialItems.filter(item => (item.category || "").toLowerCase() === activeCategory.toLowerCase());

    return (
        <>
            <section style={{ padding: "48px 0", borderBottom: "1px solid var(--border-light)", position: "sticky", top: 72, zIndex: 50, backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.8)" }}>
                <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8, color: "var(--text-light)", fontSize: "0.92rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        <Filter size={16} /> Filter
                    </div>
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActive(f)}
                            className={`btn btn-sm ${activeCategory.toLowerCase() === f.toLowerCase() ? "btn-primary" : "btn-ghost"}`}
                            style={{ borderRadius: 100, padding: "0 24px", height: 40, border: activeCategory.toLowerCase() === f.toLowerCase() ? "none" : "1px solid var(--border-light)" }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </section>

            <section style={{ padding: "60px 0", background: "var(--bg-subtle)" }}>
                <div className="container">
                    {filteredItems.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-lighter)" }}>
                            <AlertCircle size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}>No items found</h3>
                            <p>There are no items in this category yet.</p>
                        </div>
                    ) : (
                        <div className="grid-3">
                            {filteredItems.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setLightbox(item.src)}
                                >
                                    <div className="card" style={{ overflow: "hidden", padding: 0, background: "white", transition: "all 0.4s var(--ease-spring)" }}>
                                        {item.type === "image" ? (
                                            <div
                                                className="gallery-image-container"
                                                style={{
                                                    width: "100%",
                                                    height: 280,
                                                    background: `url(${item.src}) center/cover`,
                                                    position: "relative",
                                                    overflow: "hidden"
                                                }}
                                            >
                                                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.3s" }} className="image-overlay" />
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: 280,
                                                    background: "#f8fafc",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Play size={48} style={{ color: "var(--primary)" }} />
                                            </div>
                                        )}
                                        <div className="card-body" style={{ padding: 20 }}>
                                            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>{item.title}</h4>
                                            <span style={{ fontSize: "0.85rem", color: "var(--text-light)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>{item.category}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.9)",
                            zIndex: 9999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 20,
                        }}
                        onClick={() => setLightbox(null)}
                    >
                        <motion.img
                            src={lightbox}
                            alt="Lightbox"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 }}
                        />
                        <button
                            onClick={() => setLightbox(null)}
                            style={{
                                position: "absolute",
                                top: 20,
                                right: 20,
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "50%",
                                width: 48,
                                height: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        >
                            <X size={24} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ width: "90vw", maxWidth: 1100, aspectRatio: "16/9", borderRadius: "var(--radius-xl)", background: "linear-gradient(135deg, #1a1a2e, #16213e)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", overflow: "hidden", boxShadow: "0 30px 60px -12px rgba(0,0,0,0.5)" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ textAlign: "center" }}>
                                <Play size={64} style={{ marginBottom: 16, opacity: 0.5 }} />
                                <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>Full-size Preview Placeholder</p>
                                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)" }}>Real asset loading implementation pending Phase 3</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
