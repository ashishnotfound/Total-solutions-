"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Save,
  Eye,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Trash2,
  Settings,
  Phone,
  MonitorPlay,
  RotateCcw,
  UploadCloud
} from "lucide-react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-hot-toast";

interface SiteConfig {
  logo: string;
  siteName: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  banners: Array<{
    id: string;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    active: boolean;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
  };
  mediaBlocks: Array<{
    id: string;
    title: string;
    type: "image" | "video";
    url: string;
    defaultUrl: string;
    videoSettings?: {
      autoplay: boolean;
      controls: boolean;
    };
  }>;
}

export default function SiteConfiguration() {
  const [config, setConfig] = useState<SiteConfig>({
    logo: "/images/logo.png",
    siteName: "Total Solutions",
    primaryColor: "#10b981",
    heroTitle: "Premium Printing & Branding Solutions",
    heroSubtitle: "Your one-stop solution for design and production in Noida",
    heroButtonText: "Get Started",
    heroButtonLink: "/contact",
    banners: [
      {
        id: "1",
        title: "Special Offer",
        subtitle: "Get 20% off on bulk orders",
        image: "/images/placeholder-banner.jpg",
        link: "/contact",
        active: true
      }
    ],
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com", icon: "facebook" },
      { platform: "instagram", url: "https://instagram.com", icon: "instagram" },
      { platform: "twitter", url: "https://twitter.com", icon: "twitter" }
    ],
    contactInfo: {
      email: "info@totalsolutions.com",
      phone: "+91 98765 43210",
      address: "Noida, India",
      whatsapp: "+91 98765 43210"
    },
    mediaBlocks: [
      {
        id: "hero_section",
        title: "Hero Section",
        type: "image",
        url: "/images/hero-bg.jpg",
        defaultUrl: "/images/hero-bg.jpg",
        videoSettings: { autoplay: true, controls: false }
      },
      {
        id: "dashboard_banner",
        title: "Dashboard Banner",
        type: "image",
        url: "/images/placeholder-banner.jpg",
        defaultUrl: "/images/placeholder-banner.jpg",
        videoSettings: { autoplay: true, controls: false }
      },
      {
        id: "promo_block",
        title: "Promotional Block",
        type: "image",
        url: "/images/promo.jpg",
        defaultUrl: "/images/promo.jpg",
        videoSettings: { autoplay: true, controls: false }
      },
      {
        id: "category_highlight",
        title: "Category Highlight",
        type: "image",
        url: "/images/category.jpg",
        defaultUrl: "/images/category.jpg",
        videoSettings: { autoplay: true, controls: false }
      }
    ]
  });

  const [activeTab, setActiveTab] = useState("general");
  const [draggedBanner, setDraggedBanner] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "hero", label: "Hero Section", icon: Type },
    { id: "media", label: "Media Manager", icon: MonitorPlay },
    { id: "banners", label: "Banners", icon: ImageIcon },
    { id: "social", label: "Social Links", icon: LinkIcon },
    { id: "contact", label: "Contact Info", icon: Phone },
  ];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const { settings } = await res.json();
          if (settings && Object.keys(settings).length > 0) {
            setConfig((prev) => ({
              ...prev,
              ...settings,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "config");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (type === "logo") {
          setConfig(prev => ({ ...prev, logo: data.url }));
        }
        toast.success("Logo uploaded");
      } else {
        toast.error("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const addBanner = () => {
    const newBanner = {
      id: Date.now().toString(),
      title: "New Banner",
      subtitle: "Banner description",
      image: "/images/placeholder-banner.jpg",
      link: "/",
      active: true
    };
    setConfig(prev => ({
      ...prev,
      banners: [...prev.banners, newBanner]
    }));
  };

  const removeBanner = (id: string) => {
    setConfig(prev => ({
      ...prev,
      banners: prev.banners.filter(b => b.id !== id)
    }));
  };

  const updateBanner = (id: string, updates: Partial<typeof config.banners[0]>) => {
    setConfig(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const handleBannerDrag = (e: React.DragEvent, bannerId: string) => {
    setDraggedBanner(bannerId);
  };

  const handleBannerDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedBanner || draggedBanner === targetId) return;

    const banners = [...config.banners];
    const draggedIndex = banners.findIndex(b => b.id === draggedBanner);
    const targetIndex = banners.findIndex(b => b.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      banners.splice(draggedIndex, 1);
      banners.splice(targetIndex, 0, config.banners.find(b => b.id === draggedBanner)!);
      setConfig(prev => ({ ...prev, banners }));
    }
    setDraggedBanner(null);
  };

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [id]: 10 }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "media");

    try {
      setUploadProgress(prev => ({ ...prev, [id]: 40 }));
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      setUploadProgress(prev => ({ ...prev, [id]: 80 }));
      const data = await res.json();

      if (res.ok) {
        const isVideo = file.type.startsWith("video/");
        setConfig(prev => ({
          ...prev,
          mediaBlocks: prev.mediaBlocks?.map(b =>
            b.id === id
              ? { ...b, url: data.url, type: isVideo ? "video" : "image" }
              : b
          ) || []
        }));
        setUploadProgress(prev => ({ ...prev, [id]: 100 }));
        toast.success("Media replaced");
      } else {
        toast.error("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Upload error");
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[id];
          return newProgress;
        });
      }, 500);
    }
  };

  const updateMediaBlock = (id: string, updates: Partial<SiteConfig["mediaBlocks"][0]>) => {
    setConfig(prev => ({
      ...prev,
      mediaBlocks: prev.mediaBlocks?.map(b =>
        b.id === id ? { ...b, ...updates } : b
      ) || []
    }));
  };

  const resetMediaBlock = (id: string) => {
    setConfig(prev => ({
      ...prev,
      mediaBlocks: prev.mediaBlocks?.map(b =>
        b.id === id ? { ...b, url: b.defaultUrl, type: "image", videoSettings: { autoplay: true, controls: false } } : b
      ) || []
    }));
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        toast.success("Configuration saved successfully!");
      } else {
        const data = await res.json();
        toast.error(`Save failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("An error occurred while saving the configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-1px" }}>Site Configuration</h1>
          <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: 500 }}>Manage your website settings and appearance.</p>
        </div>
        <button
          onClick={saveConfig}
          disabled={saving}
          className="btn btn-primary"
          style={{ padding: "10px 24px", borderRadius: 12, display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? <div style={{ width: 18, height: 18, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, background: "white", padding: 6, borderRadius: 14, border: "1px solid #f1f5f9", width: "fit-content", marginBottom: 32 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: "0.85rem",
                background: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "white" : "#64748b",
                transition: "all 0.2s"
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
        {/* Configuration Form */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "white", borderRadius: 24, padding: 32, border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)" }}
        >
          {/* General Settings */}
          {activeTab === "general" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Site Logo</label>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ position: "relative", width: 80, height: 80, borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {config.logo ? (
                      <Image src={config.logo} alt="Site Logo" width={80} height={80} style={{ objectFit: "cover" }} />
                    ) : (
                      <ImageIcon size={32} color="#cbd5e1" />
                    )}
                    {uploading && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 24, height: 24, border: "3px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "logo")} style={{ display: "none" }} id="logo-upload" />
                    <label htmlFor="logo-upload" className="btn btn-ghost" style={{ display: "inline-flex", cursor: "pointer", borderRadius: 10, padding: "8px 16px", gap: 8, fontSize: "0.9rem", fontWeight: 600 }}>
                      <Upload size={16} /> Upload New Logo
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Site Name</label>
                <input
                  type="text"
                  value={config.siteName}
                  onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Primary Color</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    style={{ width: 44, height: 44, padding: 0, border: "none", borderRadius: 8, cursor: "pointer" }}
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", fontFamily: "monospace" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hero Section */}
          {activeTab === "hero" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hero Title</label>
                <input
                  type="text"
                  value={config.heroTitle}
                  onChange={(e) => setConfig(prev => ({ ...prev, heroTitle: e.target.value }))}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hero Subtitle</label>
                <textarea
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  rows={3}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Button Text</label>
                  <input
                    type="text"
                    value={config.heroButtonText}
                    onChange={(e) => setConfig(prev => ({ ...prev, heroButtonText: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Button Link</label>
                  <input
                    type="text"
                    value={config.heroButtonLink}
                    onChange={(e) => setConfig(prev => ({ ...prev, heroButtonLink: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Media Manager Section */}
          {activeTab === "media" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>Media Manager</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Manage and preview all configurable media assets across the platform.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {config.mediaBlocks?.map((media) => (
                  <div key={media.id} style={{ border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", background: "#f8fafc" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)" }} />
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{media.title}</h4>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {media.url !== media.defaultUrl && (
                          <button
                            onClick={() => resetMediaBlock(media.id)}
                            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 600, color: "#64748b", background: "transparent", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6 }}
                          >
                            <RotateCcw size={14} /> Reset Default
                          </button>
                        )}
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "4px 10px", borderRadius: 100, background: media.type === "video" ? "#fce7f3" : "#e0e7ff", color: media.type === "video" ? "#db2777" : "#4f46e5", textTransform: "capitalize" }}>
                          {media.type}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: 20, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "start" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                        {/* Media Preview */}
                        <div style={{ position: "relative", width: "100%", maxWidth: 280, aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
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

                          {(uploadProgress[media.id] !== undefined) && (
                            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>{uploadProgress[media.id]}%</div>
                              <div style={{ width: "60%", height: 4, background: "#e2e8f0", borderRadius: 2 }}>
                                <div style={{ height: "100%", background: "var(--primary)", borderRadius: 2, width: `${uploadProgress[media.id]}%`, transition: "width 0.2s" }} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, minWidth: 200 }}>
                          <div>
                            <input type="file" accept="image/*,video/*" id={`upload-${media.id}`} style={{ display: "none" }} onChange={(e) => handleMediaUpload(e, media.id)} />
                            <label
                              htmlFor={`upload-${media.id}`}
                              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: "white", border: "1px dashed #cbd5e1", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "#475569", transition: "all 0.2s" }}
                              onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                            >
                              <UploadCloud size={16} color="var(--primary)" /> Replace Media
                            </label>
                          </div>

                          {media.type === "video" && (
                            <div style={{ background: "white", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 12 }}>
                              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Video Settings</p>
                              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
                                <input
                                  type="checkbox"
                                  checked={media.videoSettings?.autoplay}
                                  onChange={(e) => updateMediaBlock(media.id, { videoSettings: { ...media.videoSettings!, autoplay: e.target.checked } })}
                                  style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                                />
                                Autoplay & Muted
                              </label>
                              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
                                <input
                                  type="checkbox"
                                  checked={media.videoSettings?.controls}
                                  onChange={(e) => updateMediaBlock(media.id, { videoSettings: { ...media.videoSettings!, controls: e.target.checked } })}
                                  style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                                />
                                Show Controls
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Banners */}
          {activeTab === "banners" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b" }}>Manage Promotional Banners</h3>
                <button
                  onClick={addBanner}
                  className="btn btn-primary"
                  style={{ padding: "8px 16px", borderRadius: 10, fontSize: "0.85rem", gap: 6 }}
                >
                  <Plus size={16} /> Add Banner
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {config.banners.map((banner) => (
                  <div
                    key={banner.id}
                    draggable
                    onDragStart={(e) => handleBannerDrag(e, banner.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleBannerDrop(e, banner.id)}
                    style={{ padding: 20, borderRadius: 16, border: "1px solid #f1f5f9", background: "#f8fafc", cursor: "grab" }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                        placeholder="Banner Title"
                        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                      />
                      <input
                        type="text"
                        value={banner.subtitle}
                        onChange={(e) => updateBanner(banner.id, { subtitle: e.target.value })}
                        placeholder="Banner Subtitle"
                        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                      />
                      <input
                        type="text"
                        value={banner.image}
                        onChange={(e) => updateBanner(banner.id, { image: e.target.value })}
                        placeholder="Image URL"
                        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                      />
                      <input
                        type="text"
                        value={banner.link}
                        onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                        placeholder="Link URL"
                        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button
                        onClick={() => updateBanner(banner.id, { active: !banner.active })}
                        style={{ padding: 8, borderRadius: 8, border: "none", cursor: "pointer", background: banner.active ? "#eff6ff" : "#f1f5f9", color: banner.active ? "#2563eb" : "#64748b" }}
                        title={banner.active ? "Hide on site" : "Show on site"}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => removeBanner(banner.id)}
                        style={{ padding: 8, borderRadius: 8, border: "none", cursor: "pointer", background: "#fef2f2", color: "#ef4444" }}
                        title="Delete banner"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {activeTab === "social" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>Social Media Links</h3>
              {config.socialLinks.map((link, index) => (
                <div key={index} style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px", gap: 12 }}>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => {
                      const newLinks = [...config.socialLinks];
                      newLinks[index].platform = e.target.value;
                      setConfig(prev => ({ ...prev, socialLinks: newLinks }));
                    }}
                    placeholder="Platform"
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...config.socialLinks];
                      newLinks[index].url = e.target.value;
                      setConfig(prev => ({ ...prev, socialLinks: newLinks }));
                    }}
                    placeholder="URL"
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                  />
                  <input
                    type="text"
                    value={link.icon}
                    onChange={(e) => {
                      const newLinks = [...config.socialLinks];
                      newLinks[index].icon = e.target.value;
                      setConfig(prev => ({ ...prev, socialLinks: newLinks }));
                    }}
                    placeholder="Icon name"
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Contact Info */}
          {activeTab === "contact" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                  <input
                    type="email"
                    value={config.contactInfo.email}
                    onChange={(e) => setConfig(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, email: e.target.value } }))}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</label>
                  <input
                    type="tel"
                    value={config.contactInfo.phone}
                    onChange={(e) => setConfig(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, phone: e.target.value } }))}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>WhatsApp</label>
                  <input
                    type="tel"
                    value={config.contactInfo.whatsapp}
                    onChange={(e) => setConfig(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, whatsapp: e.target.value } }))}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</label>
                  <input
                    type="text"
                    value={config.contactInfo.address}
                    onChange={(e) => setConfig(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, address: e.target.value } }))}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Live Preview Panel */}
        <div style={{ position: "sticky", top: 24, background: "white", borderRadius: 24, padding: 32, border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0f172a" }}>Live Preview</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 100, background: "#eff6ff", color: "#2563eb", fontSize: "0.75rem", fontWeight: 700 }}>
              <Eye size={12} /> Live
            </div>
          </div>

          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
            {/* Header Preview */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", gap: 12 }}>
              {config.logo ? (
                <Image src={config.logo} alt="Logo" width={24} height={24} style={{ borderRadius: 6, objectFit: "cover" }} />
              ) : (
                <div style={{ width: 24, height: 24, background: "#f1f5f9", borderRadius: 6 }} />
              )}
              <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#1e293b" }}>{config.siteName}</span>
            </div>

            {/* Hero Preview */}
            <div style={{ padding: 24, textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b", marginBottom: 8 }}>{config.heroTitle}</h4>
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 16 }}>{config.heroSubtitle}</p>
              <button style={{ background: config.primaryColor, color: "white", padding: "6px 16px", borderRadius: 6, border: "none", fontSize: "0.75rem", fontWeight: 700 }}>
                {config.heroButtonText}
              </button>
            </div>

            {/* Banners Preview */}
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {config.banners.filter(b => b.active).map(b => (
                <div key={b.id} style={{ background: "white", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{b.title}</p>
                  <p style={{ fontSize: "0.7rem", color: "#64748b" }}>{b.subtitle}</p>
                </div>
              ))}
              {config.banners.filter(b => b.active).length === 0 && (
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", fontStyle: "italic" }}>No active banners</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
