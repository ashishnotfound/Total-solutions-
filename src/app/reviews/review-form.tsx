"use client";
import { useState, useRef } from "react";
import { Star, Upload, CheckCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { handleReviewSubmission } from "@/app/actions/forms";
import { toast } from "react-hot-toast";

export default function ReviewForm() {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSubmitted(false);

        const formData = new FormData(e.currentTarget);
        formData.set("rating", rating.toString());

        try {
            const result = await handleReviewSubmission(formData);
            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.error || "Failed to submit review.");
            }
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                toast.error("File is too large! Maximum size is 50MB.");
                e.target.value = "";
                setFileName(null);
                return;
            }
            setFileName(file.name);
        } else {
            setFileName(null);
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#10b981" }}>
                    <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12, color: "white" }}>Review Submitted!</h3>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>Thank you! Your review will appear after admin approval.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{ padding: "16px", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#fca5a5", borderRadius: 14, marginBottom: 24, fontSize: "0.9rem", fontWeight: 600 }}>
                    {error}
                </div>
            )}

            <div className="form-group">
                <label className="form-label" style={{ color: "rgba(255,255,255,0.8)", marginBottom: 12 }}>Rating</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, transition: "transform 0.1s" }}
                        >
                            <Star
                                size={28}
                                fill={(hover || rating) >= star ? "var(--accent)" : "none"}
                                color={(hover || rating) >= star ? "var(--accent)" : "rgba(255,255,255,0.2)"}
                                style={{ transform: hover === star ? "scale(1.2)" : "scale(1)" }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <input
                    className="form-input"
                    name="name"
                    required
                    placeholder="Your Name *"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", height: 50, borderRadius: 12 }}
                />
            </div>

            <div className="form-group">
                <input
                    className="form-input"
                    name="company"
                    placeholder="Your Company / Designation"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", height: 50, borderRadius: 12 }}
                />
            </div>

            <div className="form-group">
                <textarea
                    className="form-textarea"
                    name="text"
                    required
                    placeholder="Write your experience here... *"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", minHeight: 120, borderRadius: 12, padding: 16 }}
                />
            </div>

            <div className="form-group">
                <label className="form-label" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", marginBottom: 12 }}>Attach Photo (Optional)</label>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ padding: "20px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 14, textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.borderColor = "var(--primary)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                >
                    <input type="file" name="photo" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                    <Upload size={24} style={{ margin: "0 auto 12px", color: "var(--primary)" }} />
                    <p style={{ fontSize: "0.9rem", color: fileName ? "white" : "rgba(255,255,255,0.6)", fontWeight: fileName ? 600 : 400 }}>{fileName || "Click to upload an image"}</p>
                </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-accent btn-lg" style={{ width: "100%", height: 56, borderRadius: 14, fontWeight: 800, fontSize: "1rem", marginTop: 12 }}>
                {loading ? <><LoadingSpinner size={20} color="white" /> Submitting...</> : "Submit Review"}
            </button>
        </form>
    );
}
