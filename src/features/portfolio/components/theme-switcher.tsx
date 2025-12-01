"use client";

import { useTheme } from "@/context/ThemeContext";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-white/80 p-2 rounded-full shadow-lg backdrop-blur-sm border border-gray-200">
            <button
                onClick={() => setTheme("minimalist")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "minimalist"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-600"
                    }`}
            >
                Minimalist
            </button>
            <button
                onClick={() => setTheme("creative")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "creative"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-50 text-gray-600"
                    }`}
            >
                Creative
            </button>
            <button
                onClick={() => setTheme("professional")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "professional"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 text-gray-600"
                    }`}
            >
                Professional
            </button>
            <button
                onClick={() => setTheme("modern")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === "modern"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 text-gray-600"
                    }`}
            >
                Modern
            </button>
        </div>
    );
}
