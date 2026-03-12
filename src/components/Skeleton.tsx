import React from "react";

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

export default function Skeleton({
    width = "100%",
    height = "1rem",
    borderRadius = "var(--radius-sm)",
    className = "",
    style = {}
}: SkeletonProps) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius,
                backgroundImage: "linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                ...style
            }}
        />
    );
}
