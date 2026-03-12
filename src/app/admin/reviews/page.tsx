"use client";
import { useState, useEffect } from "react";
import {
    Star,
    Trash2,
    Search,
    MessageCircle,
    Clock,
    ThumbsUp,
    ThumbsDown
} from "lucide-react";
import type { Review } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Confirmation dialog state
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string }>({
        isOpen: false,
        id: ""
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/admin/reviews");
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews || []);
                }
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const filtered = reviews.filter(r => {
        const matchesFilter = filter === "all" || r.status === filter;
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
                toast.success(`Review ${status}`);
            } else {
                toast.error("Status update failed");
            }
        } catch {
            toast.error("Status update error");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== id));
                toast.success("Review deleted");
            } else {
                toast.error("Delete failed");
            }
        } catch {
            toast.error("Delete error");
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Reviews Moderation</h1>
                    <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500 }}>Manage customer feedback and digital reputation.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ background: "white", padding: "8px 16px", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8, width: 240 }}>
                        <Search size={16} style={{ color: "#94a3b8" }} />
                        <input
                            placeholder="Search reviews..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.85rem", width: "100%" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap", background: "white", padding: 6, borderRadius: 14, border: "1px solid #f1f5f9", width: "fit-content" }}>
                {(["all", "pending", "approved", "rejected"] as const).map(f => {
                    const isActive = filter === f;
                    const count = f === "all" ? reviews.length : reviews.filter(r => r.status === f).length;
                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"}`}
                            style={{
                                textTransform: "capitalize",
                                borderRadius: 10,
                                background: isActive ? "var(--primary)" : "transparent",
                                color: isActive ? "white" : "#64748b",
                                border: "none",
                                padding: "8px 16px",
                                fontWeight: isActive ? 700 : 500
                            }}
                        >
                            {f} <span style={{ opacity: 0.6, fontSize: "0.7rem", marginLeft: 4 }}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <LoadingSpinner size={32} fullPage />
            ) : filtered.length === 0 ? (
                <div style={{ background: "white", borderRadius: 24, padding: "80px 40px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#cbd5e1" }}>
                        <MessageCircle size={40} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>No reviews found</h3>
                    <p style={{ color: "#64748b" }}>We couldn&apos;t find any reviews matching your criteria.</p>
                </div>
            ) : (
                <div className="admin-card" style={{ padding: 0, overflow: "hidden", border: "1px solid #f1f5f9", borderRadius: 24 }}>
                    <table className="admin-table" style={{ margin: 0 }}>
                        <thead>
                            <tr style={{ background: "#f8fafc" }}>
                                <th style={{ padding: "20px 24px" }}>Customer</th>
                                <th>Rating</th>
                                <th>Feedback</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th style={{ textAlign: "right", paddingRight: 24 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filtered.map((r, i) => (
                                    <motion.tr
                                        key={r.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                    >
                                        <td style={{ padding: "20px 24px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                                                    {r.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 700, color: "#1e293b" }}>{r.name}</p>
                                                    <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{r.company || "Direct Customer"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: 2 }}>
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star
                                                        key={idx}
                                                        size={14}
                                                        fill={idx < r.rating ? "#f59e0b" : "transparent"}
                                                        color={idx < r.rating ? "#f59e0b" : "#cbd5e1"}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: 400 }}>
                                            <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                &ldquo;{r.text}&rdquo;
                                            </p>
                                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                                {r.photo && <span style={{ fontSize: "0.65rem", padding: "2px 8px", background: "#f0f9ff", color: "#0369a1", borderRadius: 100, fontWeight: 700 }}>With Photo</span>}
                                                {r.video && <span style={{ fontSize: "0.65rem", padding: "2px 8px", background: "#fef2f2", color: "#b91c1c", borderRadius: 100, fontWeight: 700 }}>With Video</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${r.status}`} style={{ textTransform: "capitalize", fontWeight: 700, fontSize: "0.7rem", padding: "4px 10px" }}>{r.status}</span>
                                        </td>
                                        <td style={{ fontSize: "0.85rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <Clock size={14} />
                                                {new Date(r.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ paddingRight: 24 }}>
                                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                {r.status !== 'approved' && (
                                                    <button
                                                        onClick={() => handleStatusChange(r.id, "approved")}
                                                        className="btn btn-sm"
                                                        style={{ width: 34, height: 34, padding: 0, background: "#f0fdf4", color: "#16a34a", border: "none" }}
                                                        title="Approve"
                                                    >
                                                        <ThumbsUp size={16} />
                                                    </button>
                                                )}
                                                {r.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => handleStatusChange(r.id, "rejected")}
                                                        className="btn btn-sm"
                                                        style={{ width: 34, height: 34, padding: 0, background: "#fff7ed", color: "#ea580c", border: "none" }}
                                                        title="Reject"
                                                    >
                                                        <ThumbsDown size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setDeleteConfirm({ isOpen: true, id: r.id })}
                                                    className="btn btn-sm"
                                                    style={{ width: 34, height: 34, padding: 0, background: "#fef2f2", color: "#dc2626", border: "none" }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )
            }

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: "" })}
                onConfirm={() => handleDelete(deleteConfirm.id)}
                title="Delete Review?"
                message="Are you sure you want to delete this review forever? This action cannot be undone."
                type="danger"
            />
        </div>
    );
}
