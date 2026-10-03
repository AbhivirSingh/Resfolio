"use client";

import React from "react";
import { IOSAppSheet } from "../components/IOSAppSheet";
import { AdaptedMacData } from "../../constants/adapter";
import {
    Lock,
    RotateCw,
    Share2,
    Award,
    Calendar,
} from "lucide-react";
import { useIOSStore } from "../store/useIOSStore";

interface IOSSafariAppProps {
    data: AdaptedMacData;
}

export const IOSSafariApp: React.FC<IOSSafariAppProps> = ({ data }) => {
    const { notify } = useIOSStore();

    const handleShare = () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({
                title: `${data.name}'s Achievements & Highlights`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            notify("Link Ready", "Achievements URL copied", "sparkles");
        }
    };

    return (
        <IOSAppSheet
            title="Safari"
            icon="/images/safari.png"
            headerRight={
                <button
                    type="button"
                    onClick={handleShare}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-blue-500 active:scale-95 transition-all"
                >
                    <Share2 size={16} />
                </button>
            }
        >
            <div className="p-4 space-y-4 max-w-lg mx-auto pb-12">
                {/* Safari Search / URL pill */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded-2xl shadow-inner border border-gray-200/50 dark:border-zinc-700/50">
                    <Lock size={12} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
                        abhivir.portfolio.me/articles-and-achievements
                    </span>
                    <RotateCw size={12} className="text-gray-400" />
                </div>

                {/* Main Content Area */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Award size={16} className="text-pink-500" />
                            <span>Highlights & Recognitions</span>
                        </h3>
                        <span className="text-xs text-gray-400">{data.blogPosts.length} entries</span>
                    </div>

                    <div className="space-y-3">
                        {data.blogPosts.map((post) => (
                            <div
                                key={post.id}
                                className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700/60 shadow-sm space-y-2 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 text-[11px] font-semibold">
                                        <Calendar size={10} />
                                        {post.date}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-snug">
                                    {post.title}
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </IOSAppSheet>
    );
};

export default IOSSafariApp;
