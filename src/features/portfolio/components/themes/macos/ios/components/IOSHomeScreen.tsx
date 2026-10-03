"use client";

import React from "react";
import { AdaptedMacData } from "../../constants/adapter";
import { useIOSStore } from "../store/useIOSStore";
import { IOSAppId } from "../types";
import {
    Folder,
    ArrowUpRight,
    GraduationCap,
    LucideIcon,
} from "lucide-react";

interface IOSHomeScreenProps {
    data: AdaptedMacData;
}

interface AppIconConfig {
    id: IOSAppId;
    name: string;
    icon: string;
    badge?: string | number;
    bgGradient?: string;
    isLucide?: boolean;
    LucideIcon?: LucideIcon;
}

export const IOSHomeScreen: React.FC<IOSHomeScreenProps> = ({ data }) => {
    const { openApp } = useIOSStore();

    const appIcons: AppIconConfig[] = [
        {
            id: "projects",
            name: "Projects",
            icon: "/images/folder.png",
            badge: data.projects?.length || 5,
        },
        {
            id: "skills",
            name: "Skills",
            icon: "/images/terminal.png",
            badge: "AI/ML",
        },
        {
            id: "safari",
            name: "Articles",
            icon: "/images/safari.png",
            badge: data.blogPosts?.length || 3,
        },
        {
            id: "photos",
            name: "Gallery",
            icon: "/images/photos.png",
            badge: 4,
        },
        {
            id: "about",
            name: "About Me",
            icon: "/icons/info.svg",
        },
        {
            id: "resume",
            name: "Resume",
            icon: "/images/pdf.png",
        },
        {
            id: "contact",
            name: "Contact",
            icon: "/images/contact.png",
        },
        {
            id: "trash",
            name: "Bin",
            icon: "/images/trash.png",
        },
    ];

    const dockApps: AppIconConfig[] = [
        {
            id: "contact",
            name: "Phone",
            icon: "/images/contact.png",
        },
        {
            id: "safari",
            name: "Safari",
            icon: "/images/safari.png",
        },
        {
            id: "projects",
            name: "Files",
            icon: "/images/folder.png",
        },
        {
            id: "resume",
            name: "Resume",
            icon: "/images/pdf.png",
        },
    ];

    const featuredProject = data.projects?.[0];

    return (
        <div className="flex-1 flex flex-col justify-between px-5 pt-2 pb-4 select-none overflow-y-auto no-scrollbar">
            {/* TOP WIDGETS SECTION */}
            <div className="space-y-3 pt-1">
                {/* Profile Hero iOS Widget (Medium 2x4) */}
                <div
                    onClick={() => openApp("about")}
                    className="p-4 rounded-[28px] bg-white/20 dark:bg-black/35 backdrop-blur-xl border border-white/25 shadow-xl text-white cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden group"
                >
                    {/* Subtle gloss overlay */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-[28px]" />

                    <div className="flex items-center gap-3.5 relative z-10">
                        <div className="relative flex-shrink-0">
                            <img
                                src={data.image || "/icons/user.svg"}
                                alt={data.name}
                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/40 shadow-md bg-white/20"
                            />
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-black" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-bold text-white truncate drop-shadow-sm">
                                    {data.fullName || data.name}
                                </h2>
                                <ArrowUpRight size={16} className="text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                            <p className="text-xs text-white/80 line-clamp-1 font-medium mt-0.5">
                                {data.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium text-white">
                                    <GraduationCap size={10} /> RGIPT '26
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-medium">
                                    BTech + MTech
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Project Widget (if available) */}
                {featuredProject && (
                    <div
                        onClick={() => openApp("projects")}
                        className="p-3.5 rounded-[24px] bg-white/15 dark:bg-black/30 backdrop-blur-xl border border-white/20 shadow-lg text-white cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-xl bg-blue-500/30 text-blue-300 flex-shrink-0">
                                <Folder size={18} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] uppercase font-semibold text-blue-300">Spotlight Project</span>
                                </div>
                                <h3 className="text-xs font-semibold text-white truncate">
                                    {featuredProject.name}
                                </h3>
                            </div>
                        </div>
                        <span className="text-[11px] font-medium text-white/80 bg-white/10 px-2.5 py-1 rounded-full flex-shrink-0">
                            Explore →
                        </span>
                    </div>
                )}
            </div>

            {/* APP ICONS 4-COLUMN GRID */}
            <div className="py-4 my-auto">
                <div className="grid grid-cols-4 gap-y-5 gap-x-4">
                    {appIcons.map((app) => (
                        <div
                            key={app.id}
                            onClick={() => openApp(app.id)}
                            className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform group select-none"
                        >
                            {/* iOS Squircle Icon Container */}
                            <div className="relative w-15 h-15 rounded-[22%] bg-white/90 dark:bg-zinc-900 shadow-lg flex items-center justify-center overflow-hidden border border-white/30 group-active:brightness-90 transition-all">
                                <img
                                    src={app.icon}
                                    alt={app.name}
                                    className="w-full h-full object-cover p-1.5"
                                />

                                {/* Badge */}
                                {app.badge && (
                                    <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold text-[9px] shadow-sm">
                                        {app.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span className="text-[11px] font-medium text-white tracking-tight drop-shadow-md text-center line-clamp-1">
                                {app.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* PAGE DOTS INDICATOR */}
            <div className="flex justify-center items-center gap-1.5 py-1">
                <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>

            {/* FROSTED GLASS DOCK */}
            <div className="p-2.5 rounded-[34px] bg-white/25 dark:bg-black/40 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-around my-1">
                {dockApps.map((app) => (
                    <div
                        key={`dock-${app.id}`}
                        onClick={() => openApp(app.id)}
                        className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform group"
                    >
                        <div className="w-14 h-14 rounded-[22%] bg-white/90 dark:bg-zinc-900 shadow-md flex items-center justify-center overflow-hidden border border-white/30">
                            <img
                                src={app.icon}
                                alt={app.name}
                                className="w-full h-full object-cover p-1.5"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* HOME INDICATOR */}
            <div className="pt-2 pb-1 flex justify-center">
                <div className="w-36 h-1.5 bg-white/80 rounded-full shadow-sm" />
            </div>
        </div>
    );
};

export default IOSHomeScreen;
