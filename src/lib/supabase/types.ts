/**
 * Supabase Database Type Definitions
 * 
 * These mirror the schema.sql tables. In production, generate these
 * automatically with: npx supabase gen types typescript
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string;
                    slug: string;
                    name: string;
                    description: string | null;
                    image: string | null;
                    icon: string | null;
                    sort_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "created_at" | "updated_at"> & {
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
            };
            products: {
                Row: {
                    id: string;
                    slug: string;
                    category_id: string | null;
                    name: string;
                    short_description: string | null;
                    description: string | null;
                    specifications: { label: string; value: string }[];
                    materials: string[];
                    image: string | null;
                    gallery: string[];
                    featured: boolean;
                    price: number | null;
                    sort_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "created_at" | "updated_at"> & {
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
            };
            reviews: {
                Row: {
                    id: string;
                    name: string;
                    company: string | null;
                    rating: number;
                    text: string;
                    photo: string | null;
                    video: string | null;
                    audio: string | null;
                    status: "pending" | "approved" | "rejected";
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at" | "updated_at" | "status"> & {
                    id?: string;
                    status?: "pending" | "approved" | "rejected";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
            };
            gallery: {
                Row: {
                    id: string;
                    title: string;
                    category: string;
                    type: "image" | "video";
                    src: string;
                    thumbnail: string | null;
                    sort_order: number;
                    created_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["gallery"]["Row"], "id" | "created_at"> & {
                    id?: string;
                    created_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
            };
            quotes: {
                Row: {
                    id: string;
                    name: string;
                    company: string | null;
                    email: string;
                    phone: string;
                    product: string | null;
                    quantity: string | null;
                    artwork_url: string | null;
                    delivery_address: string | null;
                    timeline: string | null;
                    message: string | null;
                    status: "new" | "contacted" | "quoted" | "closed";
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["quotes"]["Row"], "id" | "created_at" | "updated_at" | "status"> & {
                    id?: string;
                    status?: "new" | "contacted" | "quoted" | "closed";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
            };
            settings: {
                Row: {
                    key: string;
                    value: Json;
                    updated_at: string;
                };
                Insert: {
                    key: string;
                    value: Json;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
            };
            orders: {
                Row: {
                    id: string;
                    product_id: string;
                    product_name: string;
                    quantity: string;
                    delivery_address: string;
                    timeline: string;
                    specifications: string | null;
                    additional_notes: string | null;
                    user_name: string;
                    user_email: string;
                    user_phone: string;
                    status: "pending" | "contacted" | "confirmed" | "rejected";
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at" | "status"> & {
                    id?: string;
                    status?: "pending" | "contacted" | "confirmed" | "rejected";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
            };
            queries: {
                Row: {
                    id: string;
                    product_id: string | null;
                    product_name: string | null;
                    message: string;
                    user_name: string;
                    user_email: string;
                    user_phone: string;
                    status: "pending" | "contacted" | "resolved" | "rejected";
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database["public"]["Tables"]["queries"]["Row"], "id" | "created_at" | "updated_at" | "status"> & {
                    id?: string;
                    status?: "pending" | "contacted" | "resolved" | "rejected";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["queries"]["Insert"]>;
            };
        };
    };
}

// Convenience type aliases
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type GalleryItem = Database["public"]["Tables"]["gallery"]["Row"];
export type Quote = Database["public"]["Tables"]["quotes"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Query = Database["public"]["Tables"]["queries"]["Row"];
