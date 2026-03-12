import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Printer,
  Layers,
  Package,
  Monitor,
  Scissors,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { SITE } from "@/lib/constants";
import { getCategories, getFeaturedProducts, getApprovedReviews, getSettings } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Total Solutions — Premium Printing & Branding",
  description: "From design to production — signage, packaging, stationery, and branded merchandise — all crafted in-house with premium quality.",
  openGraph: {
    title: "Total Solutions — Premium Printing & Branding",
    description: "Your one-stop solution for design and production in Noida.",
    images: ["https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?q=80&w=2070"],
  },
};

const serviceStrip = [
  { icon: Layers, label: "Signage" },
  { icon: Monitor, label: "Large Format" },
  { icon: Package, label: "Packaging" },
  { icon: Star, label: "Promotional" },
  { icon: Printer, label: "Digital Print" },
  { icon: Scissors, label: "Finishing" },
];

const whyUs = [
  {
    title: "In-House Production",
    desc: "Complete control from design to delivery — everything under one roof.",
    icon: "🏭",
  },
  {
    title: "Strict Quality Control",
    desc: "Every print passes through rigorous quality checks before dispatch.",
    icon: "✅",
  },
  {
    title: "Fast Turnaround",
    desc: "Industry-leading delivery times without compromising on quality.",
    icon: "⚡",
  },
  {
    title: "Custom Print Solutions",
    desc: "Tailored solutions for unique branding and packaging requirements.",
    icon: "🎨",
  },
];

export default async function HomePage() {
  const [categories, featured, reviews, settings] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getApprovedReviews(),
    getSettings(),
  ]);

  const mediaBlocks: {id: string, url: string}[] = Array.isArray(settings?.media_blocks) ? settings.media_blocks as {id: string, url: string}[] : [];
  
  const getMediaUrl = (id: string, fallback: string) => {
      const block = mediaBlocks.find(b => b.id === id);
      return block?.url || fallback;
  };

  return (
    <>
      <Navbar />

      <main>
        {/* ===== HERO SECTION ===== */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(31,163,82,0.02) 0%, rgba(255,107,26,0.015) 50%, rgba(31,163,82,0.01) 100%)",
            overflow: "hidden",
            paddingTop: 64,
          }}
        >
          {/* Decorative Elements */}
          <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,163,82,0.05), transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: -150, left: -150, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,26,0.03), transparent 70%)", filter: "blur(80px)" }} />

          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="hero-grid">
              <AnimatedSection direction="right">
                <div className="badge badge-primary" style={{ marginBottom: 24, fontSize: "0.80rem", padding: "8px 20px" }}>
                  ✨ Estd. {SITE.established} — Trusted by 500+ businesses
                </div>

                <h1 style={{ fontWeight: 900, marginBottom: 24, letterSpacing: "-0.04em" }}>
                  <span style={{ color: "var(--text)" }}>Let&apos;s print the</span><br />
                  <span style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>brilliant life.</span>
                </h1>

                <p style={{ fontSize: "1.15rem", color: "var(--text-light)", lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
                  From design to production — signage, packaging, stationery, and branded merchandise — all crafted in-house with premium quality.
                </p>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <Link href="/contact" className="btn btn-primary btn-lg">Get a Quote <ArrowRight size={18} /></Link>
                  <Link href="/products" className="btn btn-outline btn-lg">View Products</Link>
                </div>
              </AnimatedSection>

              {/* Hero Visual */}
              <AnimatedSection direction="left" delay={0.2} style={{ position: "relative" }}>
                <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden", aspectRatio: "16/10", boxShadow: "var(--shadow-xl)", border: "1px solid var(--border-light)" }}>
                  <Image
                    src={getMediaUrl("hero_section", "https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?q=80&w=2070")}
                    alt="Hero Visual"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent 60%)" }} />

                  <div style={{ position: "absolute", bottom: 32, left: 32, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderRadius: "var(--radius-lg)", padding: "20px 28px", boxShadow: "var(--shadow-lg)", border: "1px solid rgba(255,255,255,0.4)" }}>
                    <p style={{ fontWeight: 800, fontSize: "1.75rem", color: "var(--primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>500+</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-light)", fontWeight: 600, marginTop: 4 }}>Happy Clients</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ===== CATEGORY STRIP — Interactive horizontal menu ===== */}
        <section style={{ padding: "48px 0", background: "white", position: "relative", zIndex: 10 }}>
          <style>{`
            .premium-category-container {
              display: flex;
              justify-content: center;
              gap: 16px;
              flex-wrap: wrap;
            }
            
            .category-card {
              position: relative;
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 16px 28px;
              background: var(--base);
              border: 1px solid var(--border);
              border-radius: 100px;
              color: var(--text);
              text-decoration: none;
              font-weight: 600;
              font-size: 0.95rem;
              overflow: hidden;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              box-shadow: 0 4px 12px rgba(0,0,0,0.02);
            }
            
            .category-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              width: 100%;
              background: linear-gradient(90deg, rgba(31,163,82,0.1) 0%, rgba(31,163,82,0.02) 100%);
              transform: translateX(-101%);
              transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
              z-index: 0;
            }
            
            .category-card:hover {
              border-color: rgba(31,163,82,0.3);
              box-shadow: 0 12px 24px -6px rgba(31,163,82,0.15);
              background: white;
              transform: translateY(-2px) scale(1.02);
            }
            
            .category-card:hover::before {
              transform: translateX(0);
            }
            
            .category-card .icon-wrapper,
            .category-card .label-wrapper {
              position: relative;
              z-index: 1;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            .category-card:hover .icon-wrapper {
              color: var(--primary);
              transform: scale(1.2) rotate(-5deg);
            }
            
            .category-card:hover .label-wrapper {
              color: var(--primary-dark);
              transform: translateX(4px) scale(1.05);
            }
            
            @media (max-width: 900px) {
              .premium-category-container {
                justify-content: flex-start;
                flex-wrap: nowrap;
                overflow-x: auto;
                padding-bottom: 20px;
                padding-top: 10px;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                margin-bottom: -20px;
              }
              .premium-category-container::-webkit-scrollbar {
                display: none;
              }
              .category-card {
                flex-shrink: 0;
                padding: 14px 24px;
              }
            }
          `}</style>
          <div className="container">
            <div className="premium-category-container">
              {serviceStrip.map(({ icon: Icon, label }, i) => (
                <AnimatedSection key={label} delay={i * 0.05} style={{ display: "inline-flex" }}>
                  <Link href={`/products`} className="category-card">
                    <span className="icon-wrapper" style={{ display: "flex" }}>
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <span className="label-wrapper">{label}</span>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRODUCT CATEGORIES ===== */}
        <section style={{ padding: "100px 0" }}>
          <div className="container">
            <AnimatedSection>
              <div className="section-title">
                <span className="overline">Our Products</span>
                <h2>Explore Our Product Range</h2>
                <p>From large-format signage to corporate stationery and branded merchandise — we cover it all.</p>
              </div>
            </AnimatedSection>

            <div className="grid-3">
              {categories.slice(0, 3).map((cat, i) => {
                const images = [
                  "https://images.unsplash.com/photo-1626786139196-1cc4e64f4347?q=80&w=2070", // Printing press
                  "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070", // Design/Office
                  "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=2070"  // Packaging/Boxes
                ];
                return (
                  <AnimatedSection key={cat.id} delay={i * 0.1}>
                    <Link href={`/products/category/${cat.slug}`} style={{ textDecoration: "none" }}>
                      <div className="card" style={{ cursor: "pointer", overflow: "hidden", height: "100%", border: "1px solid var(--border-light)" }}>
                        <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
                          <Image
                            src={(cat.image && cat.image.startsWith('http')) ? cat.image : images[i % images.length]}
                            alt={cat.name}
                            fill
                            style={{ objectFit: "cover", transition: "transform 0.6s var(--ease-spring)" }}
                            className="category-image"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                        </div>
                        <div className="card-body" style={{ padding: "32px 28px" }}>
                          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 12, color: "var(--text)", letterSpacing: "-0.02em" }}>{cat.name}</h3>
                          <p style={{ fontSize: "0.95rem", color: "var(--text-light)", lineHeight: 1.6, marginBottom: 24 }}>{cat.description}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem" }} className="category-link">
                            Explore Category <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE US ===== */}
        <section style={{ padding: "100px 0", background: "#f8fafc" }}>
          <div className="container">
            <AnimatedSection>
              <div className="section-title">
                <span className="overline">Expertise</span>
                <h2>Why Businesses Trust Us</h2>
                <p>With everything under one roof, we deliver quality, speed, and customization like no one else.</p>
              </div>
            </AnimatedSection>

            <div className="grid-3">
              {whyUs.map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 0.1}>
                  <div style={{ padding: "48px 36px", borderRadius: "var(--radius-xl)", background: "white", border: "1px solid var(--border-light)", height: "100%", transition: "all 0.3s var(--ease-spring)" }} className="hover-card card">
                    <div style={{ fontSize: "3rem", marginBottom: 24, filter: "drop-shadow(0 10px 15px rgba(31,163,82,0.15))" }}>{item.icon}</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em", color: "var(--text)" }}>{item.title}</h3>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-light)", lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section style={{ padding: "100px 0" }}>
          <div className="container">
            <AnimatedSection>
              <div className="section-title">
                <span className="overline">Selection</span>
                <h2>Featured Solutions</h2>
                <p>Browse our most sought-after printing and branding solutions.</p>
              </div>
            </AnimatedSection>

            <div className="grid-4">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>

            <AnimatedSection delay={0.3} style={{ textAlign: "center", marginTop: 64 }}>
              <Link href="/products" className="btn btn-outline btn-lg" style={{ borderRadius: 14, paddingLeft: 40, paddingRight: 40 }}>Browse Full Catalog <ArrowRight size={20} /></Link>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== REVIEWS PREVIEW ===== */}
        {reviews.length > 0 && (
          <section style={{ padding: "100px 0", background: "#0f172a", color: "white" }}>
            <div className="container">
              <AnimatedSection>
                <div className="section-title" style={{ marginBottom: 64 }}>
                  <span className="overline" style={{ color: "var(--accent)" }}>TESTIMONIALS</span>
                  <h2 style={{ color: "white" }}>What Our Clients Say</h2>
                  <p style={{ color: "rgba(255,255,255,0.7)" }}>Don&apos;t just take our word for it — hear what businesses have to say about our premium printing services.</p>
                </div>
              </AnimatedSection>

              <div className="grid-3">
                {reviews.slice(0, 3).map((r, i) => (
                  <AnimatedSection key={r.id} delay={i * 0.1}>
                    <div style={{ padding: "44px", borderRadius: "var(--radius-xl)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", position: "relative", backdropFilter: "blur(20px)", height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" }}>
                      <div className="stars" style={{ marginBottom: 24 }}>
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} size={16} fill={s < r.rating ? "var(--accent)" : "none"} color={s < r.rating ? "var(--accent)" : "rgba(255,255,255,0.15)"} strokeWidth={2} />
                        ))}
                      </div>
                      <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.75, marginBottom: 36, fontStyle: "italic", flex: 1 }}>&ldquo;{r.text}&rdquo;</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2rem", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>{r.name.charAt(0)}</div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: 2 }}>{r.name}</p>
                          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase" }}>{r.company}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== CTA SECTION ===== */}
        <section style={{ padding: "120px 0", background: "linear-gradient(135deg, var(--primary) 0%, #15803d 100%)", color: "white", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
            <Image src={getMediaUrl("promo_block", "https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?q=80&w=2070")} alt="Background patterns" fill style={{ objectFit: "cover" }} sizes="100vw" />
          </div>
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <AnimatedSection>
              <h2 style={{ color: "white", marginBottom: 24, fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, letterSpacing: "-1.5px" }}>Bring Your Vision to Life.</h2>
              <p style={{ fontSize: "1.25rem", opacity: 0.9, marginBottom: 48, maxWidth: 650, margin: "0 auto 48px", fontWeight: 500 }}>Partner with Noida&apos;s most trusted printing house for your next major project.</p>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-lg" style={{ background: "white", color: "var(--primary)", fontWeight: 800, padding: "0 48px", height: 60, borderRadius: 14 }}>Get Custom Quote</Link>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn btn-lg" style={{ background: "rgba(0,0,0,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "0 40px", height: 60, borderRadius: 14 }}>💬 WhatsApp Us</a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />

    </>
  );
}
