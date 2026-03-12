import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Award, Users, Target, Zap, Clock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Image from "next/image";
import type { Metadata } from "next";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
    title: "About Us — Total Solutions",
    description: "Learn about Noida's leading in-house printing, packaging, and branding facility.",
};

export default async function AboutPage() {
    const rawSettings = await getSettings();

    const s = {
        heroTitle: (rawSettings.about_hero_title as string) || "Precision in Every Pixel & Layer.",
        heroSubtitle: (rawSettings.about_hero_subtitle as string) || "Founded with a vision to redefine printing standards, Total Solutions has grown from a small shop to a massive in-house production facility in Noida. We combine traditional craftsmanship with futuristic technology.",
        missionTitle: (rawSettings.about_mission_title as string) || "Our Mission & Values",
        missionText: (rawSettings.about_mission_text as string) || "We believe that great branding shouldn't be a luxury. Our mission is to provide enterprise-grade printing and packaging solutions to businesses of all sizes, with a focus on sustainable practices and extreme precision.",
        statYears: (rawSettings.about_stat_years as string) || "15+",
        statProjects: (rawSettings.about_stat_projects as string) || "2500+",
        statClients: (rawSettings.about_stat_clients as string) || "500+",
        statAwards: (rawSettings.about_stat_awards as string) || "12",
        facilityDesc: (rawSettings.about_facility_desc as string) || "Over 10,000 sq.ft of production space equipped with the latest Heidelberg and HP printing machines.",
        heroImage: (rawSettings.about_hero_image as string) || "",
        missionImage: (rawSettings.about_mission_image as string) || "",
        facilityImage1: (rawSettings.about_facility_image_1 as string) || "",
        facilityImage2: (rawSettings.about_facility_image_2 as string) || "",
        facilityImage3: (rawSettings.about_facility_image_3 as string) || "",
    };

    const stats = [
        { label: "Years Experience", value: s.statYears, icon: Clock },
        { label: "Successful Projects", value: s.statProjects, icon: Target },
        { label: "Corporate Clients", value: s.statClients, icon: Users },
        { label: "Awards Won", value: s.statAwards, icon: Award },
    ];

    const facilityImages = [s.facilityImage1, s.facilityImage2, s.facilityImage3];

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 72 }}>
                {/* Hero Section */}
                <section style={{ padding: "80px 0", background: "linear-gradient(135deg, rgba(31,163,82,0.06), rgba(255,107,26,0.04))" }}>
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center" }} className="about-hero">
                            <AnimatedSection direction="right">
                                <span className="badge badge-primary" style={{ marginBottom: 16 }}>Our Story</span>
                                <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
                                    {s.heroTitle}
                                </h1>
                                <p style={{ fontSize: "1.2rem", color: "var(--text-light)", lineHeight: 1.8, marginBottom: 32 }}>
                                    {s.heroSubtitle}
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    {["Modern Technology", "Expert Craftsmanship", "In-House Production", "Premium Materials"].map((item) => (
                                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ color: "var(--primary)" }}><CheckCircle size={20} /></div>
                                            <span style={{ fontWeight: 700, fontSize: "1rem" }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </AnimatedSection>
                            <AnimatedSection direction="left" delay={0.2}>
                                <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden", aspectRatio: "1/1", border: "10px solid white", boxShadow: "var(--shadow-xl)" }}>
                                    {s.heroImage ? (
                                        <Image src={s.heroImage} alt="About Total Solutions" fill style={{ objectFit: "cover" }} unoptimized />
                                    ) : (
                                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a3a3a, #1a1a2e)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)" }}>
                                            <Zap size={120} />
                                        </div>
                                    )}
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section style={{ padding: "60px 0", marginTop: -60, position: "relative", zIndex: 10 }}>
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, background: "white", padding: "48px", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-light)" }} className="stats-grid">
                            {stats.map((stat, i) => (
                                <AnimatedSection key={stat.label} delay={i * 0.1} style={{ textAlign: "center" }}>
                                    <div style={{ color: "var(--primary)", display: "flex", justifyContent: "center", marginBottom: 12 }}><stat.icon size={32} /></div>
                                    <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text)", marginBottom: 4, letterSpacing: "-1px" }}>{stat.value}</p>
                                    <p style={{ fontSize: "0.9rem", color: "var(--text-lighter)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</p>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section style={{ padding: "100px 0" }}>
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="mission-grid">
                            <AnimatedSection direction="right">
                                <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden", aspectRatio: "4/3", background: "#f8fafc", border: "1px solid var(--border-light)" }}>
                                    {s.missionImage ? (
                                        <Image src={s.missionImage} alt="Our Mission" fill style={{ objectFit: "cover" }} unoptimized />
                                    ) : (
                                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" }}>
                                            <Award size={80} />
                                        </div>
                                    )}
                                </div>
                            </AnimatedSection>
                            <AnimatedSection direction="left">
                                <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: 24 }}>{s.missionTitle}</h2>
                                <p style={{ color: "var(--text-light)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 32 }}>
                                    {s.missionText}
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                    <div style={{ display: "flex", gap: 20 }}>
                                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Target size={24} /></div>
                                        <div>
                                            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 4 }}>Quality-First Approach</h4>
                                            <p style={{ fontSize: "0.92rem", color: "var(--text-light)" }}>We never compromise on materials. From paper GSM to ink pigment, only the best makes the cut.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 20 }}>
                                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Award size={24} /></div>
                                        <div>
                                            <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 4 }}>Honest Pricing</h4>
                                            <p style={{ fontSize: "0.92rem", color: "var(--text-light)" }}>Transparent quotes without hidden costs. We provide competitive rates because of our in-house facility.</p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Facility Section */}
                <section style={{ padding: "100px 0", background: "var(--bg-subtle)" }}>
                    <div className="container">
                        <div style={{ textAlign: "center", marginBottom: 56 }}>
                            <h2 style={{ fontSize: "2.5rem", fontWeight: 900 }}>Our Production Facility</h2>
                            <p style={{ color: "var(--text-light)", maxWidth: 600, margin: "0 auto" }}>{s.facilityDesc}</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="facility-grid">
                            {facilityImages.map((img, idx) => (
                                <AnimatedSection key={idx} delay={idx * 0.1}>
                                    <div style={{ height: 260, borderRadius: "var(--radius-xl)", background: "white", border: "1px solid var(--border-light)", overflow: "hidden", position: "relative" }}>
                                        {img ? (
                                            <Image src={img} alt={`Facility ${idx + 1}`} fill style={{ objectFit: "cover" }} unoptimized />
                                        ) : (
                                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-lighter)", fontSize: "0.8rem" }}>
                                                Machine / Workflow Image {idx + 1}
                                            </div>
                                        )}
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
