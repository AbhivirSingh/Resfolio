"use client";

import React, { useEffect, useMemo } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Navbar, Welcome, Dock, Home } from "./components";
import { Terminal, Safari, Resume, Finder, Text, Image, Contact, Photos } from "./windows";
import { adaptPortfolioData } from "./constants/adapter";
import useLocationStore from "./store/location";
import { useIsMobile } from "./utils/useIsMobile";
import { IOSTheme } from "./ios/ios-theme";

export function MacOSTheme({ data }: { data: PortfolioData }) {
    const adapted = useMemo(() => adaptPortfolioData(data), [data]);
    const { resetLocation } = useLocationStore();
    const isMobile = useIsMobile(768);

    useEffect(() => {
        if (adapted.locations.work) {
            resetLocation(adapted.locations.work);
        }
    }, [adapted, resetLocation]);

    if (isMobile) {
        return <IOSTheme data={adapted} />;
    }

    return (
        <div className="macos-root w-screen h-screen overflow-hidden fixed inset-0 select-none bg-[url('/images/wallpaper.png')] bg-cover bg-no-repeat bg-center">
            <main className="w-full h-full relative overflow-hidden">
                <Navbar name={adapted.name} />
                <Welcome name={adapted.name} />
                <Home projects={adapted.projects} />
                <Terminal techStack={adapted.techStack} username={adapted.name} />
                <Safari blogPosts={adapted.blogPosts} />
                <Resume resumeUrl={adapted.resumeUrl} />
                <Finder locationsMap={adapted.locations} />
                <Photos photosList={adapted.gallery} />
                <Text />
                <Image />
                <Contact name={adapted.name} image={adapted.image} bio={adapted.bio} socials={adapted.socials} />
                <Dock />
            </main>
        </div>
    );
}

export default MacOSTheme;

