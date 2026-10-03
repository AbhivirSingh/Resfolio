"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIOSStore } from "../store/useIOSStore";
import { AdaptedMacData } from "../../constants/adapter";
import {
    Sparkles,
    FileText,
    Mail,
    Check,
    X,
} from "lucide-react";

interface DynamicIslandProps {
    data: AdaptedMacData;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ data }) => {
    const {
        dynamicIslandExpanded,
        setDynamicIslandExpanded,
        toggleDynamicIsland,
        notification,
        clearNotification,
        openApp,
        notify,
    } = useIOSStore();

    const [copied, setCopied] = React.useState(false);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.email) {
            navigator.clipboard.writeText(data.email);
            setCopied(true);
            notify("Email Copied!", data.email, "mail", 2500);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleOpenResume = (e: React.MouseEvent) => {
        e.stopPropagation();
        openApp("resume");
        notify("Viewing Resume", "PDF Document", "file", 2000);
    };

    const handleOpenContact = (e: React.MouseEvent) => {
        e.stopPropagation();
        openApp("contact");
    };

    return (
        <>
            {/* Click outside backdrop when expanded */}
            {dynamicIslandExpanded && (
                <div
                    className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1.5px]"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDynamicIslandExpanded(false);
                    }}
                />
            )}

            <div className="relative flex justify-center items-start z-50 pointer-events-auto">
                <motion.div
                    layout
                    onClick={() => {
                        if (notification) {
                            clearNotification();
                        } else {
                            toggleDynamicIsland();
                        }
                    }}
                    className={`bg-black text-white cursor-pointer select-none overflow-hidden shadow-2xl flex items-center justify-between transition-all duration-300 mx-auto ${
                        dynamicIslandExpanded
                            ? "rounded-[36px] p-4 w-[92vw] max-w-[360px] border border-white/15 ring-1 ring-white/10"
                            : notification
                            ? "rounded-full px-3 py-1.5 w-auto min-w-[210px] max-w-[320px] border border-white/15"
                            : "rounded-full px-3.5 py-1.5 w-[124px] h-[34px] border border-white/10"
                    }`}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                    }}
                >
                    <AnimatePresence mode="wait">
                        {/* EXPANDED VIEW */}
                        {dynamicIslandExpanded ? (
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="w-full flex flex-col gap-3"
                            >
                                {/* Top row: Avatar, Info, Close */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={data.image || "/icons/user.svg"}
                                                alt={data.name}
                                                className="w-10 h-10 rounded-full object-cover border border-white/20 bg-zinc-800"
                                            />
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-black" />
                                        </div>
                                        <div className="flex flex-col text-left min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-sm text-white truncate">
                                                    {data.fullName || data.name}
                                                </span>
                                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-emerald-500/20 text-emerald-400 rounded-full flex-shrink-0">
                                                    Available
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 truncate">
                                                {data.title}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDynamicIslandExpanded(false);
                                        }}
                                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 transition-colors flex-shrink-0"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>

                                {/* Quick Action Grid */}
                                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={handleOpenResume}
                                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-xs font-medium text-gray-200 gap-1"
                                    >
                                        <FileText size={16} className="text-blue-400" />
                                        <span>Resume</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCopyEmail}
                                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-xs font-medium text-gray-200 gap-1"
                                    >
                                        {copied ? (
                                            <Check size={16} className="text-emerald-400" />
                                        ) : (
                                            <Mail size={16} className="text-pink-400" />
                                        )}
                                        <span>{copied ? "Copied!" : "Email"}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleOpenContact}
                                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-xs font-medium text-gray-200 gap-1"
                                    >
                                        <Sparkles size={16} className="text-amber-400" />
                                        <span>Contact</span>
                                    </button>
                                </div>
                            </motion.div>
                        ) : notification ? (
                            /* NOTIFICATION MODE */
                            <motion.div
                                key="notification"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full flex items-center justify-between gap-2.5"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                                        {notification.icon === "mail" ? (
                                            <Mail size={13} />
                                        ) : notification.icon === "file" ? (
                                            <FileText size={13} />
                                        ) : (
                                            <Sparkles size={13} />
                                        )}
                                    </div>
                                    <div className="flex flex-col text-left min-w-0">
                                        <span className="text-xs font-medium text-white truncate">
                                            {notification.title}
                                        </span>
                                        {notification.subtitle && (
                                            <span className="text-[10px] text-gray-400 truncate max-w-[180px]">
                                                {notification.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center flex-shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                </div>
                            </motion.div>
                        ) : (
                            /* DEFAULT COMPACT MODE */
                            <motion.div
                                key="compact"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full flex items-center justify-between px-1"
                            >
                                {/* Left indicator: green pulse */}
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    <span className="text-[11px] font-medium text-gray-300">Live</span>
                                </div>

                                {/* Center sensor pill simulation */}
                                <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />

                                {/* Right indicator: Audio visualizer bars */}
                                <div className="flex items-end gap-0.5 h-3">
                                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[pulse_1s_ease-in-out_infinite] h-2" />
                                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[pulse_1.4s_ease-in-out_infinite] h-3" />
                                    <span className="w-0.5 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-1.5" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    );
};

export default DynamicIsland;
