"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const SecurityGuard = () => {
    const pathname = usePathname();

    useEffect(() => {
        // Only active on root path
        if (pathname !== "/") return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === "F12") {
                e.preventDefault();
                return;
            }

            // Ctrl+Shift+I / Cmd+Option+I (Inspect)
            // Ctrl+Shift+J / Cmd+Option+J (Console)
            // Ctrl+Shift+C / Cmd+Option+C (Element Selector)
            if (
                (e.ctrlKey || e.metaKey) &&
                e.shiftKey &&
                ["I", "J", "C", "i", "j", "c"].includes(e.key)
            ) {
                e.preventDefault();
                return;
            }

            // Ctrl+U / Cmd+Option+U (View Source)
            if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
                e.preventDefault();
                return;
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [pathname]);

    return null;
};
