"use client";

import React from "react";
import { IOSAppSheet } from "../components/IOSAppSheet";
import { AdaptedMacData } from "../../constants/adapter";
import {
    GraduationCap,
    Sparkles,
} from "lucide-react";

interface IOSAboutAppProps {
    data: AdaptedMacData;
}

export const IOSAboutApp: React.FC<IOSAboutAppProps> = ({ data }) => {
    return (
        <IOSAppSheet title="About Me" icon="/icons/info.svg">
            <div className="p-4 space-y-4 max-w-lg mx-auto pb-12">
                {/* Hero profile banner */}
                <div className="p-5 rounded-[26px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-950/40 dark:to-purple-950/40 border border-blue-200/40 dark:border-blue-800/30 flex items-center gap-4">
                    <img
                        src={data.image || "/icons/user.svg"}
                        alt={data.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-md border border-white dark:border-zinc-700 bg-white/20"
                    />
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {data.fullName || data.name}
                        </h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {data.title}
                        </p>
                    </div>
                </div>

                {/* Bio text */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Background & Overview</span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {data.bio}
                    </p>
                </div>

                {/* Education / Credentials */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <GraduationCap size={15} className="text-blue-500" />
                        <span>Education & Degrees</span>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                            Rajiv Gandhi Institute of Petroleum Technology (RGIPT)
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Integrated Dual Degree: BTech in CSE + MTech in AI
                        </p>
                    </div>
                </div>
            </div>
        </IOSAppSheet>
    );
};

export default IOSAboutApp;
