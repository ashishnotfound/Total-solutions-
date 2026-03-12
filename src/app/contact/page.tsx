"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "./contact-form";
import { getCategories, getProducts } from "@/lib/data";
import { SITE } from "@/lib/constants";
import { Phone, Mail, MessageCircle, MapPin, User } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import type { Category, Product } from "@/lib/data";

export default function ContactPage() {
    const searchParams = useSearchParams();
    const product = searchParams.get('product') || '';
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [user, setUser] = useState<{ name?: string, email?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [categoriesData, productsData] = await Promise.all([
                    getCategories(),
                    getProducts()
                ]);
                setCategories(categoriesData);
                setProducts(productsData);
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();

        // Check if user is authenticated
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Invalid user data:', error);
            }
        }
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <main style={{ paddingTop: 72 }}>
                    <div className="container" style={{ padding: '80px 0' }}>
                        <div style={{ textAlign: 'center' }}>
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
                <section style={{ padding: "64px 0", background: "linear-gradient(135deg, rgba(31,163,82,0.06), rgba(255,107,26,0.04))", textAlign: "center" }}>
                    <div className="container">
                        <AnimatedSection>
                            <span className="badge badge-primary" style={{ marginBottom: 16 }}>Get in Touch</span>
                            <h1 style={{ marginBottom: 12, fontWeight: 900 }}>
                                Contact Us / Get a Quote
                            </h1>
                            <p style={{ color: "var(--text-light)", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
                                Tell us about your project and we&apos;ll get back to you with a custom quote within 24 hours. No account required.
                            </p>
                            {user && (
                                <div style={{
                                    marginTop: 16,
                                    padding: 12,
                                    background: '#dcfce7',
                                    borderRadius: 8,
                                    fontSize: '0.9rem',
                                    color: '#15803d',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                    <User size={16} />
                                    Signed in as {user.name}
                                </div>
                            )}
                        </AnimatedSection>
                    </div>
                </section>

                <section style={{ padding: "80px 0" }}>
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 64 }} className="contact-grid">
                            <div>
                                <AnimatedSection direction="right">
                                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 32 }}>Reach Us Directly</h2>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                                        {SITE.phones.map((p) => (
                                            <a key={p} href={`tel:${p}`} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", borderRadius: "var(--radius-lg)", background: "white", border: "1px solid var(--border-light)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", boxShadow: "var(--shadow-sm)", transition: "all 0.2s" }}>
                                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                                                    <Phone size={20} />
                                                </div>
                                                {p}
                                            </a>
                                        ))}

                                        <a href={`mailto:${SITE.email}`} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", borderRadius: "var(--radius-lg)", background: "white", border: "1px solid var(--border-light)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", boxShadow: "var(--shadow-sm)" }}>
                                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                                                <Mail size={20} />
                                            </div>
                                            {SITE.email}
                                        </a>

                                        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", borderRadius: "var(--radius-lg)", background: "#dcfce7", border: "1px solid #bbf7d0", fontSize: "1.05rem", fontWeight: 700, color: "#15803d", boxShadow: "var(--shadow-sm)" }}>
                                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                                                <MessageCircle size={20} />
                                            </div>
                                            WhatsApp Support
                                        </a>
                                    </div>

                                    <div style={{ marginBottom: 40 }}>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 20 }}>Our Locations</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                            {Object.values(SITE.addresses).map((addr) => (
                                                <div key={addr.label} style={{ display: "flex", gap: 16 }}>
                                                    <div style={{ marginTop: 4, color: "var(--primary)" }}><MapPin size={22} /></div>
                                                    <div>
                                                        <p style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 4 }}>{addr.label}</p>
                                                        <p style={{ color: "var(--text-light)", fontSize: "0.95rem", lineHeight: 1.6 }}>{addr.line1}<br />{addr.line2}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Real Google Map Embed */}
                                    <div style={{ height: 300, borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-md)" }}>
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.535006695581!2d77.331779!3d28.629686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cefdd8b64f7cf%3A0x5a130a5a4b58f9dd!2sTotal%20Solutions!5e0!3m2!1sen!2sin!4v1708963200000!5m2!1sen!2sin"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </AnimatedSection>
                            </div>

                            <div>
                                <AnimatedSection direction="left" delay={0.2}>
                                    <ContactForm categories={categories} products={products} prefilledValue={product} />
                                </AnimatedSection>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
