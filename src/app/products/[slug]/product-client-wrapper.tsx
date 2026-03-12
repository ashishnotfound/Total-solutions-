"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, ImageIcon, ShoppingCart, MessageSquare } from "lucide-react";
import type { Product } from "@/lib/data";

interface Props {
    product: Product;
}

export default function ProductClientWrapper({ product }: Props) {
    const [activeImage, setActiveImage] = useState<string | null>(null);

    const handlePlaceOrder = () => {
        window.location.href = `/order?product=${encodeURIComponent(product.name)}&productId=${product.id}`;
    };

    const handleSendQuery = () => {
        window.location.href = `/contact?product=${encodeURIComponent(product.name)}&productId=${product.id}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}
        >
            {/* Gallery */}
            <div>
                <div style={{
                    aspectRatio: "4/3",
                    borderRadius: "var(--radius-lg)",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: "1px solid var(--border-light)",
                    marginBottom: 16,
                    position: "relative"
                }}>
                    {activeImage || product.image ? (
                        <Image
                            src={activeImage || product.image || ""}
                            alt={product.name || ""}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 900px) 100vw, 50vw"
                            priority
                        />
                    ) : (
                        <ImageIcon size={64} style={{ color: "#cbd5e1" }} />
                    )}
                </div>
                {product.gallery && product.gallery.length > 0 && (
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {[product.image, ...product.gallery.filter(g => g !== product.image)].filter(Boolean).map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImage(img)}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "var(--radius-md)",
                                    background: "#f8fafc",
                                    border: (activeImage === img || (!activeImage && img === product.image)) ? "2px solid var(--primary)" : "1px solid var(--border)",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    position: "relative"
                                }}
                            >
                                <Image
                                    src={img || ""}
                                    alt={`${product.name} view ${i}`}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="80px"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>{product.name}</h1>

                {product.price ? (
                    <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)", marginBottom: 20 }}>₹{product.price}</p>
                ) : (
                    <div style={{ background: "var(--primary-light)", padding: "12px 20px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                        <span style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 700 }}>💰 Price available on request</span>
                    </div>
                )}

                <p style={{ fontSize: "1.05rem", color: "var(--text-light)", lineHeight: 1.8, marginBottom: 32 }}>{product.description}</p>

                {product.specifications && product.specifications.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 16 }}>Technical Specifications</h3>
                        <div style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-lg)", padding: 24, border: "1px solid var(--border-light)" }}>
                            {product.specifications.map((spec) => (
                                <div key={spec.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: "0.9rem" }}>
                                    <span style={{ color: "var(--text-light)", fontWeight: 500 }}>{spec.label}</span>
                                    <span style={{ fontWeight: 700 }}>{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {product.materials && product.materials.length > 0 && (
                    <div style={{ marginBottom: 40 }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 16 }}>Premium Materials</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                            {product.materials.map((m) => (
                                <span key={m} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, background: "white", border: "1px solid var(--border-light)", color: "var(--text)", fontSize: "0.85rem", fontWeight: 600, boxShadow: "var(--shadow-sm)" }}>
                                    <CheckCircle size={14} style={{ color: "var(--primary)" }} /> {m}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                    <button
                        onClick={handlePlaceOrder}
                        className="btn btn-primary btn-lg"
                        style={{ 
                            flex: 1, 
                            textAlign: "center", 
                            height: 56, 
                            fontSize: "1.1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8
                        }}
                    >
                        <ShoppingCart size={20} />
                        Place Order
                    </button>
                    <button
                        onClick={handleSendQuery}
                        className="btn btn-outline btn-lg"
                        style={{ 
                            flex: 1, 
                            textAlign: "center", 
                            height: 56, 
                            fontSize: "1.1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8
                        }}
                    >
                        <MessageSquare size={20} />
                        Send Query
                    </button>
                </div>

                {/* Back Button */}
                <Link href="/products" className="btn btn-ghost" style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <ArrowLeft size={18} /> Back to Products
                </Link>

                <div style={{ 
                    marginTop: 24, 
                    padding: 16, 
                    background: "#f0f9ff", 
                    border: "1px solid #bae6fd", 
                    borderRadius: 12,
                    fontSize: "0.9rem",
                    color: "#0369a1"
                }}>
                    <strong>✨ Ease of Ordering:</strong> No account needed. Simply fill in your details on the next page to proceed with your request.
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 900px) {
                    div[style*="gridTemplateColumns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </motion.div>
    );
}
