import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/Skeleton";
import { getCategoryBySlug, getProductsByCategorySlug } from "@/lib/data";
import type { Metadata } from "next";

interface PageParams {
    slug: string;
}

interface PageProps {
    params: PageParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = params;

    try {
        const category = await getCategoryBySlug(slug);
        if (!category) return { title: "Category Not Found" };

        return {
            title: `${category.name} — Total Solutions`,
            description: category.description || "",
            openGraph: {
                title: category.name,
                description: category.description || "",
                images: category.image ? [{ url: category.image }] : [],
            },
        };
    } catch {
        // On DB/RLS error, fall back to a generic meta so we don't expose internals
        return {
            title: "Category — Total Solutions",
            description: "Explore our product categories.",
        };
    }
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = params;
    let category;
    let products;

    try {
        category = await getCategoryBySlug(slug);

        if (!category) {
            // True not-found – show 404
            notFound();
        }

        products = await getProductsByCategorySlug(slug);
    } catch {
        // Unexpected Supabase / network / RLS error – show a user-friendly error, not a 404
        return (
            <>
                <Navbar />
                <main style={{ paddingTop: 72 }}>
                    <section style={{ padding: "64px 0" }}>
                        <div className="container">
                            <h1>Unable to load category</h1>
                            <p style={{ color: "var(--text-light)", marginTop: 8 }}>
                                There was a problem fetching this category. Please try again in a moment.
                            </p>
                            <Link
                                href="/products"
                                className="btn btn-primary"
                                style={{ marginTop: 24 }}
                            >
                                Back to Products
                            </Link>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 72 }}>
                <section style={{ padding: "64px 0", background: "linear-gradient(135deg, rgba(31,163,82,0.06), rgba(255,107,26,0.04))" }}>
                    <div className="container">
                        <div style={{ opacity: 1 }}>
                            <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600, marginBottom: 16 }}>
                                <ArrowLeft size={16} /> Back to Products
                            </Link>
                            <h1 style={{ marginBottom: 8 }}>{category.name}</h1>
                            <p style={{ color: "var(--text-light)", fontSize: "1.05rem", maxWidth: 600 }}>
                                {category.description}
                            </p>
                            <span className="badge badge-primary" style={{ marginTop: 12 }}>
                                {products.length} products
                            </span>
                        </div>
                    </div>
                </section>

                <section style={{ padding: "60px 0" }}>
                    <div className="container">
                        {/* Simple skeleton state in case streaming delays data */}
                        {!products && (
                            <div className="grid-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="card" style={{ padding: 24 }}>
                                        <Skeleton height={180} borderRadius="var(--radius-lg)" style={{ marginBottom: 16 }} />
                                        <Skeleton height={20} style={{ marginBottom: 8, width: "70%" }} />
                                        <Skeleton height={14} style={{ marginBottom: 8, width: "90%" }} />
                                        <Skeleton height={14} style={{ marginBottom: 16, width: "60%" }} />
                                        <Skeleton height={20} width={120} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {products && products.length > 0 && (
                            <div className="grid-4">
                                {products.map((p, i) => (
                                    <ProductCard key={p.id} product={p} index={i} />
                                ))}
                            </div>
                        )}

                        {products && products.length === 0 && (
                            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-lighter)" }}>
                                <p>No products currently available in this category.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
