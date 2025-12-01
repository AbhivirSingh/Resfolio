"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "minimalist" | "creative" | "professional" | "modern";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme }: { children: React.ReactNode, initialTheme: Theme }) {
    const [theme, setThemeState] = useState<Theme>(initialTheme);

    const setTheme = (newTheme: Theme) => {
        // Optimistic update
        setThemeState(newTheme);

        // Persist to data.json
        fetch("/api/update-theme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme: newTheme })
        }).catch(err => console.error("Failed to persist theme:", err));
    };

    // Sync with initialTheme if it changes (e.g. after revalidation)
    useEffect(() => {
        if (initialTheme) {
            setThemeState(initialTheme);
        }
    }, [initialTheme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
