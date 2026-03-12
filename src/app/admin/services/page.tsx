"use client";
import { useState, useEffect } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Upload,
    Save,
    Settings,
    Search,
    Image as ImageIcon,
    Printer,
    Monitor,
    Package,
    Megaphone,
    Scissors,
    Shield,
    LucideIcon
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getSettings } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ServiceData {
    id: string;
    title: string;
    content: string;
    subtitle: string; // Used for icon name fallback
    image: string;
    active: boolean;
    order: number;
}

const iconMap: Record<string, LucideIcon> = {
    Printer, Monitor, Package, Megaphone, Scissors, Shield, Settings
};

const defaultServicesList: ServiceData[] = [
    {
        id: "default-1",
        title: "Offset Printing",
        content: "High-volume, cost-effective offset printing for business cards, letterheads, brochures, catalogues, and all corporate stationery. We deliver vivid, consistent colours using our state-of-the-art multi-colour offset press.",
        subtitle: "Printer",
        image: "",
        active: true,
        order: 1,
    },
    {
        id: "default-2",
        title: "Digital / Flex / Vinyl Printing",
        content: "From flex banners and vinyl wraps to high-resolution digital prints — we produce eye-catching large-format graphics for hoardings, retail signage, vehicle wraps, standees, and more.",
        subtitle: "Monitor",
        image: "",
        active: true,
        order: 2,
    },
    {
        id: "default-3",
        title: "Packaging Solutions",
        content: "Custom packaging for retail, pharma, food, and e-commerce. From mono cartons to corrugated boxes, we handle design, printing, die-cutting, and assembly — all in-house.",
        subtitle: "Package",
        image: "",
        active: true,
        order: 3,
    },
    {
        id: "default-4",
        title: "Promotional Items",
        content: "Branded merchandise that creates lasting impressions — T-shirts, mugs, pens, trophies, ID cards, bags, and more. Ideal for corporate events, trade shows, and team gifting.",
        subtitle: "Megaphone",
        image: "",
        active: true,
        order: 4,
    },
    {
        id: "default-5",
        title: "Finishing & Installation",
        content: "Complete post-press services including lamination, embossing, foiling, die-cutting, binding, and on-site installation of signage, glow boards, and acrylic displays.",
        subtitle: "Scissors",
        image: "",
        active: true,
        order: 5,
    },
];

export default function AdminServices() {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Confirmation dialog state
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string }>({
        isOpen: false,
        id: ""
    });

    const [form, setForm] = useState<ServiceData>({
        id: "",
        title: "",
        content: "",
        subtitle: "Printer",
        image: "",
        active: true,
        order: 0,
    });

    const fetchContent = async () => {
        try {
            const data = await getSettings();
            const content = data?.services_content as ServiceData[];
            if (content && Array.isArray(content) && content.length > 0) {
                setServices(content.sort((a, b) => (a.order || 0) - (b.order || 0)));
            } else {
                // If DB is empty, show defaults so user can edit them
                setServices(defaultServicesList);
            }
        } catch (error) {
            console.error("Load failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleOpenModal = (service: ServiceData | null = null) => {
        if (service) {
            setEditingService(service);
            setForm({ ...service });
        } else {
            setEditingService(null);
            setForm({
                id: crypto.randomUUID(),
                title: "",
                content: "",
                subtitle: "Printer",
                image: "",
                active: true,
                order: services.length + 1,
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
        formData.append("bucket", "services");

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
            let newServices;
            if (editingService) {
                newServices = services.map(s => s.id === editingService.id ? form : s);
            } else {
                newServices = [...services, form];
            }

            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ services_content: newServices }),
            });

            if (res.ok) {
                setServices(newServices.sort((a, b) => (a.order || 0) - (b.order || 0)));
                setShowModal(false);
                toast.success(editingService ? "Service updated" : "Service added");
            } else {
                toast.error("Save failed");
            }
        } catch (error) {
            console.error("Save error", error);
            toast.error("Save error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const newServices = services.filter(s => s.id !== id);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ services_content: newServices }),
            });
            if (res.ok) {
                setServices(newServices);
                toast.success("Service removed");
            } else {
                toast.error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("Delete error");
        }
    };

    const filteredServices = services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Platform Services</h1>
                    <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500 }}>Manage the end-to-end printing & branding offerings displayed on your site.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ background: "white", padding: "8px 16px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8, width: 280, boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                        <Search size={16} style={{ color: "#94a3b8" }} />
                        <input
                            placeholder="Search services..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.85rem", width: "100%", fontWeight: 500 }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ borderRadius: 12, gap: 10, height: 44, padding: "0 20px" }}>
                        <Plus size={18} /> Add Service
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: "100px 0" }}><LoadingSpinner size={32} /></div>
            ) : filteredServices.length === 0 ? (
                <div style={{ background: "white", borderRadius: 32, padding: "100px 40px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#cbd5e1" }}>
                        <Settings size={40} />
                    </div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: 12 }}>No services configured</h3>
                    <p style={{ color: "#64748b", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.6 }}>Define your core business offerings to show them on the public Services page.</p>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ borderRadius: 14, height: 48, padding: "0 28px" }}>
                        Create First Service
                    </button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 32 }}>
                    <AnimatePresence mode="popLayout">
                        {filteredServices.map((s, i) => {
                            const IconComp = iconMap[s.subtitle] || Settings;
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    key={s.id}
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
                                        height: 180,
                                        borderRadius: 20,
                                        background: s.image ? `url(${s.image})` : "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        marginBottom: 20,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                        overflow: "hidden",
                                        border: "1px solid rgba(0,0,0,0.03)"
                                    }}>
                                        {!s.image && <IconComp size={56} strokeWidth={1.5} style={{ color: "#94a3b8" }} />}
                                        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
                                            <button onClick={() => handleOpenModal(s)} style={{ width: 36, height: 36, borderRadius: 12, background: "white", border: "1px solid #f1f5f9", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}><Edit2 size={16} /></button>
                                            <button onClick={() => setDeleteConfirm({ isOpen: true, id: s.id })} style={{ width: 36, height: 36, borderRadius: 12, background: "#fef2f2", border: "1px solid #fee2e2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <div>
                                                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: 2 }}>{s.title}</h3>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <span style={{
                                                        padding: "4px 8px",
                                                        background: s.active ? "#ecfdf5" : "#fef2f2",
                                                        color: s.active ? "#10b981" : "#ef4444",
                                                        fontSize: "0.65rem",
                                                        fontWeight: 800,
                                                        borderRadius: 6,
                                                        textTransform: "uppercase"
                                                    }}>
                                                        {s.active ? "Active" : "Disabled"}
                                                    </span>
                                                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>Order: {s.order}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.6, marginBottom: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontWeight: 500 }}>
                                            {s.content || "No description provided."}
                                        </p>
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
                                maxWidth: 650,
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
                                    <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{editingService ? "Update Service" : "Add Service"}</h2>
                                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}>Configure the details for this offering.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} style={{ width: 44, height: 44, borderRadius: 14, background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><X size={22} /></button>
                            </div>

                            <form onSubmit={handleSave} style={{ padding: 40 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8, display: "block" }}>Service Title *</label>
                                        <input className="form-input" style={{ borderRadius: 14, height: 48, width: "100%", padding: "0 16px", border: "1px solid #e2e8f0", outline: "none" }} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Offset Printing" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8, display: "block" }}>Sort Order</label>
                                        <input type="number" className="form-input" style={{ borderRadius: 14, height: 48, width: "100%", padding: "0 16px", border: "1px solid #e2e8f0", outline: "none" }} value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: 24 }}>
                                    <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8, display: "block" }}>Detailed Description *</label>
                                    <textarea className="form-input" style={{ borderRadius: 14, minHeight: 120, width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", outline: "none", resize: "none" }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required placeholder="Describe what this service covers..." />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8, display: "block" }}>Icon Fallback</label>
                                        <select 
                                            className="form-input" 
                                            style={{ borderRadius: 14, height: 48, width: "100%", padding: "0 16px", border: "1px solid #e2e8f0", outline: "none" }} 
                                            value={form.subtitle} 
                                            onChange={e => setForm({ ...form, subtitle: e.target.value })}
                                        >
                                            {Object.keys(iconMap).map(icon => (
                                                <option key={icon} value={icon}>{icon}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 30 }}>
                                        <input type="checkbox" id="service-active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} style={{ width: 20, height: 20 }} />
                                        <label htmlFor="service-active" style={{ fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Active on Website</label>
                                    </div>
                                </div>

                                <div style={{ background: "#f8fafc", padding: 28, borderRadius: 24, border: "2px dashed #e2e8f0", marginBottom: 40 }}>
                                    <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 16, display: "block" }}>Showcase Image (Optional)</label>
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
                                            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 10, fontWeight: 500 }}>Upload an image to replace the default icon.</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 16 }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ flex: 1, borderRadius: 14, height: 50, fontWeight: 700 }} disabled={saving}>Discard</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2, borderRadius: 14, gap: 10, height: 50, fontSize: "1rem" }} disabled={saving || uploading}>
                                        {saving ? <LoadingSpinner size={20} color="white" /> : <Save size={20} />}
                                        {saving ? "Deploying..." : "Publish Changes"}
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
                title="Remove Service?"
                message="Are you sure you want to remove this service? It will be removed from the public page immediately."
                type="danger"
            />
        </div>
    );
}
