import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getApprovedReviews } from "@/lib/data";
import ReviewForm from "./review-form";
import AnimatedSection from "@/components/AnimatedSection";
import Image from "next/image";
import { Star, MessageSquareQuote } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Customer Reviews — Total Solutions",
    description: "Read what our clients say about our printing and packaging quality.",
};

export default async function ReviewsPage() {
    const reviews = await getApprovedReviews();

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 72 }}>
                <section style={{ padding: "64px 0", background: "linear-gradient(135deg, rgba(255,107,26,0.06), rgba(31,163,82,0.04))", textAlign: "center" }}>
                    <div className="container">
                        <AnimatedSection>
                            <span className="badge badge-accent" style={{ marginBottom: 16 }}>Testimonials</span>
                            <h1 style={{ marginBottom: 12, fontWeight: 900 }}>Customer Reviews</h1>
                            <p style={{ color: "var(--text-light)", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
                                We take pride in our craft. See what our valued partners and clients have to say about us.
                            </p>
                        </AnimatedSection>
                    </div>
                </section>

                <section style={{ padding: "80px 0" }}>
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 64 }} className="reviews-grid">
                            <div>
                                <AnimatedSection direction="right">
                                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                        {reviews.length > 0 ? (
                                            reviews.map((r) => (
                                                <div key={r.id} style={{ padding: "40px", borderRadius: "var(--radius-xl)", background: "white", boxShadow: "var(--shadow-md)", border: "1px solid var(--border-light)", position: "relative" }}>
                                                    <div style={{ position: "absolute", top: 32, right: 32, opacity: 0.1, color: "var(--primary)" }}>
                                                        <MessageSquareQuote size={64} />
                                                    </div>

                                                    <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                                                        {Array.from({ length: 5 }).map((_, s) => (
                                                            <Star
                                                                key={s}
                                                                size={20}
                                                                fill={s < r.rating ? "var(--accent)" : "none"}
                                                                color={s < r.rating ? "var(--accent)" : "#d1d5db"}
                                                            />
                                                        ))}
                                                    </div>

                                                    <p style={{ fontSize: "1.15rem", color: "var(--text)", lineHeight: 1.8, marginBottom: 32, fontStyle: "italic", fontWeight: 500 }}>
                                                        &ldquo;{r.text}&rdquo;
                                                    </p>

                                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2rem", border: "4px solid var(--primary-light)" }}>
                                                            {r.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>{r.name}</p>
                                                            <p style={{ fontSize: "0.9rem", color: "var(--text-lighter)", fontWeight: 600 }}>{r.company}</p>
                                                        </div>
                                                        <div style={{ marginLeft: "auto", fontSize: "0.85rem", color: "var(--text-lighter)" }}>
                                                            {new Date(r.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                                                        </div>
                                                    </div>

                                                    {r.photo && (
                                                        <div style={{ marginTop: 24, borderRadius: "var(--radius-lg)", overflow: "hidden", position: "relative", height: 200, border: "1px solid var(--border-light)" }}>
                                                            <Image src={r.photo} alt="Work Photo" fill style={{ objectFit: "cover" }} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-lighter)" }}>
                                                <p>No reviews yet. Be the first to share your experience!</p>
                                            </div>
                                        )}
                                    </div>
                                </AnimatedSection>
                            </div>

                            <div>
                                <AnimatedSection direction="left" delay={0.2} style={{ position: "sticky", top: 100 }}>
                                    <div style={{ padding: "40px", borderRadius: "var(--radius-xl)", background: "linear-gradient(135deg, #1a1a2e, #0f172a)", color: "white", boxShadow: "var(--shadow-xl)" }}>
                                        <h2 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: 8, color: "white" }}>Share Your Experience</h2>
                                        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>Your feedback helps us maintain our premium standards.</p>
                                        <ReviewForm />
                                    </div>

                                    <div style={{ marginTop: 32, padding: "32px", borderRadius: "var(--radius-xl)", background: "var(--primary-light)", border: "1px solid var(--primary-light)", textAlign: "center" }}>
                                        <p style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1.1rem", marginBottom: 8 }}>4.9/5 Average Rating</p>
                                        <p style={{ fontSize: "0.88rem", color: "var(--primary-dark)", fontWeight: 600 }}>Based on 500+ satisfied corporate clients.</p>
                                    </div>
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
