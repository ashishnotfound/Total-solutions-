"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, User, Lock, CheckCircle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface FormData {
    name: string;
    email: string;
    phone: string;
    otp: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    otp?: string;
}

export default function AuthLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/products';
    const action = searchParams.get('action') || 'browse';
    const productName = searchParams.get('product') || '';

    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        otp: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const validateDetails = () => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone number';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async () => {
        if (!validateDetails()) return;
        setLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    data: { name: formData.name, phone: formData.phone }
                }
            });
            if (error) throw error;
            setStep('otp');
            setResendTimer(60);
            toast.success('Verification code sent!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!formData.otp || formData.otp.length < 6) {
            setErrors({ otp: 'Please enter 6-digit code' });
            return;
        }
        setLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: formData.otp,
                type: 'email'
            });
            if (error) throw error;

            toast.success('Welcome back!');
            router.push(action === 'order' ? `/order?product=${encodeURIComponent(productName)}` : returnUrl);
        } catch (error) {
            setErrors({ otp: 'Invalid or expired code' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            background: "#080c14",
            overflow: "hidden"
        }}>
            {/* Immersive Background */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <Image
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964"
                    alt="Background"
                    fill
                    priority
                    style={{ objectFit: "cover", opacity: 0.3 }}
                />
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at center, transparent 0%, rgba(8, 12, 20, 0.9) 100%)",
                    backdropFilter: "blur(8px)"
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    width: "100%",
                    maxWidth: 480,
                    padding: "60px 48px",
                    background: "rgba(255, 255, 255, 0.04)",
                    backdropFilter: "blur(30px)",
                    borderRadius: 40,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 40px 100px -20px rgba(0, 0, 0, 0.7)",
                    position: "relative",
                    zIndex: 1,
                    margin: 20
                }}
            >
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        style={{
                            width: 72,
                            height: 72,
                            background: "linear-gradient(135deg, var(--primary), #10b981)",
                            borderRadius: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 32px",
                            boxShadow: "0 15px 30px rgba(16, 185, 129, 0.3)"
                        }}
                    >
                        <Shield size={36} color="white" />
                    </motion.div>
                    <h1 style={{ color: "white", fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
                        {step === 'details' ? 'Welcome' : 'Verification'}
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", fontWeight: 500, lineHeight: 1.6 }}>
                        {step === 'details'
                            ? 'Connect to manage your orders & projects'
                            : `Enter the code sent to ${formData.email}`}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'details' ? (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: "flex", flexDirection: "column", gap: 24 }}
                        >
                            <InputGroup label="Full Name" icon={<User size={18} />} error={errors.name}>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="premium-input"
                                />
                            </InputGroup>

                            <InputGroup label="Email Address" icon={<Mail size={18} />} error={errors.email}>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    className="premium-input"
                                />
                            </InputGroup>

                            <InputGroup label="Phone Number" icon={<Phone size={18} />} error={errors.phone}>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 00000 00000"
                                    className="premium-input"
                                />
                            </InputGroup>

                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="premium-btn"
                                style={{ marginTop: 12 }}
                            >
                                {loading ? <LoadingSpinner size={20} color="white" /> : "Continue"}
                                {!loading && <ArrowLeft size={18} style={{ transform: "rotate(180deg)" }} />}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: "flex", flexDirection: "column", gap: 32 }}
                        >
                            <div style={{ textAlign: "center" }}>
                                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 20 }}>
                                    6-Digit Security Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                    maxLength={6}
                                    style={{
                                        width: "100%",
                                        background: "transparent",
                                        border: "none",
                                        borderBottom: "2px solid rgba(255,255,255,0.2)",
                                        color: "white",
                                        fontSize: "3rem",
                                        textAlign: "center",
                                        letterSpacing: "0.4em",
                                        outline: "none",
                                        fontFamily: "monospace",
                                        paddingBottom: 12
                                    }}
                                />
                                {errors.otp && <p style={{ color: "#fca5a5", fontSize: "0.85rem", marginTop: 12 }}>{errors.otp}</p>}
                            </div>

                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                className="premium-btn"
                            >
                                {loading ? <LoadingSpinner size={20} color="white" /> : "Verify & Sign In"}
                                {!loading && <CheckCircle size={18} />}
                            </button>

                            <div style={{ textAlign: "center" }}>
                                <button
                                    onClick={() => setStep('details')}
                                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}
                                >
                                    Try different email
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ marginTop: 40, textAlign: "center" }}>
                    <Link href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <ArrowLeft size={16} /> Back to Website
                    </Link>
                </div>
            </motion.div>

            <style jsx global>{`
                .premium-input {
                    width: 100%;
                    height: 56px;
                    padding: 0 48px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 18px;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.3s;
                }
                .premium-input:focus {
                    background: rgba(255,255,255,0.08);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                }
                .premium-btn {
                    height: 60px;
                    background: linear-gradient(135deg, var(--primary), #059669);
                    color: white;
                    border-radius: 20px;
                    font-weight: 800;
                    font-size: 1.1rem;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    alignItems: center;
                    justify-content: center;
                    gap: 12;
                    transition: all 0.3s;
                    box-shadow: 0 15px 30px -10px rgba(16, 185, 129, 0.4);
                }
                .premium-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.6);
                    filter: brightness(1.1);
                }
                .premium-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

function InputGroup({ label, icon, children, error }: { label: string, icon: React.ReactNode, children: React.ReactNode, error?: string }) {
    return (
        <div style={{ position: "relative" }}>
            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: 700, marginBottom: 12, display: "block", marginLeft: 4 }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", display: "flex" }}>
                    {icon}
                </div>
                {children}
            </div>
            {error && <p style={{ color: "#fca5a5", fontSize: "0.8rem", marginTop: 8, marginLeft: 4 }}>{error}</p>}
        </div>
    );
}
