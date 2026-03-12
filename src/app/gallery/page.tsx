import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGalleryItems } from "@/lib/data";
import GalleryClient from "./gallery-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project Gallery — Total Solutions",
    description: "A curated showcase of our finest printing, signage, and branding work.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
    searchParams: Promise<{ category?: string }>;
}

export default async function GalleryPage({ searchParams }: Props) {
    const { category } = await searchParams;
    const activeCategory = category || "All";
    const galleryItems = await getGalleryItems();

    // Filter items on the server
    const filteredItems = activeCategory === "All"
        ? galleryItems
        : galleryItems.filter(item => (item.category || "").toLowerCase() === activeCategory.toLowerCase());

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 72 }}>
                <section style={{ padding: "64px 0", background: "linear-gradient(135deg, rgba(31,163,82,0.06), rgba(255,107,26,0.04))", textAlign: "center" }}>
                    <div className="container">
                        <div style={{ opacity: 1 }}>
                            <span className="badge badge-primary" style={{ marginBottom: 16 }}>Our Portfolio</span>
                            <h1 style={{ marginBottom: 12, fontWeight: 900 }}>Project Gallery</h1>
                            <p style={{ color: "var(--text-light)", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
                                A curated showcase of our finest printing, signage, and branding work.
                            </p>
                        </div>
                    </div>
                </section>

                <Suspense fallback={<div className="container" style={{ textAlign: "center", padding: 100 }}>Loading Gallery...</div>}>
                    <GalleryClient initialItems={filteredItems} activeCategory={activeCategory} />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
