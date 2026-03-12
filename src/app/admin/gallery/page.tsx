"use client";
import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    X,
    Upload,
    Image as ImageIcon,
    Video,
    Search,
    CheckCircle2
} from "lucide-react";
import { getGalleryItems } from "@/lib/data";
import type { GalleryItem } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface GalleryFormData {
    title: string;
    category: string;
    type: "image" | "video";
    src: string;
    thumbnail: string;
    sort_order: number;
}

export default function AdminGallery() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    // Confirmation dialog state
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string }>({
        isOpen: false,
        id: ""
    });

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState<GalleryFormData>({
        title: "",
        category: "Printing",
        type: "image",
        src: "",
        thumbnail: "",
        sort_order: 0,
    });

    useEffect(() => {
        getGalleryItems().then(data => {
            setItems(data);
            setLoading(false);
        });
    }, []);

    const handleOpenModal = () => {
        setForm({
            title: "",
            category: "Printing",
            type: "image",
            src: "",
            thumbnail: "",
            sort_order: items.length + 1,
        });
        setShowModal(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "src" | "thumbnail") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "gallery");

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setForm(prev => ({ ...prev, [field]: data.url }));
                toast.success("File uploaded successfully");
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
            const res = await fetch("/api/admin/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const refreshed = await getGalleryItems();
                setItems(refreshed);
                setShowModal(false);
                toast.success("Asset added to gallery");
            } else {
                const data = await res.json();
                toast.error("Save failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Save error", error);
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems(items.filter(i => i.id !== id));
                toast.success("Item removed from gallery");
            } else {
                toast.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("Error deleting item");
        }
    };

    const filtered = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "all" || item.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const categories = ["all", ...new Set(items.map(i => i.category))];

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Media Gallery</h1>
                    <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500 }}>Upload and manage your professional portfolio assets.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ background: "white", padding: "8px 16px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8, width: 280 }}>
                        <Search size={16} style={{ color: "#94a3b8" }} />
                        <input
                            placeholder="Search assets..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.85rem", width: "100%" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={handleOpenModal} className="btn btn-primary" style={{ borderRadius: 12, gap: 8 }}>
                        <Plus size={18} /> Add Media
                    </button>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, background: "white", padding: 6, borderRadius: 14, border: "1px solid #f1f5f9", width: "fit-content", marginBottom: 32 }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`btn btn-sm ${activeFilter === cat ? "btn-primary" : "btn-ghost"}`}
                        style={{ borderRadius: 10, border: "none", background: activeFilter === cat ? "var(--primary)" : "transparent", color: activeFilter === cat ? "white" : "#64748b", textTransform: "capitalize" }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <LoadingSpinner size={32} fullPage />
            ) : filtered.length === 0 ? (
                <div style={{ background: "white", borderRadius: 24, padding: "80px 40px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#cbd5e1" }}>
                        <ImageIcon size={40} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>Empty Gallery</h3>
                    <p style={{ color: "#64748b" }}>You haven&apos;t added any media items to this section yet.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
                    <AnimatePresence mode="popLayout">
                        {filtered.map((item, i) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                style={{
                                    background: "white",
                                    borderRadius: 24,
                                    overflow: "hidden",
                                    border: "1px solid #f1f5f9",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                    position: "relative"
                                }}
                            >
                                <div style={{ aspectRatio: "4/3", position: "relative" }}>
                                    {item.type === "video" ? (
                                        <div style={{ width: "100%", height: "100%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {item.thumbnail ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={item.thumbnail} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
                                            ) : (
                                                <Video size={40} style={{ color: "rgba(255,255,255,0.2)" }} />
                                            )}
                                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                                                    <Video size={20} fill="white" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={item.src} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    )}
                                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                                        <span style={{ fontSize: "0.65rem", fontWeight: 800, background: "rgba(255,255,255,0.9)", color: "#1e293b", padding: "4px 10px", borderRadius: 100, border: "1px solid #e2e8f0" }}>
                                            {item.category.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
                                        <button onClick={() => setDeleteConfirm({ isOpen: true, id: item.id })} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(254, 226, 226, 0.9)", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div style={{ padding: 16 }}>
                                    <h3 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</h3>
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
                                maxWidth: 500,
                                background: "white",
                                borderRadius: 32,
                                position: "relative",
                                zIndex: 1,
                                overflow: "hidden",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
                            }}
                        >
                            <div style={{ padding: "32px 40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Add Media</h2>
                                <button onClick={() => setShowModal(false)} style={{ width: 40, height: 40, borderRadius: 12, background: "#f8fafc", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} style={{ padding: 40 }}>
                                <div className="form-group" style={{ marginBottom: 24 }}>
                                    <label className="form-label" style={{ fontWeight: 700 }}>Title & Context *</label>
                                    <input className="form-input" style={{ borderRadius: 12 }} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Modern Office Signage" />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700 }}>Category *</label>
                                        <select className="form-select" style={{ borderRadius: 12 }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                                            <option value="Flex">Flex / Vinyl</option>
                                            <option value="Printing">Printing Items</option>
                                            <option value="Promotional">Promotional Items</option>
                                            <option value="Installations">Installations</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700 }}>Type *</label>
                                        <select className="form-select" style={{ borderRadius: 12 }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value as "image" | "video" })} required>
                                            <option value="image">Still Image</option>
                                            <option value="video">Motion Video</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ background: "#f8fafc", padding: 24, borderRadius: 24, border: "1px dashed #e2e8f0", marginBottom: 32 }}>
                                    <label className="form-label" style={{ fontWeight: 700, marginBottom: 16 }}>Primary Media Asset *</label>
                                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                                        <div style={{ width: 80, height: 80, borderRadius: 16, background: "white", flexShrink: 0, overflow: "hidden", border: "2px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {form.src ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                form.type === "image" ? <img src={form.src} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Video size={32} style={{ color: "var(--primary)" }} />
                                            ) : (
                                                <Upload size={32} style={{ color: "#cbd5e1" }} />
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="btn btn-ghost" style={{ cursor: "pointer", width: "100%", borderRadius: 12, background: "white", border: "1px solid #e2e8f0", gap: 8 }}>
                                                {uploading ? <LoadingSpinner size={16} color="#475569" /> : <Upload size={16} />}
                                                {uploading ? "Uploading..." : "Select File"}
                                                <input type="file" hidden accept={form.type === "image" ? "image/*" : "video/*"} onChange={(e) => handleFileUpload(e, "src")} disabled={uploading} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {form.type === "video" && (
                                    <div style={{ background: "#f8fafc", padding: 24, borderRadius: 24, border: "1px dashed #e2e8f0", marginBottom: 32, marginTop: -16 }}>
                                        <label className="form-label" style={{ fontWeight: 700, marginBottom: 16 }}>Video Thumbnail</label>
                                        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                                            <div style={{ width: 80, height: 80, borderRadius: 16, background: "white", flexShrink: 0, overflow: "hidden", border: "2px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */
                                                    form.thumbnail ? <img src={form.thumbnail} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon size={32} style={{ color: "#cbd5e1" }} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label className="btn btn-ghost" style={{ cursor: "pointer", width: "100%", borderRadius: 12, background: "white", border: "1px solid #e2e8f0", gap: 8 }}>
                                                    <Upload size={16} /> Change Poster
                                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, "thumbnail")} disabled={uploading} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: 16 }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ flex: 1, borderRadius: 12 }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2, borderRadius: 12, gap: 10 }} disabled={saving || uploading || !form.src}>
                                        {saving ? <LoadingSpinner size={20} color="white" /> : <CheckCircle2 size={20} />}
                                        {saving ? "Deploying..." : "Add to Gallery"}
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
                title="Delete Asset?"
                message="Are you sure you want to remove this item from the gallery? This action cannot be undone."
                type="danger"
            />
        </div>
    );
}
