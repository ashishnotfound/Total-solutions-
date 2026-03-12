"use client";
import { useState, useEffect } from "react";
import {
    Search,
    X,
    Phone,
    Mail,
    Package,
    Calendar,
    MapPin,
    CheckCircle,
    Clock,
    User,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "react-hot-toast";

interface Order {
    id: string;
    product_id: string;
    product_name: string;
    quantity: string;
    delivery_address: string;
    timeline: string;
    specifications: string | null;
    additional_notes: string | null;
    user_name: string;
    user_email: string;
    user_phone: string;
    status: "pending" | "confirmed" | "rejected" | "contacted";
    created_at: string;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Confirmation dialog state
    const [statusConfirm, setStatusConfirm] = useState<{
        isOpen: boolean;
        orderId: string;
        newStatus: string;
        action: string;
    }>({
        isOpen: false,
        orderId: "",
        newStatus: "",
        action: ""
    });

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load orders');
            }

            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update status');
            }

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
            ));
            toast.success(`Order marked as ${newStatus}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update order status');
        }
    };

    const confirmStatusUpdate = (orderId: string, newStatus: string, action: string) => {
        setStatusConfirm({
            isOpen: true,
            orderId,
            newStatus,
            action
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'confirmed': return '#10b981';
            case 'rejected': return '#ef4444';
            case 'contacted': return '#3b82f6';
            default: return '#6b7280';
        }
    };



    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.product_name.toLowerCase().includes(search.toLowerCase()) ||
            order.user_name.toLowerCase().includes(search.toLowerCase()) ||
            order.user_email.toLowerCase().includes(search.toLowerCase()) ||
            order.user_phone.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '2px solid var(--primary)',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    margin: '0 auto 24px',
                    animation: 'spin 1s linear infinite'
                }} />
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 8, letterSpacing: '-1px' }}>
                            Order Management
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>
                            Manage customer orders and track their status
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 12,
                            border: '1px solid var(--border)',
                            background: 'white',
                            cursor: refreshing ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                    >
                        <RefreshCw size={16} style={{
                            animation: refreshing ? 'spin 1s linear infinite' : 'none'
                        }} />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                    {[
                        { status: 'pending', label: 'Pending Orders', color: '#f59e0b' },
                        { status: 'contacted', label: 'Contacted', color: '#3b82f6' },
                        { status: 'confirmed', label: 'Confirmed', color: '#10b981' },
                        { status: 'rejected', label: 'Rejected', color: '#ef4444' }
                    ].map(({ status, label, color }) => {
                        const count = orders.filter(o => o.status === status).length;
                        return (
                            <div key={status} style={{
                                background: 'white',
                                borderRadius: 16,
                                padding: 24,
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 4 }}>{label}</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 900, color }}>{count}</p>
                                    </div>
                                    <div style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        background: `${color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {status === 'pending' && <Clock size={24} color={color} />}
                                        {status === 'contacted' && <Phone size={24} color={color} />}
                                        {status === 'confirmed' && <CheckCircle size={24} color={color} />}
                                        {status === 'rejected' && <X size={24} color={color} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 300, position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search orders by product, customer name, email, or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 48px',
                                borderRadius: 12,
                                border: '1px solid var(--border)',
                                fontSize: '1rem',
                                background: 'white'
                            }}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                style={{
                                    position: 'absolute',
                                    right: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#94a3b8'
                                }}
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '12px 16px',
                            borderRadius: 12,
                            border: '1px solid var(--border)',
                            fontSize: '1rem',
                            background: 'white',
                            cursor: 'pointer',
                            minWidth: 150
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Results Count */}
                <div style={{ marginBottom: 24, color: '#64748b', fontSize: '0.9rem' }}>
                    Showing {filteredOrders.length} of {orders.length} orders
                </div>

                {/* Orders Table */}
                <div style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden'
                }}>
                    {filteredOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px' }}>
                            <Package size={64} style={{ color: '#cbd5e1', marginBottom: 24 }} />
                            <h3 style={{ color: '#475569', marginBottom: 12 }}>No orders found</h3>
                            <p style={{ color: '#94a3b8', marginBottom: 24 }}>
                                Try adjusting your search terms or filters
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                                    <tr>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Order Details</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Customer</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Status</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Date</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredOrders.map((order, index) => {
                                            return (
                                                <motion.tr
                                                    key={order.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    style={{ borderBottom: '1px solid var(--border-light)' }}
                                                >
                                                    <td style={{ padding: '16px' }}>
                                                        <div>
                                                            <p style={{ fontWeight: 600, marginBottom: 4 }}>{order.product_name}</p>
                                                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Qty: {order.quantity}</p>
                                                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Timeline: {order.timeline}</p>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <div>
                                                            <p style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <User size={14} style={{ color: '#94a3b8' }} />
                                                                {order.user_name}
                                                            </p>
                                                            <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <Mail size={14} />
                                                                {order.user_email}
                                                            </p>
                                                            <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <Phone size={14} />
                                                                {order.user_phone}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <div style={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                background: getStatusColor(order.status)
                                                            }} />
                                                            <span style={{
                                                                fontSize: '0.9rem',
                                                                fontWeight: 600,
                                                                color: getStatusColor(order.status),
                                                                textTransform: 'capitalize'
                                                            }}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                            {formatDate(order.created_at)}
                                                        </p>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setShowDetails(true);
                                                                }}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    borderRadius: 8,
                                                                    border: '1px solid var(--border)',
                                                                    background: 'white',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 4
                                                                }}
                                                            >
                                                                <Package size={14} />
                                                                View
                                                            </button>

                                                            {order.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(order.id, 'contacted', 'Mark as contacted')}
                                                                        style={{
                                                                            padding: '6px 12px',
                                                                            borderRadius: 8,
                                                                            border: '1px solid #3b82f6',
                                                                            background: 'white',
                                                                            color: '#3b82f6',
                                                                            cursor: 'pointer',
                                                                            fontSize: '0.85rem',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 4
                                                                        }}
                                                                    >
                                                                        <Phone size={14} />
                                                                        Contact
                                                                    </button>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(order.id, 'confirmed', 'Confirm order')}
                                                                        style={{
                                                                            padding: '6px 12px',
                                                                            borderRadius: 8,
                                                                            border: '1px solid #10b981',
                                                                            background: 'white',
                                                                            color: '#10b981',
                                                                            cursor: 'pointer',
                                                                            fontSize: '0.85rem',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 4
                                                                        }}
                                                                    >
                                                                        <CheckCircle size={14} />
                                                                        Confirm
                                                                    </button>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(order.id, 'rejected', 'Reject order')}
                                                                        style={{
                                                                            padding: '6px 12px',
                                                                            borderRadius: 8,
                                                                            border: '1px solid #ef4444',
                                                                            background: 'white',
                                                                            color: '#ef4444',
                                                                            cursor: 'pointer',
                                                                            fontSize: '0.85rem',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 4
                                                                        }}
                                                                    >
                                                                        <X size={14} />
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}

                                                            {order.status === 'contacted' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(order.id, 'confirmed', 'Confirm order')}
                                                                        style={{
                                                                            padding: '6px 12px',
                                                                            borderRadius: 8,
                                                                            border: '1px solid #10b981',
                                                                            background: 'white',
                                                                            color: '#10b981',
                                                                            cursor: 'pointer',
                                                                            fontSize: '0.85rem',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 4
                                                                        }}
                                                                    >
                                                                        <CheckCircle size={14} />
                                                                        Confirm
                                                                    </button>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(order.id, 'rejected', 'Reject order')}
                                                                        style={{
                                                                            padding: '6px 12px',
                                                                            borderRadius: 8,
                                                                            border: '1px solid #ef4444',
                                                                            background: 'white',
                                                                            color: '#ef4444',
                                                                            cursor: 'pointer',
                                                                            fontSize: '0.85rem',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 4
                                                                        }}
                                                                    >
                                                                        <X size={14} />
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Order Details Modal */}
                <AnimatePresence>
                    {showDetails && selectedOrder && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetails(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 1000,
                                backdropFilter: 'blur(4px)'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'white',
                                    borderRadius: 16,
                                    padding: 32,
                                    maxWidth: 600,
                                    width: '90%',
                                    maxHeight: '80vh',
                                    overflow: 'auto',
                                    zIndex: 1001
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Order Details</h2>
                                    <button
                                        onClick={() => setShowDetails(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 4,
                                            borderRadius: 8,
                                            color: '#9ca3af'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gap: 20 }}>
                                    {/* Product Info */}
                                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Package size={18} style={{ color: 'var(--primary)' }} />
                                            Product Information
                                        </h3>
                                        <div style={{ display: 'grid', gap: 8 }}>
                                            <p><strong>Name:</strong> {selectedOrder.product_name}</p>
                                            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                                            <p><strong>Timeline:</strong> {selectedOrder.timeline}</p>
                                            {selectedOrder.specifications && (
                                                <p><strong>Specifications:</strong> {selectedOrder.specifications}</p>
                                            )}
                                            {selectedOrder.additional_notes && (
                                                <p><strong>Additional Notes:</strong> {selectedOrder.additional_notes}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <User size={18} style={{ color: 'var(--primary)' }} />
                                            Customer Information
                                        </h3>
                                        <div style={{ display: 'grid', gap: 8 }}>
                                            <p><strong>Name:</strong> {selectedOrder.user_name}</p>
                                            <p><strong>Email:</strong> {selectedOrder.user_email}</p>
                                            <p><strong>Phone:</strong> {selectedOrder.user_phone}</p>
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <MapPin size={18} style={{ color: 'var(--primary)' }} />
                                            Delivery Information
                                        </h3>
                                        <p>{selectedOrder.delivery_address}</p>
                                    </div>

                                    {/* Order Info */}
                                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Calendar size={18} style={{ color: 'var(--primary)' }} />
                                            Order Information
                                        </h3>
                                        <div style={{ display: 'grid', gap: 8 }}>
                                            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                            <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedOrder.status), textTransform: 'capitalize' }}>{selectedOrder.status}</span></p>
                                            <p><strong>Created:</strong> {formatDate(selectedOrder.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={statusConfirm.isOpen}
                    onClose={() => setStatusConfirm({ ...statusConfirm, isOpen: false })}
                    onConfirm={() => {
                        handleStatusUpdate(statusConfirm.orderId, statusConfirm.newStatus);
                        setStatusConfirm({ ...statusConfirm, isOpen: false });
                    }}
                    title={statusConfirm.action}
                    message={`Are you sure you want to ${statusConfirm.action.toLowerCase()}? This action will update the order status and notify the customer.`}
                    confirmText={statusConfirm.action}
                    cancelText="Cancel"
                    type="warning"
                />
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
