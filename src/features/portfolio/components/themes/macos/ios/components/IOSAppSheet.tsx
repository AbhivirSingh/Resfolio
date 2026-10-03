"use client";

import React from "react";
import { motion, PanInfo } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import { useIOSStore } from "../store/useIOSStore";

interface IOSAppSheetProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
    headerRight?: React.ReactNode;
    onBack?: () => void;
    backgroundColor?: string;
}

export const IOSAppSheet: React.FC<IOSAppSheetProps> = ({
    title,
    icon,
    children,
    headerRight,
    onBack,
    backgroundColor = "bg-white dark:bg-zinc-900",
}) => {
    const { closeApp } = useIOSStore();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            closeApp();
        }
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 140 || info.velocity.y > 500) {
            closeApp();
        }
    };

    return (
        <motion.div
            initial={{ y: "100%", opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className={`fixed inset-0 top-12 z-40 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden ${backgroundColor} border-t border-white/20`}
        >
            {/* Sheet Handle / Drag Indicator */}
            <div className="w-full pt-2 pb-1 flex justify-center cursor-grab active:cursor-grabbing flex-shrink-0">
                <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* iOS Navigation Header */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/80 flex-shrink-0 select-none bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-0.5 text-blue-500 active:text-blue-700 font-normal text-base -ml-1 py-1 px-2 rounded-lg active:bg-blue-50 dark:active:bg-blue-950/40 transition-colors"
                >
                    <ChevronLeft size={22} className="-mr-1 stroke-[2.5]" />
                    <span className="text-[15px] font-medium">Home</span>
                </button>

                {/* Title */}
                <div className="flex items-center gap-1.5 max-w-[200px] truncate">
                    {icon && <img src={icon} alt="" className="w-4 h-4 object-contain" />}
                    <h2 className="text-[16px] font-semibold text-gray-900 dark:text-white truncate">
                        {title}
                    </h2>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2">
                    {headerRight ? (
                        headerRight
                    ) : (
                        <button
                            type="button"
                            onClick={closeApp}
                            className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-300 active:scale-95 transition-all"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>
            </div>

            {/* App Body Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 relative">
                {children}
            </div>

            {/* Home Indicator at Bottom */}
            <div
                onClick={closeApp}
                className="w-full pb-2 pt-2 flex justify-center items-center flex-shrink-0 cursor-pointer bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
            >
                <div className="w-32 h-1 bg-gray-400 dark:bg-gray-500 rounded-full active:scale-95 transition-transform" />
            </div>
        </motion.div>
    );
};

export default IOSAppSheet;
