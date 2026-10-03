"use client";

import { useTheme } from "@/context/ThemeContext";
import { MacOSTheme } from "@/features/portfolio/components/themes/macos/macos-theme";
import { ModernTheme } from "@/features/portfolio/components/themes/modern/modern-theme";
import { PortfolioData } from "@/types/portfolio";

export default function PortfolioApp({ data }: { data: PortfolioData }) {
    return <PortfolioContent data={data} />;
}

function PortfolioContent({ data }: { data: PortfolioData }) {
    const { theme } = useTheme();

    return (
        <>
            {(!theme || theme === "macos") && <MacOSTheme data={data} />}
            {theme === "modern" && <ModernTheme data={data} />}
        </>
    );
}
