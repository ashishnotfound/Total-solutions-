"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ImageIcon } from "lucide-react";
import type { Product } from "@/lib/data";
import { useState } from "react";

interface Props {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="card"
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "var(--bg-card)",
            }}
        >
            {/* Image */}
            <div style={{ position: "relative", width: "100%", height: 220, background: "var(--bg-subtle)", overflow: "hidden" }}>
                {product.image && !imageError ? (
                    <>
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                                animation: imageLoaded ? "none" : "shimmer 1.5s infinite",
                                zIndex: 1,
                            }}
                        />
                        <Image
                            src={product.image || "https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?q=80&w=2070"}
                            alt={product.name}
                            fill
                            style={{
                                objectFit: "cover",
                                opacity: imageLoaded ? 1 : 0,
                                transition: "opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                                zIndex: 2,
                            }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            loading={index < 4 ? undefined : "lazy"}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => {
                                setImageError(true);
                                // Set a stable fallback
                                (product.image as any) = "https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?q=80&w=2070";
                            }}
                            priority={index < 4}
                        />
                    </>
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4d4d8" }}>
                        <ImageIcon size={44} strokeWidth={1.2} />
                    </div>
                )}

                {/* Price badge overlay */}
                {product.price && (
                    <div style={{
                        position: "absolute", top: 16, right: 16, zIndex: 3,
                        background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)",
                        padding: "8px 16px", borderRadius: "var(--radius-md)",
                        fontWeight: 800, fontSize: "0.9rem", color: "var(--primary)",
                        boxShadow: "var(--shadow-md)",
                        border: "1px solid rgba(255,255,255,0.5)"
                    }}>
                        ₹{product.price}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="card-body" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 22px 22px" }}>
                <h3 style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "var(--text)",
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                }}>
                    {product.name}
                </h3>
                <p
                    style={{
                        fontSize: "0.86rem",
                        color: "var(--text-light)",
                        lineHeight: 1.6,
                        flex: 1,
                        marginBottom: 16,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {product.short_description}
                </p>

                {/* Price - only shown for "on request" */}
                {!product.price && (
                    <p style={{ fontSize: "0.8rem", color: "var(--text-lighter)", fontWeight: 600, fontStyle: "italic", marginBottom: 14 }}>
                        Price on Request
                    </p>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                    <Link
                        href={`/contact?product=${encodeURIComponent(product.name)}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1.2, padding: "12px 0" }}
                    >
                        Get Quote
                    </Link>
                    <Link
                        href={`/products/${product.slug}`}
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1, padding: "12px 0" }}
                    >
                        Details <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
