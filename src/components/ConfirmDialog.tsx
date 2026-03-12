"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Check } from "lucide-react";
import { ReactNode } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
    icon?: ReactNode;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
    icon
}: Props) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const getColors = () => {
        switch (type) {
            case "danger":
                return {
                    bg: "#fef2f2",
                    border: "#fecaca",
                    text: "#dc2626",
                    buttonBg: "#dc2626",
                    buttonHover: "#b91c1c"
                };
            case "warning":
                return {
                    bg: "#fffbeb",
                    border: "#fed7aa",
                    text: "#ea580c",
                    buttonBg: "#ea580c",
                    buttonHover: "#c2410c"
                };
            default:
                return {
                    bg: "#eff6ff",
                    border: "#bfdbfe",
                    text: "#2563eb",
                    buttonBg: "#2563eb",
                    buttonHover: "#1d4ed8"
                };
        }
    };

    const colors = getColors();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1000,
                            backdropFilter: "blur(4px)"
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "white",
                            borderRadius: "16px",
                            padding: "32px",
                            maxWidth: "480px",
                            width: "90%",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            zIndex: 1001,
                            border: `1px solid ${colors.border}`
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                background: colors.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}>
                                {icon || <AlertTriangle size={24} color={colors.text} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8, color: "#1a1a2e" }}>
                                    {title}
                                </h3>
                                <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: "0.95rem" }}>
                                    {message}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 4,
                                    borderRadius: 8,
                                    color: "#9ca3af",
                                    transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#f3f4f6";
                                    e.currentTarget.style.color = "#6b7280";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "none";
                                    e.currentTarget.style.color = "#9ca3af";
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    border: "1px solid #e5e7eb",
                                    background: "white",
                                    color: "#6b7280",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#f9fafb";
                                    e.currentTarget.style.color = "#4b5563";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "white";
                                    e.currentTarget.style.color = "#6b7280";
                                }}
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: colors.buttonBg,
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = colors.buttonHover;
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.text}20`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = colors.buttonBg;
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <Check size={16} />
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
