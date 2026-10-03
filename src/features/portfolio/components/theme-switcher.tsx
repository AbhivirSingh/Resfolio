"use client";

import { useTheme } from "@/context/ThemeContext";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex gap-2 bg-white/80 p-2 rounded-full shadow-lg backdrop-blur-sm border border-gray-200">
            <button
                onClick={() => setTheme("macos")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "macos" || !theme
                    ? "bg-black text-white shadow-sm"
                    : "hover:bg-gray-100 text-gray-600"
                    }`}
            >
                macOS
            </button>
            <button
                onClick={() => setTheme("modern")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "modern"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "hover:bg-blue-50 text-gray-600"
                    }`}
            >
                Modern
            </button>
        </div>
    );
}
