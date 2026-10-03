"use client";

import React, { useEffect } from "react";
import { AdaptedMacData } from "../constants/adapter";
import { useIOSStore } from "./store/useIOSStore";
import { IOSStatusBar } from "./components/IOSStatusBar";
import { IOSHomeScreen } from "./components/IOSHomeScreen";
import { IOSControlCenter } from "./components/IOSControlCenter";
import { AnimatePresence } from "framer-motion";

// Apps
import { IOSProjectsApp } from "./apps/IOSProjectsApp";
import { IOSSkillsApp } from "./apps/IOSSkillsApp";
import { IOSSafariApp } from "./apps/IOSSafariApp";
import { IOSPhotosApp } from "./apps/IOSPhotosApp";
import { IOSContactApp } from "./apps/IOSContactApp";
import { IOSResumeApp } from "./apps/IOSResumeApp";
import { IOSAboutApp } from "./apps/IOSAboutApp";
import { IOSTrashApp } from "./apps/IOSTrashApp";

interface IOSThemeProps {
    data: AdaptedMacData;
}

export const IOSTheme: React.FC<IOSThemeProps> = ({ data }) => {
    const { activeApp, notify } = useIOSStore();

    // Context-aware Dynamic Island greeting on initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            notify(`Welcome to ${data.firstName}'s iOS Portfolio`, "Tap anywhere to explore", "sparkles", 3500);
        }, 800);
        return () => clearTimeout(timer);
    }, [data.firstName, notify]);

    return (
        <div className="ios-root w-screen h-[100dvh] overflow-hidden fixed inset-0 select-none bg-[url('/images/wallpaper.png')] bg-cover bg-no-repeat bg-center flex flex-col justify-between">
            {/* Ambient blur backdrop layer */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] pointer-events-none" />

            {/* iOS Status Bar + Dynamic Island */}
            <IOSStatusBar data={data} />

            {/* iOS Home Screen */}
            <IOSHomeScreen data={data} />

            {/* Control Center Overlay */}
            <IOSControlCenter data={data} />

            {/* Active App Modal Sheet */}
            <AnimatePresence mode="wait">
                {activeApp === "projects" && <IOSProjectsApp key="projects" data={data} />}
                {activeApp === "skills" && <IOSSkillsApp key="skills" data={data} />}
                {activeApp === "safari" && <IOSSafariApp key="safari" data={data} />}
                {activeApp === "photos" && <IOSPhotosApp key="photos" photosList={data.gallery} />}
                {activeApp === "contact" && <IOSContactApp key="contact" data={data} />}
                {activeApp === "resume" && <IOSResumeApp key="resume" resumeUrl={data.resumeUrl} />}
                {activeApp === "about" && <IOSAboutApp key="about" data={data} />}
                {activeApp === "trash" && <IOSTrashApp key="trash" />}
            </AnimatePresence>
        </div>
    );
};

export default IOSTheme;
