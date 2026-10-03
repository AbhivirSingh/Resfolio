"use client";

import React from "react";
import WindowControls from "../components/WindowControls";
import WindowWrapper from "../hoc/WindowWrapper";
import { ChevronLeft, ChevronRight, Copy, PanelLeft, Plus, Search, ShieldHalf, Share } from "lucide-react";

interface SafariProps {
    blogPosts?: { id: number | string; date: string; title: string; image?: string; link?: string }[];
}

const Safari: React.FC<SafariProps> = ({ blogPosts = [] }) => {
    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400 flex-shrink-0"
            >
                <WindowControls target="safari" />
                <PanelLeft className="ml-10 icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                <div className="flex items-center gap-1 ml-5">
                    <ChevronLeft className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                    <ChevronRight className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 flex items-center justify-center gap-3">
                    <ShieldHalf className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                    <div className="search flex items-center gap-3 w-2/3 bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm">
                        <Search className="icon p-1 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            defaultValue="https://portfolio.me/articles-and-achievements"
                            readOnly
                            className="flex-1 text-xs text-gray-700 bg-transparent outline-none truncate"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Share className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                    <Plus className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                    <Copy className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                </div>
            </div>
            <div className="blog bg-white p-8 max-w-3xl mx-auto flex-1 min-h-0 overflow-y-auto w-full">
                <h2 className="text-xl font-bold text-pink-600 mb-8 border-b border-gray-100 pb-3">
                    Highlights & Achievements
                </h2>
                <div className="space-y-6">
                    {blogPosts.map(({ id, title, date }) => (
                        <div
                            className="blog-post flex gap-5 p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all"
                            key={id}
                        >
                            <div className="content flex-1 space-y-1">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600">
                                    {date}
                                </span>
                                <h3 className="font-semibold text-base text-gray-800 pt-1">{title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SafariWindow = WindowWrapper(Safari, "safari");
export default SafariWindow;
