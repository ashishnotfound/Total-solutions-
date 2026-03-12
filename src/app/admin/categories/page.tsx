"use client";
import { useState, useEffect } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Upload,
    Save,
    Layers,
    Search,
    ArrowRight,
    Image as ImageIcon,
    ExternalLink
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getCategories, getProducts } from "@/lib/data";
import type { Category, Product } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface CategoryFormData {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
    icon: string;
    sort_order: number;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Confirmation dialog state
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string }>({
        isOpen: false,
        id: ""
    });

    const [form, setForm] = useState<CategoryFormData>({
        id: "",
        slug: "",
        name: "",
        description: "",
        image: "",
        icon: "Package",
        sort_order: 0,
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
                setCategories(cats);
                setProducts(prods);
            } catch (error) {
                console.error("Load failed", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleOpenModal = (cat: Category | null = null) => {
        if (cat) {
            setEditingCategory(cat);
            setForm({
                id: cat.id,
                slug: cat.slug,
                name: cat.name,
                description: cat.description || "",
                image: cat.image || "",
                icon: cat.icon || "Package",
                sort_order: cat.sort_order || 0,
            });
        } else {
            setEditingCategory(null);
            setForm({
                id: `cat-${Date.now()}`,
                slug: "",
                name: "",
                description: "",
                image: "",
                icon: "Package",
                sort_order: categories.length + 1,
            });
        }
        setShowModal(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "categories");

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setForm(prev => ({ ...prev, image: data.url }));
                toast.success("Image uploaded");
            } else {
                toast.error("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Upload error");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory.id}`
                : "/api/admin/categories";
            const method = editingCategory ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                const refreshed = await getCategories();
                setCategories(refreshed);
                setShowModal(false);
                toast.success(editingCategory ? "Category updated" : "Category created");
            } else {
                const data = await res.json();
                toast.error("Save failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Save error", error);
            toast.error("Save error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const hasProducts = products.some(p => p.category_id === id);
        if (hasProducts) {
            toast.error("Cannot delete category with associated products");
            return;
        }

        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
                toast.success("Category deleted");
            } else {
                toast.error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("Delete error");
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Product Categories</h1>
                    <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500 }}>Organize and manage your product catalog segments.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ background: "white", padding: "8px 16px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8, width: 280, boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                        <Search size={16} style={{ color: "#94a3b8" }} />
                        <input
                            placeholder="Search categories..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.85rem", width: "100%", fontWeight: 500 }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ borderRadius: 12, gap: 10, height: 44, padding: "0 20px" }}>
                        <Plus size={18} /> Add Category
                    </button>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner size={32} fullPage />
            ) : filteredCategories.length === 0 ? (
                <div style={{ background: "white", borderRadius: 32, padding: "100px 40px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#cbd5e1" }}>
                        <Layers size={40} />
                    </div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: 12 }}>No categories found</h3>
                    <p style={{ color: "#64748b", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.6 }}>Try adjusting your search or create a new category to get started with your catalog.</p>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ borderRadius: 14, height: 48, padding: "0 28px" }}>
                        Create First Category
                    </button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 32 }}>
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.map((cat, i) => {
                            const count = products.filter(p => p.category_id === cat.id).length;
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    key={cat.id}
                                    style={{
                                        background: "white",
                                        borderRadius: 28,
                                        padding: "24px",
                                        border: "1px solid #f1f5f9",
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04)",
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        overflow: "hidden"
                                    }}
                                >
                                    <div style={{
                                        height: 200,
                                        borderRadius: 20,
                                        background: cat.image ? `url(${cat.image})` : "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        marginBottom: 20,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                        overflow: "hidden"
                                    }}>
                                        {!cat.image && <Layers size={48} style={{ color: "#cbd5e1" }} />}
                                        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8 }}>
                                            <span style={{
                                                padding: "6px 12px",
                                                background: "rgba(255,255,255,0.9)",
                                                backdropFilter: "blur(8px)",
                                                borderRadius: 100,
                                                fontSize: "0.7rem",
                                                fontWeight: 800,
                                                color: "var(--primary)",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                            }}>
                                                {count} Products
                                            </span>
                                        </div>
                                        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
                                            <button onClick={() => handleOpenModal(cat)} style={{ width: 36, height: 36, borderRadius: 12, background: "white", border: "1px solid #f1f5f9", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}><Edit2 size={16} /></button>
                                            <button onClick={() => setDeleteConfirm({ isOpen: true, id: cat.id })} style={{ width: 36, height: 36, borderRadius: 12, background: "#fef2f2", border: "1px solid #fee2e2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <div>
                                                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: 2 }}>{cat.name}</h3>
                                                <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <ExternalLink size={10} /> /{cat.slug}
                                                </p>
                                            </div>
                                            <span style={{ width: 32, height: 32, borderRadius: 10, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: "#64748b", border: "1px solid #f1f5f9" }}>
                                                {cat.sort_order}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.6, marginBottom: 24, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontWeight: 500 }}>
                                            {cat.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div style={{ paddingTop: 20, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                        <Link href={`/admin/products?category=${cat.id}`} style={{
                                            padding: "8px 16px",
                                            borderRadius: 12,
                                            background: "#f8fafc",
                                            fontSize: "0.85rem",
                                            fontWeight: 700,
                                            color: "var(--primary)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            textDecoration: "none",
                                            transition: "all 0.2s"
                                        }}>
                                            Manage Items <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} />
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            style={{
                                width: "100%",
                                maxWidth: 600,
                                background: "white",
                                borderRadius: 32,
                                position: "relative",
                                zIndex: 1,
                                overflow: "hidden",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            }}
                        >
                            <div style={{ padding: "32px 40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{editingCategory ? "Update Category" : "Build Category"}</h2>
                                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}>Define your catalog segment here.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} style={{ width: 44, height: 44, borderRadius: 14, background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><X size={22} /></button>
                            </div>

                            <form onSubmit={handleSave} style={{ padding: 40 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem" }}>Display Name *</label>
                                        <input className="form-input" style={{ borderRadius: 14, height: 48 }} value={form.name} onChange={e => {
                                            const name = e.target.value;
                                            const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
                                            setForm({ ...form, name, slug });
                                        }} required placeholder="e.g. Digital Printing" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem" }}>URL Slug *</label>
                                        <input className="form-input" style={{ borderRadius: 14, height: 48 }} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required placeholder="digital-printing" />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: 24 }}>
                                    <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem" }}>Marketing Description</label>
                                    <textarea className="form-input" style={{ borderRadius: 14, minHeight: 110, resize: "none", padding: "12px 16px" }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Write a short summary of this category..." />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem" }}>Display Priority</label>
                                        <input type="number" className="form-input" style={{ borderRadius: 14, height: 48 }} value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem" }}>Interface Icon</label>
                                        <div style={{ display: "flex", gap: 12 }}>
                                            <input className="form-input" style={{ borderRadius: 14, height: 48 }} value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Package" />
                                            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
                                                <Layers size={22} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: "#f8fafc", padding: 28, borderRadius: 24, border: "2px dashed #e2e8f0", marginBottom: 40 }}>
                                    <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 16, display: "block" }}>Showcase Image</label>
                                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                                        <div style={{ width: 110, height: 110, borderRadius: 20, background: "white", flexShrink: 0, overflow: "hidden", border: "3px solid white", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                                            {form.image ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" }}>
                                                    <ImageIcon size={36} />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="btn" style={{
                                                cursor: "pointer",
                                                width: "100%",
                                                borderRadius: 14,
                                                background: "white",
                                                border: "1px solid #e2e8f0",
                                                gap: 10,
                                                height: 48,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 700,
                                                color: "#475569",
                                                fontSize: "0.9rem",
                                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                            }}>
                                                {uploading ? <LoadingSpinner size={18} color="#475569" /> : <Upload size={18} />}
                                                {uploading ? "Uploading..." : "Select Asset"}
                                                <input type="file" hidden accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                            </label>
                                            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 10, fontWeight: 500 }}>High resolution PNG or JPG recommended.</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 16 }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ flex: 1, borderRadius: 14, height: 50, fontWeight: 700 }} disabled={saving}>Discard</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2, borderRadius: 14, gap: 10, height: 50, fontSize: "1rem" }} disabled={saving || uploading}>
                                        {saving ? <LoadingSpinner size={20} color="white" /> : <Save size={20} />}
                                        {saving ? "Deploying..." : "Save Configuration"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: "" })}
                onConfirm={() => handleDelete(deleteConfirm.id)}
                title="Delete Category?"
                message="Are you sure you want to delete this category? This action cannot be undone."
                type="danger"
            />
        </div>
    );
}

