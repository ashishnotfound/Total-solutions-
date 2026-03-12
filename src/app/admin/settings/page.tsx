"use client";
import { useState, useEffect } from "react";
import {
    Save,
    Upload,
    Globe,
    Phone as PhoneIcon,
    MapPin,
    ImageIcon,
    Palette,
    Shield,
    Smartphone,
    Building2,
    CheckCircle2,
    Cpu,
    Zap,
    ShieldAlert,
    RotateCw,
    AlertCircle,
    RefreshCw,
    MonitorPlay,
    UploadCloud,
    RotateCcw,
    UserCircle2,
    Calendar,
    Plus,
    Trash2,
    Eye,
    Layout,
    Star
} from "lucide-react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SITE, COLORS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "react-hot-toast";

interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    active: boolean;
}

interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

interface MediaBlock {
    id: string;
    title: string;
    type: string;
    url: string;
    defaultUrl: string;
    videoSettings?: {
        autoplay: boolean;
        controls: boolean;
    };
}

interface AdminSettingsState {
    companyName: string;
    tagline: string;
    email: string;
    phone1: string;
    phone2: string;
    landline: string;
    whatsapp: string;
    officeAddr1: string;
    officeAddr2: string;
    regAddr1: string;
    regAddr2: string;
    primaryColor: string;
    accentColor: string;
    logo: string;
    heroMedia: string;
    heroTitle: string;
    heroSubtitle: string;
    heroButtonText: string;
    heroButtonLink: string;
    proprietor: string;
    established: string;
    mediaBlocks: MediaBlock[];
    banners: Banner[];
    socialLinks: SocialLink[];
    // About page
    aboutHeroTitle: string;
    aboutHeroSubtitle: string;
    aboutMissionTitle: string;
    aboutMissionText: string;
    aboutStatYears: string;
    aboutStatProjects: string;
    aboutStatClients: string;
    aboutStatAwards: string;
    aboutFacilityDesc: string;
    aboutHeroImage: string;
    aboutMissionImage: string;
    aboutFacilityImage1: string;
    aboutFacilityImage2: string;
    aboutFacilityImage3: string;
}

export default function AdminSettings() {
    const { refetch } = useSettings();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("general");
    const [fixingBucket, setFixingBucket] = useState(false);
    const [clearingCache, setClearingCache] = useState(false);

    const [settings, setSettings] = useState<AdminSettingsState>({
        companyName: SITE.name,
        tagline: SITE.tagline,
        email: SITE.email,
        phone1: SITE.phones[0],
        phone2: SITE.phones[1],
        landline: SITE.landline || "",
        whatsapp: SITE.whatsapp || "",
        officeAddr1: SITE.addresses.office.line1,
        officeAddr2: SITE.addresses.office.line2,
        regAddr1: SITE.addresses.registered.line1,
        regAddr2: SITE.addresses.registered.line2,
        primaryColor: COLORS.primary,
        accentColor: COLORS.accent,
        logo: "",
        heroMedia: "",
        heroTitle: "Let's print the brilliant life.",
        heroSubtitle: "From design to production — signage, packaging, stationery, and branded merchandise — all crafted in-house with premium quality.",
        heroButtonText: "Get a Quote",
        heroButtonLink: "/contact",
        proprietor: SITE.proprietor || "",
        established: String(SITE.established) || "",
        // About page defaults
        aboutHeroTitle: "Precision in Every Pixel & Layer.",
        aboutHeroSubtitle: "Founded with a vision to redefine printing standards, Total Solutions has grown from a small shop to a massive in-house production facility in Noida. We combine traditional craftsmanship with futuristic technology.",
        aboutMissionTitle: "Our Mission & Values",
        aboutMissionText: "We believe that great branding shouldn't be a luxury. Our mission is to provide enterprise-grade printing and packaging solutions to businesses of all sizes, with a focus on sustainable practices and extreme precision.",
        aboutStatYears: "15+",
        aboutStatProjects: "2500+",
        aboutStatClients: "500+",
        aboutStatAwards: "12",
        aboutFacilityDesc: "Over 10,000 sq.ft of production space equipped with the latest Heidelberg and HP printing machines.",
        aboutHeroImage: "",
        aboutMissionImage: "",
        aboutFacilityImage1: "",
        aboutFacilityImage2: "",
        aboutFacilityImage3: "",
        mediaBlocks: [
            { id: "hero_section", title: "Hero Section", type: "image", url: "/images/hero-bg.jpg", defaultUrl: "/images/hero-bg.jpg", videoSettings: { autoplay: true, controls: false } },
            { id: "dashboard_banner", title: "Dashboard Banner", type: "image", url: "/images/banner.jpg", defaultUrl: "/images/banner.jpg", videoSettings: { autoplay: true, controls: false } },
            { id: "promo_block", title: "Promotional Block", type: "image", url: "/images/promo.jpg", defaultUrl: "/images/promo.jpg", videoSettings: { autoplay: true, controls: false } },
            { id: "category_highlight", title: "Category Highlight", type: "image", url: "/images/category.jpg", defaultUrl: "/images/category.jpg", videoSettings: { autoplay: true, controls: false } }
        ],
        banners: [],
        socialLinks: [
            { platform: "Facebook", url: SITE.social.facebook, icon: "facebook" },
            { platform: "Instagram", url: SITE.social.instagram, icon: "instagram" },
            { platform: "Twitter", url: SITE.social.twitter, icon: "twitter" },
            { platform: "LinkedIn", url: SITE.social.linkedin, icon: "linkedin" }
        ]
    });

    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                if (res.ok) {
                    const data = await res.json();
                    if (data.settings && Object.keys(data.settings).length > 0) {
                        const s = data.settings;
                        setSettings(prev => ({
                            ...prev,
                            companyName: s.company_name || prev.companyName,
                            tagline: s.tagline || prev.tagline,
                            email: s.email || prev.email,
                            phone1: s.phones?.[0] || prev.phone1,
                            phone2: s.phones?.[1] || prev.phone2,
                            landline: s.landline || prev.landline,
                            whatsapp: s.whatsapp || prev.whatsapp,
                            officeAddr1: s.office_address_1 || prev.officeAddr1,
                            officeAddr2: s.office_address_2 || prev.officeAddr2,
                            regAddr1: s.reg_address_1 || prev.regAddr1,
                            regAddr2: s.reg_address_2 || prev.regAddr2,
                            primaryColor: s.primary_color || prev.primaryColor,
                            accentColor: s.accent_color || prev.accentColor,
                            logo: s.logo || prev.logo,
                            heroMedia: s.hero_media || prev.heroMedia,
                            heroTitle: s.hero_title || prev.heroTitle,
                            heroSubtitle: s.hero_subtitle || prev.heroSubtitle,
                            heroButtonText: s.hero_button_text || prev.heroButtonText,
                            heroButtonLink: s.hero_button_link || prev.heroButtonLink,
                            proprietor: s.proprietor || prev.proprietor,
                            established: s.established || prev.established,
                                    mediaBlocks: s.media_blocks || prev.mediaBlocks,
                            banners: s.banners || prev.banners,
                            socialLinks: s.social_links || prev.socialLinks,
                            aboutHeroTitle: s.about_hero_title || prev.aboutHeroTitle,
                            aboutHeroSubtitle: s.about_hero_subtitle || prev.aboutHeroSubtitle,
                            aboutMissionTitle: s.about_mission_title || prev.aboutMissionTitle,
                            aboutMissionText: s.about_mission_text || prev.aboutMissionText,
                            aboutStatYears: s.about_stat_years || prev.aboutStatYears,
                            aboutStatProjects: s.about_stat_projects || prev.aboutStatProjects,
                            aboutStatClients: s.about_stat_clients || prev.aboutStatClients,
                            aboutStatAwards: s.about_stat_awards || prev.aboutStatAwards,
                            aboutFacilityDesc: s.about_facility_desc || prev.aboutFacilityDesc,
                            aboutHeroImage: s.about_hero_image || prev.aboutHeroImage,
                            aboutMissionImage: s.about_mission_image || prev.aboutMissionImage,
                            aboutFacilityImage1: s.about_facility_image_1 || prev.aboutFacilityImage1,
                            aboutFacilityImage2: s.about_facility_image_2 || prev.aboutFacilityImage2,
                            aboutFacilityImage3: s.about_facility_image_3 || prev.aboutFacilityImage3,
                        }));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "heroMedia") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(field);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "site");

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setSettings(prev => ({ ...prev, [field]: data.url }));
            } else {
                toast.error("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Upload error. Please try again.");
        } finally {
            setUploading(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const body = {
                company_name: settings.companyName,
                tagline: settings.tagline,
                email: settings.email,
                phones: [settings.phone1, settings.phone2].filter(Boolean),
                landline: settings.landline,
                whatsapp: settings.whatsapp,
                office_address_1: settings.officeAddr1,
                office_address_2: settings.officeAddr2,
                reg_address_1: settings.regAddr1,
                reg_address_2: settings.regAddr2,
                primary_color: settings.primaryColor,
                accent_color: settings.accentColor,
                logo: settings.logo,
                hero_media: settings.heroMedia,
                hero_title: settings.heroTitle,
                hero_subtitle: settings.heroSubtitle,
                hero_button_text: settings.heroButtonText,
                hero_button_link: settings.heroButtonLink,
                proprietor: settings.proprietor,
                established: settings.established,
                media_blocks: settings.mediaBlocks,
                banners: settings.banners,
                social_links: settings.socialLinks,
                about_hero_title: settings.aboutHeroTitle,
                about_hero_subtitle: settings.aboutHeroSubtitle,
                about_mission_title: settings.aboutMissionTitle,
                about_mission_text: settings.aboutMissionText,
                about_stat_years: settings.aboutStatYears,
                about_stat_projects: settings.aboutStatProjects,
                about_stat_clients: settings.aboutStatClients,
                about_stat_awards: settings.aboutStatAwards,
                about_facility_desc: settings.aboutFacilityDesc,
                about_hero_image: settings.aboutHeroImage,
                about_mission_image: settings.aboutMissionImage,
                about_facility_image_1: settings.aboutFacilityImage1,
                about_facility_image_2: settings.aboutFacilityImage2,
                about_facility_image_3: settings.aboutFacilityImage3,
            };
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                toast.success("Settings saved successfully!");
                await refetch(); // Global context refetch
            } else {
                const data = await res.json();
                toast.error("Save failed: " + data.error);
            }
        } catch (err) {
            console.error("Failed to save settings", err);
            toast.error("Save failed. Ensure Supabase is connected.");
        } finally {
            setSaving(false);
        }
    };

    const handleFixBucket = async () => {
        setFixingBucket(true);
        const toastId = toast.loading("Repairing storage bucket permissions...");
        try {
            const res = await fetch("/api/admin/fix-bucket");
            if (res.ok) {
                toast.success("Storage bucket fixed! Video/PDF uploads enabled.", { id: toastId });
            } else {
                toast.error("Failed to repair bucket. Check Supabase connection.", { id: toastId });
            }
        } catch {
            toast.error("Network error while repairing bucket.", { id: toastId });
        } finally {
            setFixingBucket(false);
        }
    };

    const handleClearCache = async () => {
        setClearingCache(true);
        const toastId = toast.loading("Clearing global site cache...");
        try {
            // Re-saving settings triggers a cache clear in the backend
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _cache_bust: Date.now() })
            });

            if (res.ok) {
                await refetch(); // Global context refetch from useSettings()
                toast.success("Cache cleared! Changes are now live globally.", { id: toastId });
            } else {
                toast.error("Failed to clear cache.", { id: toastId });
            }
        } catch {
            toast.error("Network error.", { id: toastId });
        } finally {
            setClearingCache(false);
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: <Globe size={18} /> },
        { id: "hero", label: "Hero Content", icon: <Star size={18} /> },
        { id: "about", label: "About Page", icon: <UserCircle2 size={18} /> },
        { id: "contact", label: "Contact", icon: <PhoneIcon size={18} /> },
        { id: "branding", label: "Branding", icon: <Palette size={18} /> },
        { id: "media", label: "Media Manager", icon: <MonitorPlay size={18} /> },
        { id: "banners", label: "Banners", icon: <Layout size={18} /> },
        { id: "address", label: "Legal", icon: <Shield size={18} /> },
        { id: "maintenance", label: "System", icon: <Cpu size={18} /> },
    ];

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isVideo = file.type.startsWith("video/");

        // Simulate progress for UI premium feel
        setUploadProgress(prev => ({ ...prev, [blockId]: 10 }));
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                const current = prev[blockId] || 10;
                if (current >= 90) {
                    clearInterval(interval);
                    return prev;
                }
                return { ...prev, [blockId]: current + Math.floor(Math.random() * 15) };
            });
        }, 300);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "site");

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            clearInterval(interval);
            setUploadProgress(prev => ({ ...prev, [blockId]: 100 }));

            if (res.ok) {
                setSettings(prev => ({
                    ...prev,
                    mediaBlocks: prev.mediaBlocks.map(block =>
                        block.id === blockId
                            ? { ...block, url: data.url, type: isVideo ? "video" : "image" }
                            : block
                    )
                }));
                toast.success(`${isVideo ? 'Video' : 'Image'} uploaded successfully!`);
            } else {
                toast.error("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Upload error. Please try again.");
            clearInterval(interval);
        } finally {
            setTimeout(() => {
                setUploadProgress(prev => {
                    const next = { ...prev };
                    delete next[blockId];
                    return next;
                });
            }, 1000);
        }
    };

    const resetMediaBlock = (blockId: string) => {
        setSettings(prev => ({
            ...prev,
            mediaBlocks: prev.mediaBlocks.map(block =>
                block.id === blockId ? { ...block, url: block.defaultUrl, type: "image" } : block
            )
        }));
        toast.success("Block reset to default.");
    };

    const updateMediaBlock = (blockId: string, updates: Partial<MediaBlock>) => {
        setSettings(prev => ({
            ...prev,
            mediaBlocks: prev.mediaBlocks.map(block =>
                block.id === blockId ? { ...block, ...updates } : block
            )
        }));
    };

    const addBanner = () => {
        const newBanner: Banner = {
            id: Math.random().toString(36).substr(2, 9),
            title: "New Promotional Banner",
            subtitle: "Enter banner description here",
            image: "/images/banner-placeholder.jpg",
            link: "/products",
            active: true
        };
        setSettings(prev => ({ ...prev, banners: [...prev.banners, newBanner] }));
    };

    const removeBanner = (id: string) => {
        setSettings(prev => ({ ...prev, banners: prev.banners.filter((b) => b.id !== id) }));
    };

    const updateBanner = (id: string, updates: Partial<Banner>) => {
        setSettings(prev => ({
            ...prev,
            banners: prev.banners.map((b) => b.id === id ? { ...b, ...updates } : b)
        }));
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, bannerId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(`banner-${bannerId}`);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "site");

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                updateBanner(bannerId, { image: data.url });
                toast.success("Banner image uploaded!");
            } else {
                toast.error("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Upload failed");
        } finally {
            setUploading(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <LoadingSpinner size={32} fullPage />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 100 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Site Configuration</h1>
                    <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500 }}>Global settings and brand management.</p>
                </div>
                <button onClick={handleSave} className="btn btn-primary" style={{ borderRadius: 12, gap: 10, height: 48, padding: "0 24px" }} disabled={saving}>
                    {saving ? <LoadingSpinner size={20} color="white" /> : <Save size={20} />}
                    {saving ? "Deploying..." : "Save Changes"}
                </button>
            </div>

            <div style={{ display: "flex", gap: 32 }}>
                {/* Sidebar Tabs */}
                <div style={{ width: 220, flexShrink: 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, background: "white", padding: 8, borderRadius: 20, border: "1px solid #f1f5f9" }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 16px",
                                    borderRadius: 14,
                                    border: "none",
                                    background: activeTab === tab.id ? "var(--primary)" : "transparent",
                                    color: activeTab === tab.id ? "white" : "#64748b",
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Areas */}
                <div style={{ flex: 1 }}>
                    <AnimatePresence mode="wait">
                        {activeTab === "general" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 32, borderRadius: 28 }}>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                                        <Building2 size={22} style={{ color: "var(--primary)" }} /> General Settings
                                    </h3>
                                    <div className="form-group" style={{ marginBottom: 24 }}>
                                        <label className="form-label" style={{ fontWeight: 700 }}>Company Name</label>
                                        <input className="form-input" style={{ borderRadius: 12 }} name="companyName" value={settings.companyName} onChange={handleChange} placeholder="e.g. Total Solutions" />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 24 }}>
                                        <label className="form-label" style={{ fontWeight: 700 }}>Tagline / Catchphrase</label>
                                        <input className="form-input" style={{ borderRadius: 12 }} name="tagline" value={settings.tagline} onChange={handleChange} placeholder="e.g. Premium Printing Solutions" />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}><UserCircle2 size={14} style={{ display: "inline", marginBottom: -2, marginRight: 6 }} /> Proprietor Name</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="proprietor" value={settings.proprietor} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}><Calendar size={14} style={{ display: "inline", marginBottom: -2, marginRight: 6 }} /> Established Since</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="established" value={settings.established} onChange={handleChange} placeholder="e.g. 1995" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "hero" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 32, borderRadius: 28 }}>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                                        <Star size={22} style={{ color: "var(--primary)" }} /> Hero Section Content
                                    </h3>
                                    <div className="form-group" style={{ marginBottom: 24 }}>
                                        <label className="form-label" style={{ fontWeight: 700 }}>Main Headline</label>
                                        <input className="form-input" style={{ borderRadius: 12 }} name="heroTitle" value={settings.heroTitle} onChange={handleChange} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 24 }}>
                                        <label className="form-label" style={{ fontWeight: 700 }}>Sub-headline / Description</label>
                                        <textarea
                                            className="form-input"
                                            style={{ borderRadius: 12, minHeight: 100, padding: 16 }}
                                            name="heroSubtitle"
                                            value={settings.heroSubtitle}
                                            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}>CTA Button Text</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="heroButtonText" value={settings.heroButtonText} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}>CTA Button Link</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="heroButtonLink" value={settings.heroButtonLink} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === "about" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 32, borderRadius: 28 }}>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                                        <UserCircle2 size={22} style={{ color: "var(--primary)" }} /> About Page Content
                                    </h3>
                                    <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 32 }}>Edit all the text content displayed on your /about page.</p>

                                    {/* Hero Section Text + Image */}
                                    <div style={{ background: "#f8fafc", borderRadius: 20, padding: 24, marginBottom: 24, border: "1px solid #f1f5f9" }}>
                                        <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>Hero Section</h4>
                                        <div className="form-group" style={{ marginBottom: 16 }}>
                                            <label className="form-label" style={{ fontWeight: 700 }}>Main Headline</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="aboutHeroTitle" value={settings.aboutHeroTitle} onChange={handleChange} placeholder="e.g. Precision in Every Pixel & Layer." />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: 20 }}>
                                            <label className="form-label" style={{ fontWeight: 700 }}>Hero Description Paragraph</label>
                                            <textarea
                                                className="form-input"
                                                style={{ borderRadius: 12, minHeight: 100, padding: 16 }}
                                                name="aboutHeroSubtitle"
                                                value={settings.aboutHeroSubtitle}
                                                onChange={(e) => setSettings({ ...settings, aboutHeroSubtitle: e.target.value })}
                                                placeholder="e.g. Founded with a vision to redefine..."
                                            />
                                        </div>
                                        {/* Hero Image Upload */}
                                        <label className="form-label" style={{ fontWeight: 700, display: "block", marginBottom: 12 }}>Hero Right-Side Image</label>
                                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                            <div style={{ width: 140, height: 90, borderRadius: 14, overflow: "hidden", background: "#e2e8f0", flexShrink: 0, position: "relative", border: "2px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                                                {settings.aboutHeroImage
                                                    ? <Image src={settings.aboutHeroImage} alt="Hero" fill style={{ objectFit: "cover" }} unoptimized />
                                                    : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>No image</div>
                                                }
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>
                                                    {uploading === "aboutHeroImage" ? <LoadingSpinner size={16} color="#475569" /> : <UploadCloud size={16} />}
                                                    {uploading === "aboutHeroImage" ? "Uploading..." : "Upload Hero Image"}
                                                    <input type="file" hidden accept="image/*" onChange={async (e) => {
                                                        const file = e.target.files?.[0]; if (!file) return;
                                                        setUploading("aboutHeroImage");
                                                        const fd = new FormData(); fd.append("file", file); fd.append("bucket", "site");
                                                        try { const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const d = await res.json(); if (res.ok) { setSettings(p => ({ ...p, aboutHeroImage: d.url })); toast.success("Hero image uploaded!"); } else { toast.error("Upload failed: " + d.error); } } catch { toast.error("Upload error."); } finally { setUploading(null); }
                                                    }} />
                                                </label>
                                                {settings.aboutHeroImage && <button onClick={() => setSettings(p => ({ ...p, aboutHeroImage: "" }))} style={{ marginTop: 8, fontSize: "0.75rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>✕ Remove image</button>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Section */}
                                    <div style={{ background: "#f8fafc", borderRadius: 20, padding: 24, marginBottom: 24, border: "1px solid #f1f5f9" }}>
                                        <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>Stats Bar (the 4 numbers)</h4>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontWeight: 700 }}>Years of Experience</label>
                                                <input className="form-input" style={{ borderRadius: 12 }} name="aboutStatYears" value={settings.aboutStatYears} onChange={handleChange} placeholder="e.g. 15+" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontWeight: 700 }}>Successful Projects</label>
                                                <input className="form-input" style={{ borderRadius: 12 }} name="aboutStatProjects" value={settings.aboutStatProjects} onChange={handleChange} placeholder="e.g. 2500+" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontWeight: 700 }}>Corporate Clients</label>
                                                <input className="form-input" style={{ borderRadius: 12 }} name="aboutStatClients" value={settings.aboutStatClients} onChange={handleChange} placeholder="e.g. 500+" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontWeight: 700 }}>Awards Won</label>
                                                <input className="form-input" style={{ borderRadius: 12 }} name="aboutStatAwards" value={settings.aboutStatAwards} onChange={handleChange} placeholder="e.g. 12" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mission Section */}
                                    <div style={{ background: "#f8fafc", borderRadius: 20, padding: 24, marginBottom: 24, border: "1px solid #f1f5f9" }}>
                                        <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>Mission & Values Section</h4>
                                        <div className="form-group" style={{ marginBottom: 16 }}>
                                            <label className="form-label" style={{ fontWeight: 700 }}>Section Title</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="aboutMissionTitle" value={settings.aboutMissionTitle} onChange={handleChange} placeholder="e.g. Our Mission & Values" />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: 20 }}>
                                            <label className="form-label" style={{ fontWeight: 700 }}>Mission Statement Paragraph</label>
                                            <textarea
                                                className="form-input"
                                                style={{ borderRadius: 12, minHeight: 120, padding: 16 }}
                                                name="aboutMissionText"
                                                value={settings.aboutMissionText}
                                                onChange={(e) => setSettings({ ...settings, aboutMissionText: e.target.value })}
                                                placeholder="e.g. We believe that great branding shouldn't be a luxury..."
                                            />
                                        </div>
                                        {/* Mission Image Upload */}
                                        <label className="form-label" style={{ fontWeight: 700, display: "block", marginBottom: 12 }}>Mission Left-Side Image</label>
                                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                            <div style={{ width: 140, height: 90, borderRadius: 14, overflow: "hidden", background: "#e2e8f0", flexShrink: 0, position: "relative", border: "2px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                                                {settings.aboutMissionImage
                                                    ? <Image src={settings.aboutMissionImage} alt="Mission" fill style={{ objectFit: "cover" }} unoptimized />
                                                    : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>No image</div>
                                                }
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>
                                                    {uploading === "aboutMissionImage" ? <LoadingSpinner size={16} color="#475569" /> : <UploadCloud size={16} />}
                                                    {uploading === "aboutMissionImage" ? "Uploading..." : "Upload Mission Image"}
                                                    <input type="file" hidden accept="image/*" onChange={async (e) => {
                                                        const file = e.target.files?.[0]; if (!file) return;
                                                        setUploading("aboutMissionImage");
                                                        const fd = new FormData(); fd.append("file", file); fd.append("bucket", "site");
                                                        try { const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const d = await res.json(); if (res.ok) { setSettings(p => ({ ...p, aboutMissionImage: d.url })); toast.success("Mission image uploaded!"); } else { toast.error("Upload failed: " + d.error); } } catch { toast.error("Upload error."); } finally { setUploading(null); }
                                                    }} />
                                                </label>
                                                {settings.aboutMissionImage && <button onClick={() => setSettings(p => ({ ...p, aboutMissionImage: "" }))} style={{ marginTop: 8, fontSize: "0.75rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>✕ Remove image</button>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facility Section + 3x Image Uploads */}
                                    <div style={{ background: "#f8fafc", borderRadius: 20, padding: 24, border: "1px solid #f1f5f9" }}>
                                        <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>Production Facility Section</h4>
                                        <div className="form-group" style={{ marginBottom: 24 }}>
                                            <label className="form-label" style={{ fontWeight: 700 }}>Facility Description</label>
                                            <textarea
                                                className="form-input"
                                                style={{ borderRadius: 12, minHeight: 80, padding: 16 }}
                                                name="aboutFacilityDesc"
                                                value={settings.aboutFacilityDesc}
                                                onChange={(e) => setSettings({ ...settings, aboutFacilityDesc: e.target.value })}
                                                placeholder="e.g. Over 10,000 sq.ft of production space..."
                                            />
                                        </div>
                                        <label className="form-label" style={{ fontWeight: 700, display: "block", marginBottom: 16 }}>Facility Photos (3 slots)</label>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                                            {(["aboutFacilityImage1", "aboutFacilityImage2", "aboutFacilityImage3"] as const).map((key, idx) => (
                                                <div key={key} style={{ borderRadius: 16, overflow: "hidden", border: "2px dashed #e2e8f0", background: "white" }}>
                                                    <div style={{ aspectRatio: "4/3", position: "relative", background: "#f8fafc" }}>
                                                        {settings[key]
                                                            ? <Image src={settings[key]} alt={`Facility ${idx + 1}`} fill style={{ objectFit: "cover" }} unoptimized />
                                                            : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", gap: 8 }}>
                                                                <ImageIcon size={28} />
                                                                <span style={{ fontSize: "0.72rem", fontWeight: 700 }}>Photo {idx + 1}</span>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div style={{ padding: "10px 12px" }}>
                                                        <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#f1f5f9", border: "none", borderRadius: 10, padding: "8px 0", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", color: "#475569", width: "100%" }}>
                                                            {uploading === key ? <LoadingSpinner size={14} color="#475569" /> : <UploadCloud size={14} />}
                                                            {uploading === key ? "Uploading..." : "Upload"}
                                                            <input type="file" hidden accept="image/*" onChange={async (e) => {
                                                                const file = e.target.files?.[0]; if (!file) return;
                                                                setUploading(key);
                                                                const fd = new FormData(); fd.append("file", file); fd.append("bucket", "site");
                                                                try { const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const d = await res.json(); if (res.ok) { setSettings(p => ({ ...p, [key]: d.url })); toast.success(`Facility photo ${idx + 1} uploaded!`); } else { toast.error("Upload failed: " + d.error); } } catch { toast.error("Upload error."); } finally { setUploading(null); }
                                                            }} />
                                                        </label>
                                                        {settings[key] && <button onClick={() => setSettings(p => ({ ...p, [key]: "" }))} style={{ marginTop: 6, fontSize: "0.72rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 700, width: "100%" }}>✕ Remove</button>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "contact" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 32, borderRadius: 28 }}>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                                        <Smartphone size={22} style={{ color: "var(--primary)" }} /> Contact Details
                                    </h3>
                                    <div className="form-group" style={{ marginBottom: 24 }}>
                                        <label className="form-label" style={{ fontWeight: 700 }}>Primary Email Address</label>
                                        <input className="form-input" style={{ borderRadius: 12 }} name="email" value={settings.email} onChange={handleChange} />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}>Mobile Number 1</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="phone1" value={settings.phone1} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}>Mobile Number 2</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="phone2" value={settings.phone2} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}>WhatsApp Business</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="whatsapp" value={settings.whatsapp} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}>Landline No.</label>
                                            <input className="form-input" style={{ borderRadius: 12 }} name="landline" value={settings.landline} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Social Presence</h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {settings.socialLinks.map((link, index) => (
                                            <div key={index} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, alignItems: "center" }}>
                                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>{link.platform}</span>
                                                <input
                                                    className="form-input"
                                                    style={{ borderRadius: 10 }}
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        const newLinks = [...settings.socialLinks];
                                                        newLinks[index].url = e.target.value;
                                                        setSettings(prev => ({ ...prev, socialLinks: newLinks }));
                                                    }}
                                                    placeholder={`${link.platform} Profile URL`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "branding" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 32, borderRadius: 28 }}>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                                        <Palette size={22} style={{ color: "var(--primary)" }} /> Visual Branding
                                    </h3>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                                        <div>
                                            <label className="form-label" style={{ fontWeight: 700, marginBottom: 12 }}>Corporate Logo</label>
                                            <div style={{
                                                height: 140,
                                                borderRadius: 20,
                                                background: "#f8fafc",
                                                border: "2px dashed #e2e8f0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                                position: "relative"
                                            }}>
                                                {settings.logo ? <Image src={settings.logo} alt="Logo" width={140} height={140} unoptimized style={{ maxHeight: "70%", maxWidth: "70%", objectFit: "contain" }} /> : <ImageIcon size={40} style={{ color: "#cbd5e1" }} />}
                                                <label style={{ position: "absolute", bottom: 12, right: 12, width: 36, height: 36, background: "white", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer", border: "1px solid #f1f5f9" }}>
                                                    {uploading === "logo" ? <LoadingSpinner size={16} color="#475569" /> : <Upload size={16} />}
                                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, "logo")} />
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label" style={{ fontWeight: 700, marginBottom: 12 }}>Hero Showcase</label>
                                            <div style={{
                                                height: 140,
                                                borderRadius: 20,
                                                background: "#f8fafc",
                                                border: "2px dashed #e2e8f0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                                position: "relative"
                                            }}>
                                                {settings.heroMedia ? (
                                                    <div style={{ textAlign: "center", color: "var(--primary)" }}>
                                                        <CheckCircle2 size={32} style={{ marginBottom: 4 }} />
                                                        <span style={{ fontSize: "0.7rem", fontWeight: 800 }}>READY</span>
                                                    </div>
                                                ) : <ImageIcon size={40} style={{ color: "#cbd5e1" }} />}
                                                <label style={{ position: "absolute", bottom: 12, right: 12, width: 36, height: 36, background: "white", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer", border: "1px solid #f1f5f9" }}>
                                                    {uploading === "heroMedia" ? <LoadingSpinner size={16} color="#475569" /> : <Upload size={16} />}
                                                    <input type="file" hidden accept="image/*,video/*" onChange={(e) => handleFileUpload(e, "heroMedia")} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}>Primary Brand Color</label>
                                            <div style={{ display: "flex", gap: 12 }}>
                                                <div style={{ width: 48, height: 48, borderRadius: 12, background: settings.primaryColor, border: "3px solid white", boxShadow: "0 0 0 1px #e2e8f0" }} />
                                                <input className="form-input" style={{ borderRadius: 12, flex: 1 }} name="primaryColor" value={settings.primaryColor} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 700 }}>Accent UI Color</label>
                                            <div style={{ display: "flex", gap: 12 }}>
                                                <div style={{ width: 48, height: 48, borderRadius: 12, background: settings.accentColor, border: "3px solid white", boxShadow: "0 0 0 1px #e2e8f0" }} />
                                                <input className="form-input" style={{ borderRadius: 12, flex: 1 }} name="accentColor" value={settings.accentColor} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "media" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 32, borderRadius: 28 }}>
                                    <div style={{ marginBottom: 32 }}>
                                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                                            <MonitorPlay size={22} style={{ color: "var(--primary)" }} /> Media Manager
                                        </h3>
                                        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Manage dynamic media assets for various sections of your platform.</p>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        {settings.mediaBlocks.map((media) => (
                                            <div key={media.id} style={{ border: "1px solid #f1f5f9", borderRadius: 20, overflow: "hidden", background: "#f8fafc" }}>
                                                {/* Header */}
                                                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 10px rgba(31, 163, 82, 0.3)" }} />
                                                        <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>{media.title}</h4>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                        {media.url !== media.defaultUrl && (
                                                            <button
                                                                onClick={() => resetMediaBlock(media.id)}
                                                                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                                                                onMouseOver={(e) => (e.currentTarget.style.color = "#ef4444")}
                                                                onMouseOut={(e) => (e.currentTarget.style.color = "#94a3b8")}
                                                            >
                                                                <RotateCcw size={14} /> Reset Default
                                                            </button>
                                                        )}
                                                        <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: media.type === "video" ? "#fce7f3" : "#e0e7ff", color: media.type === "video" ? "#db2777" : "#4f46e5", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                            {media.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>
                                                    {/* Preview Box */}
                                                    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "#000", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
                                                        {media.type === "video" ? (
                                                            <video
                                                                src={media.url}
                                                                autoPlay={media.videoSettings?.autoplay}
                                                                muted={media.videoSettings?.autoplay}
                                                                controls={media.videoSettings?.controls}
                                                                loop
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <Image src={media.url} alt={media.title} fill style={{ objectFit: "cover" }} />
                                                        )}

                                                        {uploadProgress[media.id] !== undefined && (
                                                            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, zIndex: 10 }}>
                                                                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--primary)" }}>{uploadProgress[media.id]}%</div>
                                                                <div style={{ width: "70%", height: 6, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                                                                    <div style={{ height: "100%", background: "var(--primary)", width: `${uploadProgress[media.id]}%`, transition: "width 0.3s ease-out" }} />
                                                                </div>
                                                                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>UPLOADING ASSET...</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions Box */}
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                                        <div style={{ background: "white", padding: 20, borderRadius: 16, border: "1px solid #f1f5f9" }}>
                                                            <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Actions</p>
                                                            <div style={{ display: "flex", gap: 12 }}>
                                                                <input type="file" accept="image/*,video/*" id={`upload-${media.id}`} style={{ display: "none" }} onChange={(e) => handleMediaUpload(e, media.id)} />
                                                                <label
                                                                    htmlFor={`upload-${media.id}`}
                                                                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px", borderRadius: 12, background: "white", border: "2px dashed #e2e8f0", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", transition: "all 0.2s" }}
                                                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#f0fdf4"; }}
                                                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}
                                                                >
                                                                    <UploadCloud size={18} style={{ color: "var(--primary)" }} /> Replace
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {media.type === "video" && (
                                                            <div style={{ background: "white", padding: 20, borderRadius: 16, border: "1px solid #f1f5f9" }}>
                                                                <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Playback Configuration</p>
                                                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                                                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={media.videoSettings?.autoplay}
                                                                            onChange={(e) => updateMediaBlock(media.id, { videoSettings: { ...media.videoSettings!, autoplay: e.target.checked } })}
                                                                            style={{ width: 18, height: 18, accentColor: "var(--primary)", cursor: "pointer" }}
                                                                        />
                                                                        Enable Background Autoplay
                                                                    </label>
                                                                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={media.videoSettings?.controls}
                                                                            onChange={(e) => updateMediaBlock(media.id, { videoSettings: { ...media.videoSettings!, controls: e.target.checked } })}
                                                                            style={{ width: 18, height: 18, accentColor: "var(--primary)", cursor: "pointer" }}
                                                                        />
                                                                        Show User Controls Overlay
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", background: "#f8fafc", padding: "12px 16px", borderRadius: 12, border: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
                                                            <Shield size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                                                            <span>Changes here are saved only when you click the <b>Save Changes</b> button above.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "banners" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 32, borderRadius: 28 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                        <div>
                                            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                                                <Layout size={22} style={{ color: "var(--primary)" }} /> Promotional Banners
                                            </h3>
                                            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Add high-impact banners for current offers or events.</p>
                                        </div>
                                        <button onClick={addBanner} className="btn btn-primary btn-sm" style={{ borderRadius: 10, gap: 6 }}>
                                            <Plus size={16} /> Add New
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {settings.banners.map((banner) => (
                                            <div key={banner.id} style={{ padding: 20, borderRadius: 16, border: "1px solid #f1f5f9", background: "#f8fafc" }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                                                    <div className="form-group">
                                                        <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 700 }}>Title</label>
                                                        <input className="form-input" style={{ borderRadius: 10, padding: "8px 12px" }} value={banner.title} onChange={(e) => updateBanner(banner.id, { title: e.target.value })} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 700 }}>Subtitle</label>
                                                        <input className="form-input" style={{ borderRadius: 10, padding: "8px 12px" }} value={banner.subtitle} onChange={(e) => updateBanner(banner.id, { subtitle: e.target.value })} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 700 }}>Link URL</label>
                                                        <input className="form-input" style={{ borderRadius: 10, padding: "8px 12px" }} value={banner.link} onChange={(e) => updateBanner(banner.id, { link: e.target.value })} />
                                                    </div>
                                                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                                                        <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 700 }}>Banner Image</label>
                                                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                                            <div style={{ width: 120, height: 60, borderRadius: 10, background: "white", border: "1px solid #e2e8f0", overflow: "hidden", flexShrink: 0 }}>
                                                                <Image src={banner.image} alt="Banner" width={120} height={60} unoptimized style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                            </div>
                                                            <div style={{ flex: 1, display: "flex", gap: 8 }}>
                                                                <input className="form-input" style={{ borderRadius: 10, padding: "8px 12px", fontSize: "0.8rem" }} value={banner.image} onChange={(e) => updateBanner(banner.id, { image: e.target.value })} placeholder="Image URL" />
                                                                <label style={{ width: 40, height: 40, borderRadius: 10, background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                                                                    {uploading === `banner-${banner.id}` ? <LoadingSpinner size={16} /> : <Upload size={16} />}
                                                                    <input type="file" hidden accept="image/*" onChange={(e) => handleBannerUpload(e, banner.id)} />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                                                    <button
                                                        onClick={() => updateBanner(banner.id, { active: !banner.active })}
                                                        style={{ padding: 8, borderRadius: 8, border: "none", cursor: "pointer", background: banner.active ? "#f0fdf4" : "#f1f5f9", color: banner.active ? "#16a34a" : "#64748b", display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 700 }}
                                                    >
                                                        <Eye size={16} /> {banner.active ? "Visible" : "Hidden"}
                                                    </button>
                                                    <button
                                                        onClick={() => removeBanner(banner.id)}
                                                        style={{ padding: 8, borderRadius: 8, border: "none", cursor: "pointer", background: "#fef2f2", color: "#ef4444" }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {settings.banners.length === 0 && (
                                            <div style={{ textAlign: "center", padding: "40px 0", background: "#f8fafc", borderRadius: 16, border: "1px dashed #e2e8f0" }}>
                                                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No active banners. Click &quot;Add New&quot; to create one.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "address" && (

                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 32, borderRadius: 28 }}>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                                        <MapPin size={22} style={{ color: "var(--primary)" }} /> Office Locations
                                    </h3>
                                    <div style={{ marginBottom: 32 }}>
                                        <label className="form-label" style={{ fontWeight: 700, marginBottom: 12 }}>Physical Office Address</label>
                                        <input className="form-input" style={{ borderRadius: 12, marginBottom: 12 }} name="officeAddr1" value={settings.officeAddr1} onChange={handleChange} placeholder="Building, Street Name" />
                                        <input className="form-input" style={{ borderRadius: 12 }} name="officeAddr2" value={settings.officeAddr2} onChange={handleChange} placeholder="City, State, Zip" />
                                    </div>
                                    <div>
                                        <label className="form-label" style={{ fontWeight: 700, marginBottom: 12 }}>Registered Business Address</label>
                                        <input className="form-input" style={{ borderRadius: 12, marginBottom: 12 }} name="regAddr1" value={settings.regAddr1} onChange={handleChange} placeholder="Official Registration Line 1" />
                                        <input className="form-input" style={{ borderRadius: 12 }} name="regAddr2" value={settings.regAddr2} onChange={handleChange} placeholder="Official Registration Line 2" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "maintenance" && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="admin-card" style={{ padding: 40, borderRadius: 28 }}>
                                    <div style={{ marginBottom: 32 }}>
                                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                                            <Cpu size={22} style={{ color: "var(--primary)" }} /> System Maintenance
                                        </h3>
                                        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Diagnostic tools and system-level configurations.</p>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                        <div style={{ padding: 24, borderRadius: 20, border: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ maxWidth: "70%" }}>
                                                <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                                                    <Zap size={18} style={{ color: "#eab308" }} /> Fix Storage Permissions
                                                </h4>
                                                <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                                                    Resolves issues where uploading videos (.mp4) or documents results in a &quot;MIME type not supported&quot; error. This updates your Supabase bucket settings.
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleFixBucket}
                                                disabled={fixingBucket}
                                                style={{ padding: "12px 20px", borderRadius: 12, background: "white", border: "1px solid #e2e8f0", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
                                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                                            >
                                                {fixingBucket ? <RotateCw size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                                                {fixingBucket ? "Repairing..." : "Repair Bucket"}
                                            </button>
                                        </div>

                                        <div style={{ padding: 24, borderRadius: 20, border: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ maxWidth: "70%" }}>
                                                <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                                                    <RefreshCw size={18} style={{ color: "var(--primary)" }} /> Clear Global Cache
                                                </h4>
                                                <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                                                    Force an immediate refresh of all pages on the public website. Use this if your changes are not appearing instantly on the live site.
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleClearCache}
                                                disabled={clearingCache}
                                                style={{ padding: "12px 20px", borderRadius: 12, background: "white", border: "1px solid #e2e8f0", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
                                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                                            >
                                                {clearingCache ? <RotateCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                                {clearingCache ? "Clearing..." : "Purge Cache"}
                                            </button>
                                        </div>

                                        <div style={{ padding: 20, borderRadius: 16, background: "#fef2f2", border: "1px solid #fee2e2", display: "flex", gap: 12, alignItems: "start" }}>
                                            <AlertCircle size={18} style={{ color: "#ef4444", marginTop: 2 }} />
                                            <div>
                                                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#991b1b", marginBottom: 2 }}>System Notice</p>
                                                <p style={{ fontSize: "0.75rem", color: "#b91c1c", lineHeight: 1.4 }}>
                                                    These tools modify low-level infrastructure. Only use them if you are experiencing technical issues with uploads or caching.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
}
