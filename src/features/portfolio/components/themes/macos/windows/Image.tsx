"use client";

import React, { useState, useEffect } from "react";
import { WindowControls } from "../components";
import WindowWrapper from "../hoc/WindowWrapper";
import useWindowStore from "../store/window";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const ImageWindowContent: React.FC = () => {
    const { windows } = useWindowStore();
    const data = windows.imgfile?.data;
    const isOpen = !!windows.imgfile?.isOpen;

    const photosList = data?.photosList || [];
    const initialIndex = typeof data?.currentIndex === "number" ? data.currentIndex : 0;
    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

    useEffect(() => {
        if (typeof data?.currentIndex === "number") {
            setCurrentIndex(data.currentIndex);
        }
    }, [data?.currentIndex, data?.imageUrl]);

    const hasMultiple = photosList.length > 1;
    const currentItem = hasMultiple && photosList[currentIndex] ? photosList[currentIndex] : null;
    const currentImageUrl = currentItem?.img || data?.imageUrl || "";
    const currentTitle = currentItem?.title || data?.name || "Photo Preview";

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!hasMultiple) return;
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photosList.length - 1));
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!hasMultiple) return;
        setCurrentIndex((prev) => (prev < photosList.length - 1 ? prev + 1 : 0));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, hasMultiple, photosList.length]);

    if (!data) return null;

    return (
        <div className="flex flex-col h-full bg-white select-none overflow-hidden rounded-xl">
            {/* macOS Window Header */}
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-500 flex-shrink-0"
            >
                <WindowControls target="imgfile" />
                <div className="flex items-center gap-2 flex-1 justify-center px-4 truncate">
                    <h2 className="font-bold text-sm text-gray-700 truncate">{currentTitle}</h2>
                    {hasMultiple && (
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                            ({currentIndex + 1} of {photosList.length})
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    {currentImageUrl && (
                        <a
                            href={currentImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                            title="Open in new tab"
                        >
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            </div>

            {/* Photo Canvas - dynamically spans vertical and horizontal photo dimensions */}
            <div className="relative p-3 bg-zinc-950/95 flex-1 flex items-center justify-center overflow-hidden group min-w-[280px]">
                {currentImageUrl ? (
                    <img
                        src={currentImageUrl}
                        alt={currentTitle}
                        className="max-h-[75vh] max-w-[80vw] w-auto h-auto object-contain rounded-lg shadow-2xl transition-all duration-200 select-none"
                    />
                ) : null}

                {/* Left Navigation Arrow */}
                {hasMultiple && (
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white shadow-xl backdrop-blur-sm transition-all active:scale-95 cursor-pointer z-20"
                        title="Previous Photo (Left Arrow key)"
                    >
                        <ChevronLeft size={22} className="stroke-[2.5]" />
                    </button>
                )}

                {/* Right Navigation Arrow */}
                {hasMultiple && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white shadow-xl backdrop-blur-sm transition-all active:scale-95 cursor-pointer z-20"
                        title="Next Photo (Right Arrow key)"
                    >
                        <ChevronRight size={22} className="stroke-[2.5]" />
                    </button>
                )}
            </div>
        </div>
    );
};

const ImageWindow = WindowWrapper(ImageWindowContent, "imgfile");
export default ImageWindow;
