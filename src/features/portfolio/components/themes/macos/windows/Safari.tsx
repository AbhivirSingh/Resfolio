"use client";

import React, { useState, useMemo } from "react";
import WindowControls from "../components/WindowControls";
import WindowWrapper from "../hoc/WindowWrapper";
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    PanelLeft,
    Plus,
    Search,
    ShieldHalf,
    Share,
    ExternalLink,
    Award,
    BookOpen,
    FileBadge,
    Sparkles,
    Check,
} from "lucide-react";

export interface SafariItem {
    id: number | string;
    date: string;
    title: string;
    summary?: string;
    link?: string;
    type?: "publication" | "achievement" | "certification" | "custom" | "extracurricular" | string;
}

interface SafariProps {
    blogPosts?: SafariItem[];
}

const Safari: React.FC<SafariProps> = ({ blogPosts = [] }) => {
    const [copiedUrl, setCopiedUrl] = useState(false);

    // Available tabs based on what data actually exists
    const availableTypes = useMemo(() => {
        const types = new Set<string>();
        blogPosts.forEach((post) => {
            if (post.type) types.add(post.type);
        });
        return Array.from(types);
    }, [blogPosts]);

    const [activeTab, setActiveTab] = useState<string>("all");

    const filteredItems = useMemo(() => {
        if (activeTab === "all") return blogPosts;
        return blogPosts.filter((item) => item.type === activeTab);
    }, [blogPosts, activeTab]);

    const currentUrl = `https://portfolio.me/${activeTab === "all" ? "articles-and-highlights" : activeTab}`;

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    const getTypeIcon = (type?: string) => {
        switch (type) {
            case "publication":
                return <BookOpen size={16} className="text-purple-600" />;
            case "certification":
                return <FileBadge size={16} className="text-blue-600" />;
            case "achievement":
                return <Award size={16} className="text-amber-500" />;
            case "custom":
                return <Sparkles size={16} className="text-pink-500" />;
            default:
                return <Award size={16} className="text-pink-600" />;
        }
    };

    const getTypeBadgeClass = (type?: string) => {
        switch (type) {
            case "publication":
                return "bg-purple-50 text-purple-700 border-purple-200/60";
            case "certification":
                return "bg-blue-50 text-blue-700 border-blue-200/60";
            case "achievement":
                return "bg-amber-50 text-amber-700 border-amber-200/60";
            case "custom":
                return "bg-pink-50 text-pink-700 border-pink-200/60";
            default:
                return "bg-pink-50 text-pink-600 border-pink-200/60";
        }
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            {/* macOS Safari Header */}
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400 flex-shrink-0"
            >
                <WindowControls target="safari" />
                <PanelLeft className="ml-8 icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                <div className="flex items-center gap-1 ml-4">
                    <ChevronLeft className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                    <ChevronRight className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 flex items-center justify-center gap-3">
                    <ShieldHalf className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                    <div className="search flex items-center gap-2.5 w-3/4 max-w-md bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-xs">
                        <Search className="text-gray-400 w-3.5 h-3.5 flex-shrink-0" />
                        <input
                            type="text"
                            value={currentUrl}
                            readOnly
                            className="flex-1 text-xs text-gray-700 bg-transparent outline-none truncate"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleCopyUrl}
                        className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        title={copiedUrl ? "URL Copied!" : "Copy Page URL"}
                    >
                        {copiedUrl ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                    <Share className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                    <Plus className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
                </div>
            </div>

            {/* Safari Sub-tabs if multiple types exist */}
            {availableTypes.length > 1 && (
                <div className="bg-gray-100/80 px-6 py-2 border-b border-gray-200 flex items-center gap-2 overflow-x-auto select-none flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            activeTab === "all"
                                ? "bg-white text-gray-900 shadow-xs"
                                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        }`}
                    >
                        All ({blogPosts.length})
                    </button>
                    {availableTypes.map((type) => {
                        const count = blogPosts.filter((b) => b.type === type).length;
                        const label =
                            type === "publication"
                                ? "Publications"
                                : type === "certification"
                                ? "Certifications"
                                : type === "achievement"
                                ? "Achievements"
                                : type === "custom"
                                ? "Custom Sections"
                                : type.charAt(0).toUpperCase() + type.slice(1);

                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setActiveTab(type)}
                                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                                    activeTab === type
                                        ? "bg-white text-gray-900 shadow-xs"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                }`}
                            >
                                {label} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Content Area */}
            <div className="bg-white p-8 max-w-4xl mx-auto flex-1 min-h-0 overflow-y-auto w-full">
                <div className="mb-6 border-b border-gray-100 pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {activeTab === "all"
                                ? "Highlights, Articles & Achievements"
                                : activeTab === "publication"
                                ? "Publications & Research"
                                : activeTab === "certification"
                                ? "Certifications & Credentials"
                                : activeTab === "achievement"
                                ? "Achievements & Awards"
                                : "Custom Highlights"}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Showcasing {filteredItems.length} verified item{filteredItems.length === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                {filteredItems.length > 0 ? (
                    <div className="space-y-4">
                        {filteredItems.map((item) => (
                            <div
                                className="group p-5 rounded-2xl border border-gray-200/90 hover:border-gray-400/80 hover:shadow-md transition-all bg-white relative"
                                key={item.id}
                            >
                                <div className="flex items-start gap-3.5">
                                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 group-hover:scale-105 transition-transform flex-shrink-0 mt-0.5">
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getTypeBadgeClass(
                                                    item.type
                                                )}`}
                                            >
                                                {item.date}
                                            </span>
                                            {item.type && (
                                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                    {item.type}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-base text-gray-900 leading-snug">
                                            {item.title}
                                        </h3>

                                        {item.summary && (
                                            <p className="text-sm text-gray-600 leading-relaxed pt-0.5">
                                                {item.summary}
                                            </p>
                                        )}

                                        {item.link && (
                                            <div className="pt-2">
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    <span>Open Resource</span>
                                                    <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center text-gray-400 space-y-2">
                        <Award size={36} className="mx-auto text-gray-300" />
                        <p className="text-sm font-medium text-gray-600">No entries in this section</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const SafariWindow = WindowWrapper(Safari, "safari");
export default SafariWindow;
