import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug, getRelatedProducts, getCategories } from "@/lib/data";
import type { Metadata } from "next";
import ProductClientWrapper from "./product-client-wrapper";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product Not Found" };

    return {
        title: `${product.name} — Total Solutions`,
        description: product.short_description || product.description,
        openGraph: {
            title: product.name,
            description: product.description || "",
            images: product.image ? [{ url: product.image }] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const categories = await getCategories();
    const category = categories.find(c => c.id === product.category_id);
    const related = await getRelatedProducts(product.id, product.category_id || "");

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 72 }}>
                {/* Breadcrumb */}
                <section style={{ padding: "24px 0", background: "var(--bg-subtle)", borderBottom: "1px solid var(--border-light)" }}>
                    <div className="container">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "var(--text-light)" }}>
                            <Link href="/products" style={{ color: "var(--primary)" }}>Products</Link>
                            <span>/</span>
                            {category && (
                                <>
                                    <Link href={`/products/category/${category.slug}`} style={{ color: "var(--primary)" }}>
                                        {category.name}
                                    </Link>
                                    <span>/</span>
                                </>
                            )}
                            <span style={{ color: "var(--text)" }}>{product.name}</span>
                        </div>
                    </div>
                </section>

                {/* Product Detail - Animating parts go into a client component wrapper */}
                <section style={{ padding: "60px 0" }}>
                    <div className="container">
                        <ProductClientWrapper product={product} category={category} />
                    </div>
                </section>

                {related.length > 0 && (
                    <section style={{ padding: "60px 0", background: "var(--bg-subtle)" }}>
                        <div className="container">
                            <div className="section-title"><h2>Related Products</h2></div>
                            <div className="grid-4">
                                {related.map((p, i) => (
                                    <ProductCard key={p.id} product={p} index={i} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
