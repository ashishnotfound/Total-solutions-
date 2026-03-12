/**
 * Data Access Layer for Total Solutions
 * 
 * This module provides a unified interface for data access.
 * It auto-detects whether Supabase is configured:
 *   - If NEXT_PUBLIC_SUPABASE_URL is set → uses Supabase
 *   - Otherwise → falls back to local JSON files
 * 
 * This allows the app to work both in development (no Supabase)
 * and in production (with Supabase) without code changes.
 */

import type { Category, Product, Review, GalleryItem, Quote, Query } from "@/lib/supabase/types";

// Helper to detect Supabase "no rows" error when using .single()
function isNoRowsError(error: unknown): boolean {
    const err = error as { code?: string } | null;
    // Supabase PostgREST typically uses this code for no rows returned with .single()
    return !!err && err.code === "PGRST116";
}

// Re-export types for convenience
export type { Category, Product, Review, GalleryItem, Quote, Query };

// ============================================
// DETECT SUPABASE
// ============================================
const IS_SUPABASE_CONFIGURED = (function () {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isConfigured = !!url &&
        url !== "https://your-project-id.supabase.co" &&
        url.includes(".supabase.co");

    return isConfigured;
})();

async function getSupabaseClient() {
    if (typeof window === "undefined") {
        const { createServerClient } = await import("@/lib/supabase/server");
        return createServerClient();
    } else {
        const { createClient } = await import("@/lib/supabase/client");
        return createClient();
    }
}

// singleton client to avoid multiple dynamic imports
let _supabaseClient: any = null;
async function getSupabase() {
    if (_supabaseClient) return _supabaseClient;
    _supabaseClient = await getSupabaseClient();
    return _supabaseClient;
}

// ============================================
// LOCAL JSON FALLBACK DATA (Lazy Loaded)
// ============================================
async function getLocalData() {
    const [productsJson, categoriesJson, reviewsJson, galleryJson] = await Promise.all([
        import("@/data/products.json").then(m => m.default),
        import("@/data/categories.json").then(m => m.default),
        import("@/data/reviews.json").then(m => m.default),
        import("@/data/gallery.json").then(m => m.default)
    ]);

    return {
        products: (productsJson as Record<string, unknown>[]).map(mapLocalProduct),
        categories: (categoriesJson as Record<string, unknown>[]).map(mapLocalCategory),
        reviews: (reviewsJson as Record<string, unknown>[]).map(mapLocalReview),
        gallery: (galleryJson as Record<string, unknown>[]).map(mapLocalGallery)
    };
}

function mapLocalProduct(p: Record<string, unknown>): Product {
    return {
        id: p.id as string,
        slug: p.slug as string,
        category_id: p.categoryId as string,
        name: p.name as string,
        short_description: p.shortDescription as string,
        description: p.description as string,
        specifications: p.specifications as { label: string; value: string }[],
        materials: p.materials as string[],
        image: p.image as string,
        gallery: p.gallery as string[],
        featured: p.featured as boolean,
        price: p.price as number | null,
        sort_order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}

function mapLocalCategory(c: Record<string, unknown>): Category {
    return {
        id: c.id as string,
        slug: c.slug as string,
        name: c.name as string,
        description: c.description as string,
        image: c.image as string,
        icon: c.icon as string,
        sort_order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}

function mapLocalReview(r: Record<string, unknown>): Review {
    return {
        id: r.id as string,
        name: r.name as string,
        company: r.company as string,
        rating: r.rating as number,
        text: r.text as string,
        photo: r.photo as string | null,
        video: r.video as string | null,
        audio: r.audio as string | null,
        status: r.status as "pending" | "approved" | "rejected",
        created_at: r.createdAt as string,
        updated_at: r.createdAt as string,
    };
}

function mapLocalGallery(g: Record<string, unknown>): GalleryItem {
    return {
        id: g.id as string,
        title: g.title as string,
        category: g.category as string,
        type: g.type as "image" | "video",
        src: g.src as string,
        thumbnail: g.thumbnail as string,
        sort_order: 0,
        created_at: new Date().toISOString(),
    };
}

// ============================================
// PUBLIC DATA FETCHERS (used by pages)
// ============================================

export async function getCategories(): Promise<Category[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("sort_order");
        if (error) throw error;
        return data || [];
    }
    const local = await getLocalData();
    return local.categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    if (IS_SUPABASE_CONFIGURED) {
        try {
            const supabase = await getSupabase();
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) {
                console.warn("Failed to fetch category by slug:", error);
                // True not-found
                if (isNoRowsError(error)) {
                    return null;
                }
                // Any other DB / RLS / network issue - fall back to local data
                const local = await getLocalData();
                return local.categories.find((c) => c.slug === slug) || null;
            }

            return data;
        } catch (err) {
            console.warn("Error fetching category by slug, falling back to local:", err);
            // Fallback to local data on any error
            const local = await getLocalData();
            return local.categories.find((c) => c.slug === slug) || null;
        }
    }
    const local = await getLocalData();
    return local.categories.find((c) => c.slug === slug) || null;
}

export async function getProducts(): Promise<Product[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("sort_order");
        if (error) throw error;
        return data || [];
    }
    const local = await getLocalData();
    return local.products;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("products")
            .select("id, name, slug, image, price, short_description, category_id, featured")
            .eq("category_id", categoryId)
            .order("sort_order");
        if (error) throw error;
        return (data as unknown as Product[]) || [];
    }
    const local = await getLocalData();
    return local.products.filter((p) => p.category_id === categoryId);
}

export async function getProductsByCategorySlug(slug: string): Promise<Product[]> {
    if (IS_SUPABASE_CONFIGURED) {
        try {
            const supabase = await getSupabase();

            // Resolve category id from slug first
            const { data: category, error: catError } = await supabase
                .from("categories")
                .select("id")
                .eq("slug", slug)
                .single();

            if (catError) {
                console.warn("Failed to fetch category for products:", catError);
                if (isNoRowsError(catError)) {
                    // Category truly does not exist
                    return [];
                }
                // Any other error - fall back to local data
                const local = await getLocalData();
                const cat = local.categories.find((c) => c.slug === slug);
                if (!cat) return [];
                return local.products.filter((p) => p.category_id === cat.id);
            }

            const { data: products, error: prodError } = await supabase
                .from("products")
                .select("*")
                .eq("category_id", category.id)
                .order("sort_order");

            if (prodError) {
                console.warn("Failed to fetch products for category:", prodError);
                // Fallback to local data
                const local = await getLocalData();
                return local.products.filter((p) => p.category_id === category.id);
            }

            return (products as Product[]) || [];
        } catch (err) {
            console.warn("Error fetching products by category, falling back to local:", err);
            // Fallback to local data on any error
            const local = await getLocalData();
            const cat = local.categories.find((c) => c.slug === slug);
            if (!cat) return [];
            return local.products.filter((p) => p.category_id === cat.id);
        }
    }

    const local = await getLocalData();
    const category = local.categories.find((c) => c.slug === slug);
    if (!category) return [];
    return local.products.filter((p) => p.category_id === category.id);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("slug", slug)
            .single();
        if (error) return null;
        return data;
    }
    const local = await getLocalData();
    return local.products.find((p) => p.slug === slug) || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("products")
            .select("id, name, slug, image, price, short_description")
            .eq("featured", true)
            .order("sort_order")
            .limit(8);
        if (error) throw error;
        return (data as unknown as Product[]) || [];
    }
    const local = await getLocalData();
    return local.products.filter((p) => p.featured).slice(0, 8);
}

export async function getRelatedProducts(
    productId: string,
    categoryId: string,
    limit = 4
): Promise<Product[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("category_id", categoryId)
            .neq("id", productId)
            .order("sort_order")
            .limit(limit);
        if (error) throw error;
        return data || [];
    }
    const local = await getLocalData();
    return local.products
        .filter((p) => p.category_id === categoryId && p.id !== productId)
        .slice(0, limit);
}

export async function getApprovedReviews(): Promise<Review[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("status", "approved")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
    }
    const local = await getLocalData();
    return local.reviews.filter((r) => r.status === "approved");
}

export async function getAllReviews(): Promise<Review[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const { createServerClient } = await import("@/lib/supabase/server");
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
    }
    const local = await getLocalData();
    return local.reviews;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("gallery")
            .select("id, title, category, type, src, thumbnail")
            .order("sort_order");
        if (error) throw error;
        return (data as unknown as GalleryItem[]) || [];
    }
    const local = await getLocalData();
    return local.gallery;
}

export async function getQuotes(): Promise<Quote[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("quotes")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
    }
    return [];
}

export async function getQueries(): Promise<Query[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("queries")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
    }
    return [];
}

export async function getAdminReviews(): Promise<Review[]> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
    }
    return [];
}

export async function getSettings(): Promise<Record<string, unknown>> {
    if (IS_SUPABASE_CONFIGURED) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase.from("settings").select("*");
        if (error) {
            console.warn("Failed to fetch settings:", error);
            return {};
        }

        // Convert array to object
        return (data || []).reduce((acc: Record<string, unknown>, item: { key: string; value: unknown }) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
    }
    return {};
}

// ============================================
// MUTATION FUNCTIONS (used by admin & forms)
// ============================================

export async function submitReview(review: {
    name: string;
    company?: string;
    rating: number;
    text: string;
    photo?: string;
    video?: string;
    audio?: string;
}): Promise<{ success: boolean; error?: string }> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { error } = await supabase.from("reviews").insert({
            name: review.name,
            company: review.company || null,
            rating: review.rating,
            text: review.text,
            photo: review.photo || null,
            video: review.video || null,
            audio: review.audio || null,
            status: "pending", // Always pending — admin must approve
        });
        if (error) {
            console.error("submitReview error:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    }
    // Fallback: just return success (no persistence without Supabase)
    return { success: true };
}

export async function submitQuote(quote: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    product?: string;
    quantity?: string;
    artworkUrl?: string;
    deliveryAddress?: string;
    timeline?: string;
    message?: string;
}): Promise<{ success: boolean; error?: string }> {
    if (IS_SUPABASE_CONFIGURED) {
        const supabase = await getSupabase();
        const { error } = await supabase.from("quotes").insert({
            name: quote.name,
            company: quote.company || null,
            email: quote.email,
            phone: quote.phone,
            product: quote.product || null,
            quantity: quote.quantity || null,
            artwork_url: quote.artworkUrl || null,
            delivery_address: quote.deliveryAddress || null,
            timeline: quote.timeline || null,
            message: quote.message || null,
            status: "new",
        });
        if (error) {
            console.error("submitQuote error:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    }
    return { success: true };
}
