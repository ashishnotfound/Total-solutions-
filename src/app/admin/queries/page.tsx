"use client";
import { useState, useEffect } from "react";
import {
    Search,
    X,
    Phone,
    Mail,
    Package,
    Calendar,
    CheckCircle,
    Clock,
    User,
    MessageSquare,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "react-hot-toast";

interface Query {
    id: string;
    product_id: string | null;
    product_name: string | null;
    message: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    status: "pending" | "contacted" | "resolved" | "rejected";
    created_at: string;
}

export default function AdminQueries() {
    const [queries, setQueries] = useState<Query[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Confirmation dialog state
    const [statusConfirm, setStatusConfirm] = useState<{
        isOpen: boolean;
        queryId: string;
        newStatus: string;
        action: string;
    }>({
        isOpen: false,
        queryId: "",
        newStatus: "",
        action: ""
    });

    useEffect(() => {
        loadQueries();
    }, []);

    const loadQueries = async () => {
        try {
            const response = await fetch('/api/queries');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load queries');
            }

            setQueries(data.queries || []);
        } catch (error) {
            console.error('Failed to load queries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadQueries();
        setRefreshing(false);
    };

    const handleStatusUpdate = async (queryId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/queries/${queryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update status');
            }

            // Update local state
            setQueries(queries.map(query =>
                query.id === queryId ? { ...query, status: newStatus as Query["status"] } : query
            ));
            toast.success(`Query marked as ${newStatus}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update query status');
        }
    };

    const confirmStatusUpdate = (queryId: string, newStatus: string, action: string) => {
        setStatusConfirm({
            isOpen: true,
            queryId,
            newStatus,
            action
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'contacted': return '#3b82f6';
            case 'resolved': return '#10b981';
            case 'rejected': return '#ef4444';
            default: return '#6b7280';
        }
    };


    const filteredQueries = queries.filter(query => {
        const matchesSearch =
            (query.product_name && query.product_name.toLowerCase().includes(search.toLowerCase())) ||
            query.user_name.toLowerCase().includes(search.toLowerCase()) ||
            query.user_email.toLowerCase().includes(search.toLowerCase()) ||
            query.user_phone.toLowerCase().includes(search.toLowerCase()) ||
            query.message.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "all" || query.status === statusFilter;

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

    const truncateMessage = (message: string, maxLength: number = 100) => {
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
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
                <p>Loading queries...</p>
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
                            Query Management
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>
                            Manage customer queries and provide timely responses
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
                        { status: 'pending', label: 'Pending Queries', color: '#f59e0b' },
                        { status: 'contacted', label: 'Contacted', color: '#3b82f6' },
                        { status: 'resolved', label: 'Resolved', color: '#10b981' },
                        { status: 'rejected', label: 'Rejected', color: '#ef4444' }
                    ].map(({ status, label, color }) => {
                        const count = queries.filter(q => q.status === status).length;
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
                                        {status === 'resolved' && <CheckCircle size={24} color={color} />}
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
                            placeholder="Search queries by product, customer, message..."
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
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Results Count */}
                <div style={{ marginBottom: 24, color: '#64748b', fontSize: '0.9rem' }}>
                    Showing {filteredQueries.length} of {queries.length} queries
                </div>

                {/* Queries Table */}
                <div style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden'
                }}>
                    {filteredQueries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px' }}>
                            <MessageSquare size={64} style={{ color: '#cbd5e1', marginBottom: 24 }} />
                            <h3 style={{ color: '#475569', marginBottom: 12 }}>No queries found</h3>
                            <p style={{ color: '#94a3b8', marginBottom: 24 }}>
                                Try adjusting your search terms or filters
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                                    <tr>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Query Details</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Customer</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Status</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Date</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredQueries.map((query, index) => {
                                            return (
                                                <motion.tr
                                                    key={query.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    style={{ borderBottom: '1px solid var(--border-light)' }}
                                                >
                                                    <td style={{ padding: '16px' }}>
                                                        <div>
                                                            {query.product_name && (
                                                                <p style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                    <Package size={14} style={{ color: '#94a3b8' }} />
                                                                    {query.product_name}
                                                                </p>
                                                            )}
                                                            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
                                                                {truncateMessage(query.message, 120)}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <div>
                                                            <p style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <User size={14} style={{ color: '#94a3b8' }} />
                                                                {query.user_name}
                                                            </p>
                                                            <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <Mail size={14} />
                                                                {query.user_email}
                                                            </p>
                                                            <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <Phone size={14} />
                                                                {query.user_phone}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <div style={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                background: getStatusColor(query.status)
                                                            }} />
                                                            <span style={{
                                                                fontSize: '0.9rem',
                                                                fontWeight: 600,
                                                                color: getStatusColor(query.status),
                                                                textTransform: 'capitalize'
                                                            }}>
                                                                {query.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                            {formatDate(query.created_at)}
                                                        </p>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedQuery(query);
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
                                                                <MessageSquare size={14} />
                                                                View
                                                            </button>

                                                            {query.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(query.id, 'contacted', 'Mark as contacted')}
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
                                                                        onClick={() => confirmStatusUpdate(query.id, 'resolved', 'Mark as resolved')}
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
                                                                        Resolve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(query.id, 'rejected', 'Reject query')}
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

                                                            {query.status === 'contacted' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(query.id, 'resolved', 'Mark as resolved')}
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
                                                                        Resolve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => confirmStatusUpdate(query.id, 'rejected', 'Reject query')}
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

                {/* Query Details Modal */}
                <AnimatePresence>
                    {showDetails && selectedQuery && (
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
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Query Details</h2>
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
                                    {selectedQuery.product_name && (
                                        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Package size={18} style={{ color: 'var(--primary)' }} />
                                                Product Information
                                            </h3>
                                            <p><strong>Product:</strong> {selectedQuery.product_name}</p>
                                        </div>
                                    )}

                                    {/* Message */}
                                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
                                            Customer Message
                                        </h3>
                                        <p style={{ lineHeight: 1.6 }}>{selectedQuery.message}</p>
                                    </div>

                                    {/* Customer Info */}
                                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <User size={18} style={{ color: 'var(--primary)' }} />
                                            Customer Information
                                        </h3>
                                        <div style={{ display: 'grid', gap: 8 }}>
                                            <p><strong>Name:</strong> {selectedQuery.user_name}</p>
                                            <p><strong>Email:</strong> {selectedQuery.user_email}</p>
                                            <p><strong>Phone:</strong> {selectedQuery.user_phone}</p>
                                        </div>
                                    </div>

                                    {/* Query Info */}
                                    <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Calendar size={18} style={{ color: 'var(--primary)' }} />
                                            Query Information
                                        </h3>
                                        <div style={{ display: 'grid', gap: 8 }}>
                                            <p><strong>Query ID:</strong> {selectedQuery.id}</p>
                                            <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedQuery.status), textTransform: 'capitalize' }}>{selectedQuery.status}</span></p>
                                            <p><strong>Created:</strong> {formatDate(selectedQuery.created_at)}</p>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                        {selectedQuery.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        confirmStatusUpdate(selectedQuery.id, 'contacted', 'Mark as contacted');
                                                        setShowDetails(false);
                                                    }}
                                                    style={{
                                                        padding: '10px 20px',
                                                        borderRadius: 8,
                                                        border: '1px solid #3b82f6',
                                                        background: 'white',
                                                        color: '#3b82f6',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8
                                                    }}
                                                >
                                                    <Phone size={16} />
                                                    Mark as Contacted
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        confirmStatusUpdate(selectedQuery.id, 'resolved', 'Mark as resolved');
                                                        setShowDetails(false);
                                                    }}
                                                    style={{
                                                        padding: '10px 20px',
                                                        borderRadius: 8,
                                                        border: '1px solid #10b981',
                                                        background: 'white',
                                                        color: '#10b981',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8
                                                    }}
                                                >
                                                    <CheckCircle size={16} />
                                                    Mark as Resolved
                                                </button>
                                            </>
                                        )}

                                        {selectedQuery.status === 'contacted' && (
                                            <button
                                                onClick={() => {
                                                    confirmStatusUpdate(selectedQuery.id, 'resolved', 'Mark as resolved');
                                                    setShowDetails(false);
                                                }}
                                                style={{
                                                    padding: '10px 20px',
                                                    borderRadius: 8,
                                                    border: '1px solid #10b981',
                                                    background: 'white',
                                                    color: '#10b981',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8
                                                }}
                                            >
                                                <CheckCircle size={16} />
                                                Mark as Resolved
                                            </button>
                                        )}
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
                        handleStatusUpdate(statusConfirm.queryId, statusConfirm.newStatus);
                        setStatusConfirm({ ...statusConfirm, isOpen: false });
                    }}
                    title={statusConfirm.action}
                    message={`Are you sure you want to ${statusConfirm.action.toLowerCase()}? This action will update the query status.`}
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
