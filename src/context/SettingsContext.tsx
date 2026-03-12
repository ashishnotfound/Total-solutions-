"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSettings } from "@/lib/data";
import { SITE } from "@/lib/constants";

interface SettingsContextType {
    settings: Record<string, unknown>;
    loading: boolean;
    refetch: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: {},
    loading: true,
    refetch: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Record<string, unknown>>({});
    const [loading, setLoading] = useState(true);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (fetched) return;
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch settings, falling back to defaults:", error);
                // Graceful fallback to static constants if settings fail
                setSettings({
                    company_name: SITE.name,
                    logo: "",
                    phone: SITE.phones[0],
                    email: SITE.email,
                    address: SITE.addresses.office.line1 + ", " + SITE.addresses.office.line2,
                });
            } finally {
                setLoading(false);
                setFetched(true);
            }
        };

        fetchSettings();
    }, [fetched]);

    const refetchSettings = async () => {
        setFetched(false);
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
        setLoading(false);
        setFetched(true);
        
        // Force re-render by updating a timestamp
        setSettings(prev => ({ ...prev, _updated: Date.now() }));
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, refetch: refetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}
