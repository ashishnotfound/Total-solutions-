"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, MessageSquare, User, Package, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormErrors {
    message?: string;
}

export default function QueryForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productName = searchParams.get('product') || '';
    const productId = searchParams.get('productId') || '';

    const [user, setUser] = useState<{ name?: string, email?: string, phone?: string } | null>(null);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/auth/login?returnUrl=/contact&product=' + encodeURIComponent(productName) + '&action=query');
            return;
        }

        try {
            setUser(JSON.parse(userData));
        } catch (error) {
            console.error('Invalid user data:', error);
            router.push('/auth/login?returnUrl=/contact&product=' + encodeURIComponent(productName) + '&action=query');
        }
    }, [router, productName]);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!user?.name) {
            newErrors.message = 'Account name is missing. Please update your profile.';
        } else if (!user?.email) {
            newErrors.message = 'Account email is missing.';
        } else if (!user?.phone) {
            newErrors.message = 'Phone number is required. Please update your profile or provide it in the message.';
        } else if (!message.trim()) {
            newErrors.message = 'Message is required';
        } else if (message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // Call the queries API
            const response = await fetch('/api/queries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    productName,
                    message: message.trim(),
                    userName: user?.name,
                    userEmail: user?.email,
                    userPhone: user?.phone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit query');
            }

            setSubmitted(true);

            // Clear form after successful submission
            setTimeout(() => {
                router.push('/products');
            }, 3000);
        } catch (error) {
            console.error('Failed to submit query:', error);
            setErrors({ message: error instanceof Error ? error.message : 'Failed to submit query. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '2px solid var(--primary)',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    margin: '0 auto 24px',
                    animation: 'spin 1s linear infinite'
                }} />
                <p>Loading...</p>
            </div>
        );
    }

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '40px' }}
            >
                <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <CheckCircle size={40} color="white" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16, color: '#10b981' }}>
                    Query Submitted Successfully!
                </h3>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: 24 }}>
                    Thank you for your inquiry. Our team will contact you shortly regarding your query about {productName}.
                </p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    Redirecting to products page...
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* User Info Card */}
            <div style={{
                background: 'white',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                border: '1px solid var(--border-light)'
            }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <User size={20} style={{ color: 'var(--primary)' }} />
                    Your Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 4 }}>Name</p>
                        <p style={{ fontWeight: 600 }}>{user.name}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 4 }}>Email</p>
                        <p style={{ fontWeight: 600 }}>{user.email}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 4 }}>Phone</p>
                        <p style={{ fontWeight: 600 }}>{user.phone}</p>
                    </div>
                </div>
            </div>

            {/* Query Form */}
            <form onSubmit={handleSubmit}>
                <div style={{
                    background: 'white',
                    borderRadius: 16,
                    padding: 32,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageSquare size={24} style={{ color: 'var(--primary)' }} />
                        Send Your Query
                    </h3>

                    {/* Product Info */}
                    {productName && (
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 24,
                            border: '1px solid var(--border-light)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Package size={20} style={{ color: 'var(--primary)' }} />
                                <div>
                                    <p style={{ fontWeight: 600, margin: 0 }}>{productName}</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>
                                        Product ID: {productId || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message Field */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
                            Your Message *
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Please describe your requirements, questions, or any specific details you'd like to know about the product or service..."
                            rows={6}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 12,
                                border: errors.message ? '2px solid #ef4444' : '1px solid var(--border)',
                                fontSize: '1rem',
                                background: '#f8fafc',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        {errors.message && (
                            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <AlertCircle size={12} />
                                {errors.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-lg"
                        style={{
                            width: '100%',
                            height: 56,
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{
                                    width: 20,
                                    height: 20,
                                    border: '2px solid white',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                                Sending Query...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                Send Query
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Query Process Info */}
            <div style={{
                marginTop: 32,
                padding: 24,
                background: 'white',
                borderRadius: 16,
                border: '1px solid var(--border-light)'
            }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>What Happens Next?</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            flexShrink: 0
                        }}>1</div>
                        <div>
                            <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>Query Received</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>We review your requirements</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            flexShrink: 0
                        }}>2</div>
                        <div>
                            <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>We Contact You</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>Team calls to discuss details</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            flexShrink: 0
                        }}>3</div>
                        <div>
                            <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>Solution Provided</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>Get quote and timeline</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </motion.div>
    );
}
