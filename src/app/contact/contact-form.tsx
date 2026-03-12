"use client";
import { useState, useRef } from "react";
import { Send, Upload, CheckCircle, AlertCircle, Package } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Category, Product } from "@/lib/data";
import { toast } from "react-hot-toast";
import { handleQuoteSubmission } from "@/app/actions/forms";

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
}

interface Props {
    categories: Category[];
    products: Product[];
    prefilledValue?: string;
}

export default function ContactForm({ categories, products, prefilledValue = "" }: Props) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [additionalItems, setAdditionalItems] = useState<{product: string, quantity: string}[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Pre-fill user data
    const [userData, setUserData] = useState<{name: string, email: string, phone: string, company: string}>({
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('user');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setUserData({
                        name: parsed.name || '',
                        email: parsed.email || '',
                        phone: parsed.phone || '',
                        company: parsed.company || ''
                    });
                } catch (e) { console.error(e); }
            }
        }
    });

    const validateForm = (formData: FormData): FormErrors => {
        const newErrors: FormErrors = {};

        const name = (formData.get("name") as string)?.trim();
        const email = (formData.get("email") as string)?.trim();
        const phone = (formData.get("phone") as string)?.trim();
        const message = (formData.get("message") as string)?.trim();

        if (!name || name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!phone) {
            newErrors.phone = "Phone number is required";
        }

        if (!message || message.length < 5) {
            newErrors.message = "Please provide some details about your requirements";
        }

        return newErrors;
    };

    const addAdditionalItem = () => {
        setAdditionalItems([...additionalItems, { product: '', quantity: '' }]);
    };

    const updateAdditionalItem = (index: number, field: 'product' | 'quantity', value: string) => {
        const newItems = [...additionalItems];
        newItems[index][field] = value;
        setAdditionalItems(newItems);
    };

    const removeAdditionalItem = (index: number) => {
        setAdditionalItems(additionalItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSubmitted(false);

        const formData = new FormData(e.currentTarget);
        
        // Append additional items to formData or handle separately in action
        // For simplicity with existing action, we'll join them in message or handle in a new way
        const itemsList = [
            { product: formData.get("product"), quantity: formData.get("quantity") },
            ...additionalItems
        ].filter(item => item.product).map(item => `${item.product} (Qty: ${item.quantity || "Not specified"})`).join(", ");

        if (additionalItems.length > 0) {
            const currentMsg = formData.get("message") as string;
            formData.set("message", `ITEMS REQUESTED: ${itemsList}\n\nADDITIONAL NOTES: ${currentMsg}`);
        }

        const newErrors = validateForm(formData);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const result = await handleQuoteSubmission(formData);

            if (!result.success) {
                setErrors({ message: result.error || "Failed to send message. Please try again." });
                return;
            }

            setSubmitted(true);
            toast.success("Quote request sent successfully!");
            e.currentTarget.reset();
            setFileName(null);
            setAdditionalItems([]);
        } catch {
            setErrors({ message: "Network error. Please try again." });
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
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#16a34a" }}>
                    <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: "var(--text-light)" }}>We&apos;ll get back to you within 24 hours.</p>
            </div>
        );
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} style={{ padding: "40px", borderRadius: "24px", background: "white", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", border: "1px solid var(--border-light)" }}>
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: 8, color: "var(--text)" }}>Request a Quote</h2>
                <p style={{ color: "var(--text-light)", fontSize: "0.95rem" }}>Tell us what you need, and we&apos;ll handle the rest.</p>
            </div>

            {errors.message && (
                <div style={{ padding: "12px 16px", background: "#fef2f2", color: "#b91c1c", borderRadius: 12, marginBottom: 24, fontSize: "0.9rem", fontWeight: 600, border: "1px solid #fee2e2", display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle size={16} />
                    {errors.message}
                </div>
            )}

            {/* Personal Details Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Full Name *</label>
                    <input
                        className="form-input"
                        name="name"
                        required
                        defaultValue={userData.name}
                        placeholder="John Doe"
                        style={{ borderRadius: "12px", height: 52, background: "#f8fafc" }}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Email Address *</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        required
                        defaultValue={userData.email}
                        placeholder="john@example.com"
                        style={{ borderRadius: "12px", height: 52, background: "#f8fafc" }}
                    />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Phone Number *</label>
                    <input
                        className="form-input"
                        type="tel"
                        name="phone"
                        required
                        defaultValue={userData.phone}
                        placeholder="+91 00000 00000"
                        style={{ borderRadius: "12px", height: 52, background: "#f8fafc" }}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Company Name</label>
                    <input 
                        className="form-input" 
                        name="company" 
                        defaultValue={userData.company}
                        placeholder="Optional" 
                        style={{ borderRadius: "12px", height: 52, background: "#f8fafc" }} 
                    />
                </div>
            </div>

            {/* Items Section */}
            <div style={{ marginBottom: 32, padding: 24, background: "#f8fafc", borderRadius: 20, border: "1px solid var(--border-light)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <Package size={18} style={{ color: "var(--primary)" }} />
                    Items You Need
                </h3>

                {/* Primary Item */}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600, color: "var(--text-light)" }}>Select Product/Service</label>
                        <select className="form-select" name="product" defaultValue={prefilledValue} style={{ borderRadius: "10px", height: 48, background: "white" }}>
                            <option value="">Choose an option</option>
                            <optgroup label="Core Services">
                                {["Offset Printing", "Digital Printing", "Flex & Vinyl", "Packaging", "Promotional Items", "Installation"].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </optgroup>
                            {categories.map((cat) => (
                                <optgroup key={cat.id} label={cat.name}>
                                    {products.filter((p) => p.category_id === cat.id).map((p) => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600, color: "var(--text-light)" }}>Est. Quantity</label>
                        <input className="form-input" name="quantity" placeholder="e.g. 500" style={{ borderRadius: "10px", height: 48, background: "white" }} />
                    </div>
                </div>

                {/* Additional Items */}
                {additionalItems.map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={index} 
                        style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 40px", gap: 16, marginBottom: 16, alignItems: "end" }}
                    >
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                                className="form-input"
                                value={item.product}
                                onChange={(e) => updateAdditionalItem(index, 'product', e.target.value)}
                                placeholder="Additional product name..."
                                style={{ borderRadius: "10px", height: 48, background: "white" }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                                className="form-input"
                                value={item.quantity}
                                onChange={(e) => updateAdditionalItem(index, 'quantity', e.target.value)}
                                placeholder="Quantity"
                                style={{ borderRadius: "10px", height: 48, background: "white" }}
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={() => removeAdditionalItem(index)}
                            style={{ height: 48, width: 44, borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            ×
                        </button>
                    </motion.div>
                ))}

                <button 
                    type="button" 
                    onClick={addAdditionalItem}
                    style={{ 
                        width: "100%", 
                        padding: "12px", 
                        marginTop: 8, 
                        borderRadius: "12px", 
                        border: "2px dashed var(--border)", 
                        background: "transparent", 
                        color: "var(--primary)", 
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        cursor: "pointer"
                    }}
                >
                    + Add More Products to Quote
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Preferred Timeline</label>
                    <input className="form-input" name="timeline" placeholder="e.g. Next 7 days" style={{ borderRadius: "12px", height: 52, background: "#f8fafc" }} />
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>Delivery Location</label>
                    <input className="form-input" name="deliveryAddress" placeholder="City or Full Address" style={{ borderRadius: "12px", height: 52, background: "#f8fafc" }} />
                </div>
            </div>

            <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Requirements & Details *</label>
                <textarea
                    className="form-textarea"
                    name="message"
                    required
                    placeholder="Describe specific sizes, paper quality, colors, or any custom needs..."
                    style={{ borderRadius: "12px", minHeight: 120, padding: 16, background: "#f8fafc" }}
                />
            </div>

            <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Upload Design (Optional)</label>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ padding: "24px", border: "2px dashed var(--border)", borderRadius: "16px", textAlign: "center", cursor: "pointer", background: "#f8fafc", transition: "all 0.2s" }}
                >
                    <input type="file" name="artwork" ref={fileInputRef} onChange={handleFileChange} hidden accept=".pdf,.ai,.eps,.jpg,.png,.zip" />
                    <Upload size={24} style={{ margin: "0 auto 8px", color: "var(--primary)" }} />
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>{fileName || "Click to upload design files"}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>Max size: 50MB</p>
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%", height: 60, borderRadius: 16, fontSize: "1.1rem" }}>
                {loading ? <LoadingSpinner size={20} color="white" /> : <><Send size={20} /> Submit Quote Request</>}
            </button>
        </form>
    );
}
