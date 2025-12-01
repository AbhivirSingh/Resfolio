"use client";

import { useTheme, ThemeProvider } from "@/context/ThemeContext";
import { MinimalistTheme } from "@/features/portfolio/components/themes/minimalist/minimalist-theme";
import { CreativeTheme } from "@/features/portfolio/components/themes/creative/creative-theme";
import { ProfessionalTheme } from "@/features/portfolio/components/themes/professional/professional-theme";
import { ModernTheme } from "@/features/portfolio/components/themes/modern/modern-theme";
import { PortfolioData } from "@/types/portfolio";

export default function PortfolioApp({ data }: { data: PortfolioData }) {
    return <PortfolioContent data={data} />;
}

function PortfolioContent({ data }: { data: PortfolioData }) {
    const { theme } = useTheme();

    return (
        <>
            {theme === "minimalist" && <MinimalistTheme data={data} />}
            {theme === "creative" && <CreativeTheme data={data} />}
            {theme === "professional" && <ProfessionalTheme data={data} />}
            {theme === "modern" && <ModernTheme data={data} />}
        </>
    );
}
