import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in Server Components, API Routes,
 * and Server Actions. Uses the service_role key to bypass RLS.
 * 
 * ⚠️ NEVER expose this client to the browser!
 */
export function createServerClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
