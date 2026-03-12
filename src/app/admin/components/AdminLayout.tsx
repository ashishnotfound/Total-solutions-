"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Settings,
  Package,
  Image as ImageIcon,
  MessageSquare,
  Star,
  FileText,
  Phone,
  Home,
  ShoppingCart,
  Palette,
  Eye,
  Search,
  Bell,
  Moon,
  Sun
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Palette, label: "Site Configuration", href: "/admin/config" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: FileText, label: "Categories", href: "/admin/categories" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: MessageSquare, label: "Queries", href: "/admin/queries" },
    { icon: Star, label: "Reviews", href: "/admin/reviews" },
    { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
    { icon: Phone, label: "Contact", href: "/admin/contact" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const notifications = [
    { id: 1, title: "New order received", message: "Order #1234 from John Doe", time: "2 min ago", read: false },
    { id: 2, title: "Product review", message: "5-star review on Business Cards", time: "15 min ago", read: false },
    { id: 3, title: "Support ticket", message: "Customer needs help with order", time: "1 hour ago", read: true },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: "100vh", transition: "background 0.3s ease" }}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 40,
                backdropFilter: "blur(4px)"
              }}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 45,
                width: 264,
                background: "linear-gradient(195deg, #131b2e 0%, #0f172a 100%)",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)"
              }}>
                <h2 style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.02em"
                }}>
                  Admin Panel
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "rgba(255,255,255,0.5)",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <nav style={{
                padding: "16px 12px",
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}>
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        borderRadius: 10,
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        background: isActive ? "rgba(31, 163, 82, 0.12)" : "transparent",
                        color: isActive ? "#34d399" : "rgba(255,255,255,0.5)",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.88rem",
                        borderLeft: isActive ? "3px solid #1FA352" : "3px solid transparent",
                      }}
                      className="admin-nav-link"
                    >
                      <item.icon size={18} style={{ flexShrink: 0 }} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div style={{
                padding: "16px 16px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {darkMode ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  style={{
                    background: previewMode ? "rgba(31, 163, 82, 0.15)" : "rgba(255,255,255,0.06)",
                    border: "none",
                    color: previewMode ? "#34d399" : "rgba(255,255,255,0.4)",
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Eye size={17} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Top Bar */}
        <div style={{
          background: "transparent",
          zIndex: 30,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setSidebarOpen(true)}
                className="admin-topbar-btn"
                style={{
                  display: "none", // hidden on desktop, shown via CSS on mobile
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  padding: 8,
                  borderRadius: 10,
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <Menu size={18} color="#64748b" />
              </button>

              <div style={{
                position: "relative",
                maxWidth: 320,
                flex: 1,
              }}>
                <Search
                  size={15}
                  color="#94a3b8"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none"
                  }}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: 36,
                    paddingRight: 16,
                    paddingTop: 9,
                    paddingBottom: 9,
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 10,
                    fontSize: "0.85rem",
                    color: "#0f172a",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              {/* Preview toggle */}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.25s ease",
                  background: previewMode ? "#1FA352" : "white",
                  color: previewMode ? "white" : "#64748b",
                  boxShadow: previewMode
                    ? "0 2px 8px rgba(31, 163, 82, 0.25)"
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  ...(previewMode ? {} : { border: "1px solid rgba(0,0,0,0.06)" }),
                }}
                className="admin-preview-btn"
              >
                <Eye size={15} />
                {previewMode ? "Preview" : "Edit"}
              </button>

              {/* Notifications */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.06)",
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                  }}
                  className="admin-bell-btn"
                >
                  <Bell size={17} color="#64748b" />
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 7,
                      height: 7,
                      background: "#ef4444",
                      borderRadius: "50%",
                      border: "1.5px solid white",
                    }}
                      className="admin-pulse-dot"
                    />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 46,
                        width: 320,
                        background: "white",
                        borderRadius: 14,
                        boxShadow: "0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        zIndex: 50,
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <h3 style={{
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "#0f172a"
                        }}>
                          Notifications
                        </h3>
                      </div>
                      <div style={{ padding: "8px" }}>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            style={{
                              padding: "12px 14px",
                              borderRadius: 10,
                              marginBottom: 2,
                              background: notification.read ? "transparent" : "rgba(31, 163, 82, 0.04)",
                              transition: "background 0.2s ease",
                              cursor: "pointer",
                            }}
                            className="admin-notification-item"
                          >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                              <div style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                marginTop: 5,
                                flexShrink: 0,
                                background: notification.read ? "#d1d5db" : "#1FA352",
                              }}
                                className={notification.read ? "" : "admin-pulse-dot"}
                              />
                              <div style={{ flex: 1 }}>
                                <p style={{
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                  color: "#0f172a",
                                  marginBottom: 2
                                }}>
                                  {notification.title}
                                </p>
                                <p style={{
                                  fontSize: "0.75rem",
                                  color: "#64748b",
                                  marginBottom: 3
                                }}>
                                  {notification.message}
                                </p>
                                <p style={{
                                  fontSize: "0.7rem",
                                  color: "#94a3b8",
                                  fontWeight: 500
                                }}>
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User avatar */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "4px 8px 4px 4px",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
                className="admin-user-pill"
              >
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b"
                }}>
                  A
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.2
                  }}>
                    Admin
                  </p>
                  <p style={{
                    fontSize: "0.68rem",
                    color: "#94a3b8",
                    fontWeight: 500,
                    lineHeight: 1.2
                  }}>
                    admin@ts.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview mode banner */}
          <AnimatePresence>
            {previewMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  background: "rgba(59, 130, 246, 0.06)",
                  borderTop: "1px solid rgba(59, 130, 246, 0.1)",
                  borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
                  padding: "8px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Eye size={14} color="#3b82f6" />
                    <span style={{
                      fontSize: "0.78rem",
                      color: "#3b82f6",
                      fontWeight: 600
                    }}>
                      Preview Mode Active
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewMode(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "0.75rem",
                      color: "#3b82f6",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: 2,
                    }}
                  >
                    Exit Preview
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
