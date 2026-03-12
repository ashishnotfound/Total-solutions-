import { createClient } from "./client";


export async function getCurrentUser() {
    const supabase = createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
}

export async function getProfileByUserId(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
}

export async function isAdmin(): Promise<boolean> {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        const profile = await getProfileByUserId(user.id);
        return profile?.role === "admin";
    } catch {
        return false;
    }
}

export async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function signIn(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signUp(email: string, password: string, fullName?: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName || "",
            },
        },
    });
    if (error) throw error;
    return data;
}
