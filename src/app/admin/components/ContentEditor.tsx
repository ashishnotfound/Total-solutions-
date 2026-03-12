"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Eye,
  GripVertical,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ContentItem {
  id: string;
  type: "text" | "image" | "service" | "testimonial" | "contact" | "gallery";
  title?: string;
  content?: string;
  subtitle?: string;
  image?: string;
  order: number;
  active?: boolean;
  metadata?: Record<string, unknown>;
}

interface ContentEditorProps {
  contentType: "services" | "gallery" | "about" | "reviews" | "contact";
  title: string;
  description: string;
}

export default function ContentEditor({ contentType, title, description }: ContentEditorProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: ""
  });

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image: "",
    active: true,
    metadata: {} as Record<string, unknown>
  });

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const { settings } = await res.json();
        const key = `${contentType}_content`;
        if (settings[key] && Array.isArray(settings[key])) {
          setItems(settings[key]);
        } else {
          // Initialize with empty or default if first time
          setItems([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch content", err);
      toast.error("Failed to load content");
    }
  }, [contentType]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "content");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success("Image uploaded");
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

  const saveItem = async () => {
    setSaving(true);
    let newItems;
    if (editingItem) {
      newItems = items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      );
    } else {
      const newItem: ContentItem = {
        id: crypto.randomUUID(),
        type: contentType === "services" ? "service" :
          contentType === "gallery" ? "gallery" :
            contentType === "about" ? "text" :
              contentType === "reviews" ? "testimonial" : "contact",
        ...formData,
        order: items.length + 1
      };
      newItems = [...items, newItem];
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [`${contentType}_content`]: newItems })
      });

      if (res.ok) {
        setItems(newItems);
        setShowModal(false);
        setEditingItem(null);
        resetForm();
        toast.success("Content saved");
      } else {
        toast.error("Failed to save content");
      }
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Save error");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [`${contentType}_content`]: newItems })
      });

      if (res.ok) {
        setItems(newItems);
        toast.success("Item deleted");
      } else {
        toast.error("Delete failed on server");
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete error");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      content: "",
      image: "",
      active: true,
      metadata: {}
    });
  };

  const openEditModal = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      content: item.content || "",
      image: item.image || "",
      active: item.active ?? true,
      metadata: item.metadata || {}
    });
    setShowModal(true);
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;

    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < items.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

      newItems.forEach((item, i) => {
        item.order = i + 1;
      });

      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [`${contentType}_content`]: newItems })
        });

        if (res.ok) {
          setItems(newItems);
        }
      } catch (err) {
        console.error("Move failed", err);
        toast.error("Failed to sync order");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${previewMode
                ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
            >
              <Eye className="h-4 w-4" />
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </button>
            {!previewMode && (
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add {contentType === "services" ? "Service" :
                  contentType === "gallery" ? "Image" :
                    contentType === "about" ? "Section" :
                      contentType === "reviews" ? "Review" : "Contact"}
              </button>
            )}
          </div>
        </div>
      </div>

      {!previewMode ? (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                <div className="cursor-move">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                    {item.subtitle && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</span>
                    )}
                  </div>
                  {item.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {item.content}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveItem(item.id, "up")}
                    disabled={item.order === 1}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => moveItem(item.id, "down")}
                    disabled={item.order === items.length}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: true, id: item.id })}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.subtitle}</p>
              )}
              {item.content && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.content}</p>
              )}
              {item.image && (
                <div className="w-full h-32 mt-3 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title || "Image"}
                    width={300}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {editingItem ? "Edit Item" : "Add New Item"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700"
                  />
                </div>

                {(contentType === "services" || contentType === "reviews") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {contentType === "services" ? "Subtitle" : "Company/Role"}
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700"
                    />
                  </div>
                )}

                {(contentType === "services" || contentType === "about" || contentType === "reviews") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {contentType === "reviews" ? "Review Text" : "Content"}
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700"
                    />
                  </div>
                )}

                {(contentType === "services" || contentType === "gallery" || contentType === "reviews") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image
                    </label>
                    <div className="flex items-center gap-4">
                      {formData.image && (
                        <div className="relative">
                          <Image
                            src={formData.image}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                          {uploading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="content-image-upload"
                        />
                        <label
                          htmlFor="content-image-upload"
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveItem}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saving ? "Saving..." : editingItem ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: "" })}
        onConfirm={() => deleteItem(deleteConfirm.id)}
        title="Delete Item?"
        message="Are you sure you want to delete this item? This action will sync to the site immediately."
        type="danger"
      />
    </div>
  );
}
