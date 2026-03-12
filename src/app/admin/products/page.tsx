"use client";
import { useState, useEffect } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    X,
    Upload,
    Package,
    Star,
    Image as ImageIcon,
    LayoutGrid,
    List,
    CheckCircle2,
    DollarSign
} from "lucide-react";
import { getProducts, getCategories } from "@/lib/data";
import type { Product, Category } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-hot-toast";

interface ProductFormData {
    id: string;
    slug: string;
    name: string;
    category_id: string;
    short_description: string;
    description: string;
    price: string;
    featured: boolean;
    image: string;
    gallery: string[];
    specifications: { label: string; value: string }[];
    materials: string[];
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isTable, setIsTable] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Confirmation dialog state
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; productId: string; productName: string }>({
        isOpen: false,
        productId: "",
        productName: ""
    });

    const [form, setForm] = useState<ProductFormData>({
        id: "",
        slug: "",
        name: "",
        category_id: "",
        short_description: "",
        description: "",
        price: "",
        featured: false,
        image: "",
        gallery: [],
        specifications: [],
        materials: [],
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [p, c] = await Promise.all([getProducts(), getCategories()]);
                setProducts(p);
                setCategories(c);
            } catch (error) {
                console.error("Load failed", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleOpenModal = (p: Product | null = null) => {
        if (p) {
            setEditingProduct(p);
            setForm({
                id: p.id,
                slug: p.slug,
                name: p.name,
                category_id: p.category_id || "",
                short_description: p.short_description || "",
                description: p.description || "",
                price: p.price?.toString() || "",
                featured: p.featured || false,
                image: p.image || "",
                gallery: p.gallery || [],
                specifications: (p.specifications as { label: string; value: string }[]) || [],
                materials: p.materials || [],
            });
        } else {
            setEditingProduct(null);
            setForm({
                id: `prod-${Date.now()}`,
                slug: "",
                name: "",
                category_id: categories[0]?.id || "",
                short_description: "",
                description: "",
                price: "",
                featured: false,
                image: "",
                gallery: [],
                specifications: [],
                materials: [],
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
        formData.append("bucket", "products");

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

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("bucket", "products");
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            return data.url;
        });

        try {
            const urls = await Promise.all(uploadPromises);
            setForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...urls] }));
        } catch (error) {
            console.error("Gallery upload error", error);
            toast.error("Some images failed to upload");
        } finally {
            setUploading(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        setForm(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...form,
            price: form.price ? parseFloat(form.price) : null,
        };

        try {
            const url = editingProduct
                ? `/api/admin/products/${editingProduct.id}`
                : "/api/admin/products";
            const method = editingProduct ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const refreshed = await getProducts();
                setProducts(refreshed);
                setShowModal(false);
                toast.success(editingProduct ? "Product updated" : "Product created");
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

    const handleDelete = async (id: string, name: string) => {
        setDeleteConfirm({
            isOpen: true,
            productId: id,
            productName: name
        });
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`/api/admin/products/${deleteConfirm.productId}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter((p) => p.id !== deleteConfirm.productId));
                toast.success("Product deleted");
            } else {
                toast.error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("Delete error");
        }
    };

    const addSpec = () => {
        setForm({ ...form, specifications: [...form.specifications, { label: "", value: "" }] });
    };

    const removeSpec = (index: number) => {
        setForm({ ...form, specifications: form.specifications.filter((_, i) => i !== index) });
    };

    const updateSpec = (index: number, field: "label" | "value", value: string) => {
        const newSpecs = [...form.specifications];
        newSpecs[index][field] = value;
        setForm({ ...form, specifications: newSpecs });
    };

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.short_description?.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === "all" || p.category_id === catFilter;
        return matchSearch && matchCat;
    });

    return (
        <>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
                    <div>
                        <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Product Inventory</h1>
                        <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500 }}>Manage your service offerings and physical goods.</p>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ background: "white", padding: "8px 16px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8, width: 280 }}>
                            <Search size={16} style={{ color: "#94a3b8" }} />
                            <input
                                placeholder="Search products..."
                                style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.85rem", width: "100%" }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ borderRadius: 12, gap: 8 }}>
                            <Plus size={18} /> New Product
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16 }}>
                    <div style={{ display: "flex", gap: 8, background: "white", padding: 6, borderRadius: 14, border: "1px solid #f1f5f9" }}>
                        <button
                            onClick={() => setCatFilter("all")}
                            className={`btn btn-sm ${catFilter === "all" ? "btn-primary" : "btn-ghost"}`}
                            style={{ borderRadius: 10, border: "none", background: catFilter === "all" ? "var(--primary)" : "transparent", color: catFilter === "all" ? "white" : "#64748b" }}
                        >
                            All Categories
                        </button>
                        {categories.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setCatFilter(c.id)}
                                className={`btn btn-sm ${catFilter === c.id ? "btn-primary" : "btn-ghost"}`}
                                style={{ borderRadius: 10, border: "none", background: catFilter === c.id ? "var(--primary)" : "transparent", color: catFilter === c.id ? "white" : "#64748b" }}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: 8, background: "#f1f5f9", padding: 4, borderRadius: 10 }}>
                        <button onClick={() => setIsTable(true)} style={{ width: 36, height: 36, borderRadius: 8, background: isTable ? "white" : "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: isTable ? "var(--primary)" : "#94a3b8", cursor: "pointer", boxShadow: isTable ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}>
                            <List size={18} />
                        </button>
                        <button onClick={() => setIsTable(false)} style={{ width: 36, height: 36, borderRadius: 8, background: !isTable ? "white" : "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: !isTable ? "var(--primary)" : "#94a3b8", cursor: "pointer", boxShadow: !isTable ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}>
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner size={32} fullPage />
                ) : filtered.length === 0 ? (
                    <div style={{ background: "white", borderRadius: 24, padding: "80px 40px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#cbd5e1" }}>
                            <Package size={40} />
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>No products found</h3>
                        <p style={{ color: "#64748b" }}>Try adjusting your filters or search query.</p>
                    </div>
                ) : isTable ? (
                    <div className="admin-card" style={{ padding: 0, overflow: "hidden", border: "1px solid #f1f5f9", borderRadius: 24 }}>
                        <table className="admin-table" style={{ margin: 0 }}>
                            <thead style={{ background: "#f8fafc" }}>
                                <tr>
                                    <th style={{ padding: "20px 24px" }}>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Featured</th>
                                    <th style={{ textAlign: "right", paddingRight: 24 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filtered.map((p, i) => {
                                        const cat = categories.find(c => c.id === p.category_id);
                                        return (
                                            <motion.tr
                                                key={p.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                            >
                                                <td style={{ padding: "20px 24px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                        <div style={{ width: 56, height: 44, borderRadius: 10, background: p.image ? `url(${p.image})` : "#f8fafc", backgroundSize: "cover", backgroundPosition: "center", border: "1px solid #f1f5f9", flexShrink: 0 }}>
                                                            {!p.image && <ImageIcon size={20} style={{ margin: "12px", color: "#cbd5e1" }} />}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontWeight: 800, color: "#1e293b" }}>{p.name}</p>
                                                            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{p.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge" style={{ background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: "0.7rem", padding: "4px 10px" }}>
                                                        {cat?.name || "Uncategorized"}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 600, color: "#1e293b" }}>
                                                    {p.price ? (
                                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                            <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>₹</span>{p.price.toLocaleString()}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontStyle: "italic" }}>On request</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {p.featured ? (
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#f59e0b" }}>
                                                            <Star size={14} fill="#f59e0b" />
                                                            <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Featured</span>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>Standard</span>
                                                    )}
                                                </td>
                                                <td style={{ paddingRight: 24 }}>
                                                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                        <button onClick={() => handleOpenModal(p)} style={{ width: 34, height: 34, padding: 0, background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Edit"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(p.id, p.name)} style={{ width: 34, height: 34, padding: 0, background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Delete"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                        <AnimatePresence mode="popLayout">
                            {filtered.map((p, i) => (
                                <motion.div
                                    layout
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    style={{ background: "white", borderRadius: 24, padding: 20, border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}
                                >
                                    <div style={{ height: 180, borderRadius: 16, background: p.image ? `url(${p.image})` : "#f8fafc", backgroundSize: "cover", backgroundPosition: "center", marginBottom: 16, position: "relative" }}>
                                        {p.featured && (
                                            <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(245, 158, 11, 0.9)", color: "white", padding: "4px 10px", borderRadius: 100, fontSize: "0.65rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                                                <Star size={10} fill="white" /> FEATURED
                                            </div>
                                        )}
                                        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
                                            <button onClick={() => handleOpenModal(p)} style={{ width: 32, height: 32, borderRadius: 8, background: "white", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(p.id, p.name)} style={{ width: 32, height: 32, borderRadius: 8, background: "#fef2f2", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1e293b", marginBottom: 6 }}>{p.name}</h3>
                                    <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5, marginBottom: 16, height: 40, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                        {p.short_description || "No description provided."}
                                    </p>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ fontWeight: 800, color: "var(--primary)" }}>
                                            {p.price ? `₹${p.price.toLocaleString()}` : "Contact for Price"}
                                        </div>
                                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>
                                            {categories.find(c => c.id === p.category_id)?.name || "Uncategorized"}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} />
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                style={{
                                    width: "100%",
                                    maxWidth: 900,
                                    maxHeight: "90vh",
                                    background: "white",
                                    borderRadius: 32,
                                    position: "relative",
                                    zIndex: 1,
                                    overflow: "hidden",
                                    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                <div style={{ padding: "32px 40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                                    <div>
                                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{editingProduct ? "Edit Product" : "New Product"}</h2>
                                        <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Fill in the details to list this item on the catalog.</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} style={{ width: 40, height: 40, borderRadius: 12, background: "#f8fafc", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><X size={20} /></button>
                                </div>

                                <form onSubmit={handleSave} style={{ padding: 40, overflowY: "auto", flex: 1 }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
                                        {/* Left Column: Core Info */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                                <div className="form-group">
                                                    <label className="form-label" style={{ fontWeight: 700 }}>Product Name *</label>
                                                    <input className="form-input" style={{ borderRadius: 12 }} value={form.name} onChange={e => {
                                                        const name = e.target.value;
                                                        setForm({ ...form, name, slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') });
                                                    }} required placeholder="e.g. Offset Printing Press" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label" style={{ fontWeight: 700 }}>Slug *</label>
                                                    <input className="form-input" style={{ borderRadius: 12 }} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
                                                </div>
                                            </div>

                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                                <div className="form-group">
                                                    <label className="form-label" style={{ fontWeight: 700 }}>Category *</label>
                                                    <select className="form-select" style={{ borderRadius: 12 }} value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required>
                                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label" style={{ fontWeight: 700 }}>Price (₹)</label>
                                                    <div style={{ position: "relative" }}>
                                                        <DollarSign size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                                                        <input className="form-input" style={{ borderRadius: 12, paddingLeft: 34 }} type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" style={{ fontWeight: 700 }}>Short Description</label>
                                                <textarea className="form-input" style={{ borderRadius: 12, height: 80, resize: "none" }} value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} placeholder="Brief summary for catalog view..." />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" style={{ fontWeight: 700 }}>Full Description</label>
                                                <textarea className="form-input" style={{ borderRadius: 12, height: 160, resize: "none" }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed product information..." />
                                            </div>

                                            <div style={{ display: "flex", gap: 12, background: "#f8fafc", padding: 20, borderRadius: 20 }}>
                                                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ width: 22, height: 22, borderRadius: 6 }} />
                                                <div>
                                                    <label style={{ fontWeight: 700, display: "block", marginBottom: 2 }}>Featured Product</label>
                                                    <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Highlight this product on the main landing page.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Assets & Specs */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                            {/* Main Asset */}
                                            <div style={{ background: "#f8fafc", padding: 24, borderRadius: 24, border: "1px dashed #e2e8f0" }}>
                                                <label className="form-label" style={{ fontWeight: 700, marginBottom: 12 }}>Cover Image</label>
                                                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                                                    <div style={{ width: 120, height: 90, borderRadius: 16, background: "white", flexShrink: 0, overflow: "hidden", border: "2px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                                                        {form.image ? (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                        ) : (
                                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" }}>
                                                                <ImageIcon size={32} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <label className="btn btn-ghost" style={{ cursor: "pointer", width: "100%", borderRadius: 12, background: "white", border: "1px solid #e2e8f0", gap: 8 }}>
                                                            {uploading ? <LoadingSpinner size={16} color="#475569" /> : <Upload size={16} />}
                                                            {uploading ? "Uploading..." : "Upload New"}
                                                            <input type="file" hidden accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Specs */}
                                            <div style={{ background: "white", padding: 24, borderRadius: 24, border: "1px solid #f1f5f9" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                                    <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Specifications</h3>
                                                    <button type="button" onClick={addSpec} style={{ padding: "4px 10px", borderRadius: 8, background: "#f1f5f9", border: "none", fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}><Plus size={12} /> Add Row</button>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                    {form.specifications.map((spec, i) => (
                                                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}>
                                                            <input className="form-input" style={{ borderRadius: 8, padding: 8, fontSize: "0.85rem" }} placeholder="Label" value={spec.label} onChange={e => updateSpec(i, "label", e.target.value)} />
                                                            <input className="form-input" style={{ borderRadius: 8, padding: 8, fontSize: "0.85rem" }} placeholder="Value" value={spec.value} onChange={e => updateSpec(i, "value", e.target.value)} />
                                                            <button type="button" onClick={() => removeSpec(i)} style={{ border: "none", background: "none", color: "#94a3b8", cursor: "pointer" }}><X size={14} /></button>
                                                        </div>
                                                    ))}
                                                    {form.specifications.length === 0 && <p style={{ fontSize: "0.8rem", color: "#94a3b8", textAlign: "center", fontStyle: "italic" }}>No details defined.</p>}
                                                </div>
                                            </div>

                                            {/* Gallery */}
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                                    <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Gallery Assets</h3>
                                                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                                        <Plus size={14} /> Add Images
                                                        <input type="file" hidden accept="image/*" multiple onChange={handleGalleryUpload} />
                                                    </label>
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                                                    {form.gallery.map((url, i) => (
                                                        <div key={i} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", border: "1px solid #f1f5f9" }}>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */
                                                                <img src={url} alt={`Gallery ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGalleryImage(i)}
                                                                style={{ position: "absolute", top: 4, right: 4, background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#dc2626" }}
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <label style={{ aspectRatio: "4/3", borderRadius: 12, border: "2px dashed #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#cbd5e1" }}>
                                                        <ImageIcon size={24} />
                                                        <input type="file" hidden accept="image/*" multiple onChange={handleGalleryUpload} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <div style={{ padding: "32px 40px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 16, background: "#f8fafc", flexShrink: 0 }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ borderRadius: 12, padding: "12px 24px" }}>Cancel</button>
                                    <button type="submit" onClick={handleSave} className="btn btn-primary" style={{ borderRadius: 12, padding: "12px 32px", gap: 10 }} disabled={saving || uploading}>
                                        {saving ? <LoadingSpinner size={20} color="white" /> : <CheckCircle2 size={20} />}
                                        {saving ? "Saving Changes..." : editingProduct ? "Update Listing" : "Create Listing"}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteConfirm.productName}"? This action cannot be undone and will permanently remove the product from the database.`}
                confirmText="Delete Product"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
}
