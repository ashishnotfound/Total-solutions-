"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, User, Package, Calendar, MapPin, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface OrderData {
    productId: string;
    productName: string;
    quantity: string;
    deliveryAddress: string;
    timeline: string;
    specifications: string;
    additionalNotes: string;
}

interface FormErrors {
    quantity?: string;
    deliveryAddress?: string;
    timeline?: string;
    name?: string;
    email?: string;
    phone?: string;
}

export default function OrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productName = searchParams.get('product') || '';
    const productId = searchParams.get('productId') || '';

    const [user, setUser] = useState<{ id?: string, name?: string, email?: string, phone?: string } | null>(null);
    const [guestUser, setGuestUser] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [orderData, setOrderData] = useState<OrderData>({
        productId,
        productName,
        quantity: '',
        deliveryAddress: '',
        timeline: '',
        specifications: '',
        additionalNotes: ''
    });
    const [additionalItems, setAdditionalItems] = useState<{name: string, quantity: string}[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Invalid user data:', error);
            }
        }
        setPageLoading(false);
    }, []);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!user) {
            if (!guestUser.name.trim()) newErrors.name = 'Name is required';
            if (!guestUser.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestUser.email)) {
                newErrors.email = 'Invalid email address';
            }
            if (!guestUser.phone.trim()) newErrors.phone = 'Phone is required';
        }

        if (!orderData.quantity.trim()) {
            newErrors.quantity = 'Quantity is required';
        }

        if (!orderData.deliveryAddress.trim()) {
            newErrors.deliveryAddress = 'Delivery address is required';
        }

        if (!orderData.timeline.trim()) {
            newErrors.timeline = 'Timeline is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addAdditionalItem = () => {
        setAdditionalItems([...additionalItems, { name: '', quantity: '' }]);
    };

    const updateAdditionalItem = (index: number, field: 'name' | 'quantity', value: string) => {
        const newItems = [...additionalItems];
        newItems[index][field] = value;
        setAdditionalItems(newItems);
    };

    const removeAdditionalItem = (index: number) => {
        setAdditionalItems(additionalItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            const items = [
                { name: orderData.productName, quantity: orderData.quantity },
                ...additionalItems
            ].filter(item => item.name.trim() !== "");

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: orderData.productId,
                    productName: orderData.productName,
                    items: items.map(item => ({
                        name: item.name,
                        quantity: item.quantity
                    })),
                    quantity: orderData.quantity,
                    deliveryAddress: orderData.deliveryAddress,
                    timeline: orderData.timeline,
                    specifications: orderData.specifications || null,
                    additionalNotes: orderData.additionalNotes || null,
                    userName: user?.name || guestUser.name,
                    userEmail: user?.email || guestUser.email,
                    userPhone: user?.phone || guestUser.phone,
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to place order');
            }

            toast.success('Order placed successfully! We will contact you shortly.');
            router.push('/products');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <>
                <Navbar />
                <main style={{ paddingTop: 72 }}>
                    <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
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
                </main>
                <Footer />
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 72 }}>
                <div style={{
                    minHeight: 'calc(100vh - 72px)',
                    background: 'linear-gradient(135deg, rgba(31,163,82,0.06), rgba(255,107,26,0.04))'
                }}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ maxWidth: 800, margin: '0 auto', padding: '40px 0' }}
                        >
                            {/* Header */}
                            <div style={{ marginBottom: 32 }}>
                                <Link
                                    href={`/products/${productId}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginBottom: 24,
                                        color: 'var(--text-light)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <ArrowLeft size={20} />
                                    Back to Product
                                </Link>

                                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>
                                    Place Order
                                </h1>
                                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                                    Complete your order for <strong>{productName}</strong>
                                </p>
                            </div>

                            {/* User Information */}
                            <div style={{
                                background: 'white',
                                borderRadius: 16,
                                padding: 24,
                                marginBottom: 24,
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <User size={20} style={{ color: 'var(--primary)' }} />
                                    Your Information
                                </h3>
                                
                                {user ? (
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
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                                        <div className="form-group">
                                            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Full Name *</label>
                                            <input 
                                                type="text" 
                                                value={guestUser.name}
                                                onChange={(e) => setGuestUser({...guestUser, name: e.target.value})}
                                                placeholder="Enter your name"
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: errors.name ? '2px solid #ef4444' : '1px solid var(--border)', background: '#f8fafc' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Email Address *</label>
                                            <input 
                                                type="email" 
                                                value={guestUser.email}
                                                onChange={(e) => setGuestUser({...guestUser, email: e.target.value})}
                                                placeholder="your@email.com"
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: errors.email ? '2px solid #ef4444' : '1px solid var(--border)', background: '#f8fafc' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Phone Number *</label>
                                            <input 
                                                type="tel" 
                                                value={guestUser.phone}
                                                onChange={(e) => setGuestUser({...guestUser, phone: e.target.value})}
                                                placeholder="+91 00000 00000"
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: errors.phone ? '2px solid #ef4444' : '1px solid var(--border)', background: '#f8fafc' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order Form */}
                            <form onSubmit={handleSubmit}>
                                <div style={{
                                    background: 'white',
                                    borderRadius: 16,
                                    padding: 32,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <ShoppingCart size={24} style={{ color: 'var(--primary)' }} />
                                        Order Details
                                    </h3>

                                    {/* Primary Product */}
                                    <div style={{ marginBottom: 32 }}>
                                        <label style={{ display: 'block', marginBottom: 12, fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                                            Select Items
                                        </label>
                                        
                                        <div style={{ 
                                            background: '#f8fafc', 
                                            borderRadius: 12, 
                                            padding: '20px', 
                                            marginBottom: 16, 
                                            border: '1px solid var(--border)',
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr',
                                            gap: 16,
                                            alignItems: 'end'
                                        }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>Product Name</label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
                                                    <Package size={18} style={{ color: 'var(--primary)' }} />
                                                    <span style={{ fontWeight: 600 }}>{productName}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>Quantity *</label>
                                                <input
                                                    type="text"
                                                    value={orderData.quantity}
                                                    onChange={(e) => setOrderData({ ...orderData, quantity: e.target.value })}
                                                    placeholder="e.g. 500"
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: errors.quantity ? '2px solid #ef4444' : '1px solid var(--border)', background: 'white' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Additional Items */}
                                        {additionalItems.map((item, index) => (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={index} 
                                                style={{ 
                                                    background: '#fff', 
                                                    borderRadius: 12, 
                                                    padding: '20px', 
                                                    marginBottom: 16, 
                                                    border: '1px solid var(--border)',
                                                    display: 'grid',
                                                    gridTemplateColumns: '2fr 1fr 40px',
                                                    gap: 16,
                                                    alignItems: 'end',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>Other Product Name</label>
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => updateAdditionalItem(index, 'name', e.target.value)}
                                                        placeholder="e.g. Business Cards"
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>Quantity</label>
                                                    <input
                                                        type="text"
                                                        value={item.quantity}
                                                        onChange={(e) => updateAdditionalItem(index, 'quantity', e.target.value)}
                                                        placeholder="e.g. 1000"
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
                                                    />
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeAdditionalItem(index)}
                                                    style={{ height: 44, width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid #fee2e2', color: '#ef4444', background: '#fef2f2' }}
                                                >
                                                    ×
                                                </button>
                                            </motion.div>
                                        ))}

                                        <button 
                                            type="button"
                                            onClick={addAdditionalItem}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 8, 
                                                padding: '12px 20px', 
                                                borderRadius: 10, 
                                                border: '2px dashed var(--border)', 
                                                background: 'transparent', 
                                                color: 'var(--primary)', 
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                width: '100%',
                                                justifyContent: 'center',
                                                marginTop: 8
                                            }}
                                        >
                                            + Add Another Product
                                        </button>
                                    </div>

                                    {/* Delivery Address */}
                                    <div style={{ marginBottom: 24 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
                                            <MapPin size={16} style={{ display: 'inline', marginRight: 4 }} />
                                            Delivery Address *
                                        </label>
                                        <textarea
                                            value={orderData.deliveryAddress}
                                            onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                                            placeholder="Enter complete delivery address with landmark"
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 12,
                                                border: errors.deliveryAddress ? '2px solid #ef4444' : '1px solid var(--border)',
                                                fontSize: '1rem',
                                                background: '#f8fafc',
                                                resize: 'vertical'
                                            }}
                                        />
                                        {errors.deliveryAddress && (
                                            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>
                                                {errors.deliveryAddress}
                                            </p>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div style={{ marginBottom: 24 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
                                            <Calendar size={16} style={{ display: 'inline', marginRight: 4 }} />
                                            Preferred Timeline *
                                        </label>
                                        <input
                                            type="text"
                                            value={orderData.timeline}
                                            onChange={(e) => setOrderData({ ...orderData, timeline: e.target.value })}
                                            placeholder="e.g., Within 7 days, Next week, Urgent"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 12,
                                                border: errors.timeline ? '2px solid #ef4444' : '1px solid var(--border)',
                                                fontSize: '1rem',
                                                background: '#f8fafc'
                                            }}
                                        />
                                        {errors.timeline && (
                                            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: 4 }}>
                                                {errors.timeline}
                                            </p>
                                        )}
                                    </div>

                                    {/* Specifications */}
                                    <div style={{ marginBottom: 24 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
                                            <FileText size={16} style={{ display: 'inline', marginRight: 4 }} />
                                            Specifications (Optional)
                                        </label>
                                        <textarea
                                            value={orderData.specifications}
                                            onChange={(e) => setOrderData({ ...orderData, specifications: e.target.value })}
                                            placeholder="Describe specific requirements, sizes, materials, colors, etc."
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 12,
                                                border: '1px solid var(--border)',
                                                fontSize: '1rem',
                                                background: '#f8fafc',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    {/* Additional Notes */}
                                    <div style={{ marginBottom: 32 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea
                                            value={orderData.additionalNotes}
                                            onChange={(e) => setOrderData({ ...orderData, additionalNotes: e.target.value })}
                                            placeholder="Any other information you'd like to share"
                                            rows={2}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: 12,
                                                border: '1px solid var(--border)',
                                                fontSize: '1rem',
                                                background: '#f8fafc',
                                                resize: 'vertical'
                                            }}
                                        />
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
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={20} />
                                                Place Order
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Order Process Info */}
                            <div style={{
                                marginTop: 32,
                                padding: 24,
                                background: 'white',
                                borderRadius: 16,
                                border: '1px solid var(--border-light)'
                            }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Order Process</h4>
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
                                            <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>Submit Order</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>Fill in your requirements</p>
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
                                            <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>We Call You</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>Team confirms details</p>
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
                                            <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>Order Confirmed</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>Production begins</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
