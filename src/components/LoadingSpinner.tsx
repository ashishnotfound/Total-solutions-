"use client";
import { motion } from "framer-motion";

interface Props {
    size?: number;
    color?: string;
    className?: string;
    fullPage?: boolean;
}

export default function LoadingSpinner({ size = 24, color = "var(--primary)", className = "", fullPage = false }: Props) {
    const spinner = (
        <motion.div
            className={className}
            style={{
                width: size,
                height: size,
                border: `3px solid ${color}33`, // 20% opacity for track
                borderTop: `3px solid ${color}`,
                borderRadius: "50%",
                display: "inline-block"
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
        />
    );

    if (fullPage) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh", width: "100%" }}>
                {spinner}
            </div>
        );
    }

    return spinner;
}
