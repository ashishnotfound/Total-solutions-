"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, X, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/data";
import type { Product, Category } from "@/lib/data";
import AnimatedSection from "@/components/AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import Image from "next/image";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const { settings } = useSettings();
    const mediaBlocks: {id: string, url: string}[] = Array.isArray(settings?.media_blocks) ? settings.media_blocks as {id: string, url: string}[] : [];
    
    const getMediaUrl = (id: string, fallback: string) => {
        const block = mediaBlocks.find(b => b.id === id);
        return block?.url || fallback;
    };
    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main style={{ paddingTop: 72 }}>
                    <div className="container" style={{ padding: "80px 0" }}>
                        <div className="grid-3">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} style={{ background: "#f8fafc", borderRadius: 16, height: 400 }} />
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 72 }}>
                {/* Hero Section */}
                <section
                    style={{
                        padding: "80px 0",
                        position: "relative",
                        background: "linear-gradient(135deg, rgba(31,163,82,0.06), rgba(255,107,26,0.04))",
                        textAlign: "center",
                    }}
                >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, zIndex: 0 }}>
                        <Image src={getMediaUrl("category_highlight", "https://images.unsplash.com/photo-1626786139196-1cc4e64f4347?q=80&w=2070")} alt="Background pattern" fill style={{ objectFit: "cover" }} />
                    </div>
                    <div className="container" style={{ position: "relative", zIndex: 2 }}>
                        <AnimatedSection>
                            <span className="badge badge-accent" style={{ marginBottom: 16 }}>
                                Product Catalog
                            </span>
                            <h1 style={{ marginBottom: 16, fontWeight: 900 }}>Our Complete Product Range</h1>
                            <p
                                style={{
                                    color: "var(--text-light)",
                                    fontSize: "1.15rem",
                                    maxWidth: 600,
                                    margin: "0 auto",
                                    lineHeight: 1.7
                                }}
                            >
                                From high-impact signage and commercial printing to bespoke packaging solutions. Find exactly what you need.
                            </p>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Search and Filters */}
                <section style={{ padding: "48px 0", borderBottom: "1px solid var(--border-light)", position: "sticky", top: 72, zIndex: 50, backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.8)" }}>
                    <div className="container">
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                            {/* Search Bar */}
                            <div style={{ flex: 1, minWidth: 300, position: "relative" }}>
                                <Search size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--text-lighter)" }} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "14px 18px 14px 50px",
                                        borderRadius: "var(--radius-md)",
                                        border: "1px solid var(--border)",
                                        fontSize: "1rem",
                                        background: "white",
                                        transition: "all 0.3s var(--ease-spring)",
                                        boxShadow: "var(--shadow-xs)"
                                    }}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        style={{
                                            position: "absolute",
                                            right: 16,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    padding: "14px 18px",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid var(--border)",
                                    fontSize: "1rem",
                                    background: "white",
                                    cursor: "pointer",
                                    minWidth: 220,
                                    boxShadow: "var(--shadow-xs)"
                                }}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>

                            {/* Clear Filters */}
                            {(searchTerm || selectedCategory !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    style={{
                                        padding: "12px 20px",
                                        borderRadius: 12,
                                        border: "1px solid var(--border)",
                                        background: "white",
                                        cursor: "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        color: "var(--text-light)"
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Results Count */}
                        <div style={{ marginTop: 16, color: "var(--text-light)", fontSize: "0.9rem" }}>
                            Showing {filteredProducts.length} of {products.length} products
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section style={{ padding: "80px 0" }}>
                    <div className="container">
                        {filteredProducts.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "80px 0" }}>
                                <Package size={64} style={{ color: "#cbd5e1", marginBottom: 24 }} />
                                <h3 style={{ color: "#475569", marginBottom: 12 }}>No products found</h3>
                                <p style={{ color: "#94a3b8", marginBottom: 24 }}>
                                    Try adjusting your search terms or filters
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="btn btn-primary"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid-3">
                                <AnimatePresence>
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <ProductCard product={product} index={index} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
