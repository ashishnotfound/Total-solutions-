"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
    style?: React.CSSProperties;
    stagger?: boolean;
}

export default function AnimatedSection({ children, delay = 0, direction = "up", className, style, stagger = false }: Props) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px", amount: 0.2 }}
            transition={{ 
                duration: 0.8, 
                delay, 
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: stagger ? 0.1 : 0
            }}
            variants={variants}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}
