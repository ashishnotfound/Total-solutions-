"use client";
import { useState, useEffect } from "react";
import {
    Trash2,
    Eye,
    Mail,
    Phone,
    Search,
    Clock,
    User,
    MessageSquare,
    CheckCircle2,
    X
} from "lucide-react";
import type { Quote } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminQuotes() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    // Confirmation dialog state
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string }>({
        isOpen: false,
        id: ""
    });

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await fetch("/api/admin/quotes");
                if (res.ok) {
                    const data = await res.json();
                    setQuotes(data.quotes || []);
                }
            } catch {
                console.error("Failed to fetch quotes");
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/quotes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setQuotes(quotes.map(q => q.id === id ? { ...q, status } as Quote : q));
                if (selectedQuote?.id === id) setSelectedQuote({ ...selectedQuote, status } as Quote);
                toast.success(`Quote marked as ${status}`);
            }
        } catch {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/quotes/${id}`, { method: "DELETE" });
            if (res.ok) {
                setQuotes(quotes.filter(q => q.id !== id));
                if (selectedQuote?.id === id) setSelectedQuote(null);
                toast.success("Quote deleted");
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    const filtered = (filter === "all" ? quotes : quotes.filter(q => q.status === filter)).filter(q =>
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.product || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "new": return { bg: "#eff6ff", text: "#2563eb", icon: <Clock size={12} /> };
            case "contacted": return { bg: "#fefce8", text: "#ca8a04", icon: <User size={12} /> };
            case "closed": return { bg: "#f0fdf4", text: "#16a34a", icon: <CheckCircle2 size={12} /> };
            default: return { bg: "#f8fafc", text: "#64748b", icon: <Clock size={12} /> };
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Quote Requests</h1>
                    <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500 }}>Manage customer leads and service inquiries.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ background: "white", padding: "8px 16px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8, width: 280 }}>
                        <Search size={16} style={{ color: "#94a3b8" }} />
                        <input
                            placeholder="Search leads..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.85rem", width: "100%" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, background: "white", padding: 6, borderRadius: 14, border: "1px solid #f1f5f9", width: "fit-content", marginBottom: 32 }}>
                {(["all", "new", "contacted", "closed"] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
                        style={{ borderRadius: 10, border: "none", background: filter === f ? "var(--primary)" : "transparent", color: filter === f ? "white" : "#64748b", textTransform: "capitalize", paddingLeft: 16, paddingRight: 16 }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ background: "white", borderRadius: 24, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                {loading ? (
                    <div style={{ padding: 100, display: "flex", justifyContent: "center" }}>
                        <LoadingSpinner size={32} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 100, textAlign: "center" }}>
                        <div style={{ width: 64, height: 64, background: "#f8fafc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#cbd5e1" }}>
                            <MessageSquare size={32} />
                        </div>
                        <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>No requests found</h3>
                        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                                <th style={{ padding: "16px 24px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer</th>
                                <th style={{ padding: "16px 24px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Requirement</th>
                                <th style={{ padding: "16px 24px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quantity</th>
                                <th style={{ padding: "16px 24px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                                <th style={{ padding: "16px 24px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
                                <th style={{ padding: "16px 24px", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filtered.map((q) => {
                                    const status = getStatusStyles(q.status);
                                    return (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={q.id}
                                            style={{ borderBottom: "1px solid #f1f5f9" }}
                                        >
                                            <td style={{ padding: "16px 24px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontWeight: 700, fontSize: "0.9rem" }}>
                                                        {q.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>{q.name}</p>
                                                        <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{q.email || q.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px 24px" }}>
                                                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>{q.product || "General inquiry"}</p>
                                            </td>
                                            <td style={{ padding: "16px 24px", fontSize: "0.85rem", color: "#64748b" }}>{q.quantity || "—"}</td>
                                            <td style={{ padding: "16px 24px" }}>
                                                <div style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    padding: "4px 10px",
                                                    borderRadius: 100,
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700,
                                                    background: status.bg,
                                                    color: status.text,
                                                    textTransform: "uppercase"
                                                }}>
                                                    {status.icon}
                                                    {q.status}
                                                </div>
                                            </td>
                                            <td style={{ padding: "16px 24px", fontSize: "0.8rem", color: "#94a3b8" }}>{new Date(q.created_at).toLocaleDateString()}</td>
                                            <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                    <button onClick={() => setSelectedQuote(q)} style={{ width: 32, height: 32, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="View"><Eye size={14} /></button>
                                                    <button onClick={() => setDeleteConfirm({ isOpen: true, id: q.id })} style={{ width: 32, height: 32, borderRadius: 10, background: "#fef2f2", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Delete"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedQuote && (
                    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedQuote(null)} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            style={{
                                width: "100%",
                                maxWidth: 640,
                                background: "white",
                                borderRadius: 32,
                                position: "relative",
                                zIndex: 1,
                                overflow: "hidden",
                                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
                            }}
                        >
                            <div style={{ padding: "32px 40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "#eff6ff", color: "#2563eb", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>
                                        <Clock size={12} />
                                        Quote Request #{selectedQuote.id.slice(0, 6)}
                                    </div>
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Lead Details</h2>
                                </div>
                                <button onClick={() => setSelectedQuote(null)} style={{ width: 40, height: 40, borderRadius: 12, background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><X size={20} /></button>
                            </div>

                            <div style={{ padding: 40 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
                                    <div>
                                        <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Customer Info</p>
                                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>{selectedQuote.name}</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            <a href={`mailto:${selectedQuote.email}`} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--primary)", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}><Mail size={16} /> {selectedQuote.email}</a>
                                            <a href={`tel:${selectedQuote.phone}`} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--primary)", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}><Phone size={16} /> {selectedQuote.phone}</a>
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Product Required</p>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{selectedQuote.product || "General Inquiry"}</h3>
                                        <p style={{ fontSize: "0.95rem", color: "#64748b" }}>Quantity: <span style={{ fontWeight: 700, color: "#1e293b" }}>{selectedQuote.quantity || "Not specified"}</span></p>
                                    </div>
                                </div>

                                <div style={{ background: "#f8fafc", padding: 24, borderRadius: 24, border: "1px solid #f1f5f9", marginBottom: 40 }}>
                                    <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Brief / Message</p>
                                    <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "#475569", fontWeight: 500 }}>{selectedQuote.message || "No additional requirements provided."}</p>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", gap: 12 }}>
                                        {selectedQuote.status === 'new' && (
                                            <button
                                                onClick={() => handleStatusChange(selectedQuote.id, "contacted")}
                                                className="btn btn-primary"
                                                style={{ borderRadius: 12, gap: 8 }}
                                            >
                                                <User size={18} /> Mark Contacted
                                            </button>
                                        )}
                                        {selectedQuote.status !== 'closed' && (
                                            <button
                                                onClick={() => handleStatusChange(selectedQuote.id, "closed")}
                                                className="btn btn-ghost"
                                                style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                                            >
                                                <CheckCircle2 size={18} /> Close Lead
                                            </button>
                                        )}
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Received on {new Date(selectedQuote.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: "" })}
                onConfirm={() => handleDelete(deleteConfirm.id)}
                title="Delete Quote Request?"
                message="Are you sure you want to delete this quote request? This action cannot be undone."
                type="danger"
            />
        </div>
    );
}
