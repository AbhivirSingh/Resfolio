"use client";

import React, { useState } from "react";
import WindowWrapper from "../hoc/WindowWrapper";
import { WindowControls } from "../components";
import { photosLinks } from "../constants";
import clsx from "clsx";
import { Image as ImageIcon } from "lucide-react";
import useWindowStore from "../store/window";

interface PhotosProps {
    photosList?: { id: number | string; img: string; title?: string }[];
}

const Photos: React.FC<PhotosProps> = ({ photosList = [] }) => {
    const [activeTab, setActiveTab] = useState<number>(1);
    const { openWindow } = useWindowStore();

    const handlePhotoClick = (idx: number) => {
        const item = photosList[idx];
        if (!item) return;
        openWindow("imgfile", {
            name: item.title || `Photo ${idx + 1}`,
            imageUrl: item.img,
            photosList,
            currentIndex: idx,
        });
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-500 flex-shrink-0"
            >
                <WindowControls target="photos" />
                <h2 className="font-bold text-sm text-center flex-1 text-gray-700">Photos</h2>
                <div className="w-10" />
            </div>

            <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Sidebar */}
                <div className="sidebar w-48 flex-none bg-gray-50 border-r border-gray-200 flex flex-col p-4 space-y-2 overflow-y-auto">
                    <h2 className="text-xs font-medium text-gray-400 mb-1">Photos</h2>
                    <ul className="space-y-1">
                        {photosLinks.map((link) => (
                            <li
                                key={link.id}
                                onClick={() => setActiveTab(link.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-2 rounded-md cursor-default transition-colors",
                                    link.id === activeTab
                                        ? "bg-blue-100 text-blue-700 font-semibold"
                                        : "text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                <img src={link.icon} alt={link.title} className="w-4 h-4 object-contain" />
                                <p className="text-sm font-medium">{link.title}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gallery Content */}
                <div className="gallery flex-1 p-5 overflow-auto min-h-0 relative">
                    {photosList.length > 0 ? (
                        <div className="columns-2 md:columns-3 gap-3 space-y-3">
                            {photosList.map((item, idx) => (
                                <div
                                    key={item.id}
                                    onClick={() => handlePhotoClick(idx)}
                                    className="break-inside-avoid relative group overflow-hidden rounded-xl bg-gray-100 border border-gray-200/80 shadow-xs cursor-pointer hover:shadow-md transition-all"
                                >
                                    <img
                                        src={item.img}
                                        alt={item.title || "Photo"}
                                        className="w-full h-auto object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-300 block"
                                        loading="lazy"
                                    />
                                    {item.title && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                                            <span className="text-white text-xs font-medium truncate">{item.title}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2.5">
                            <div className="p-4 rounded-2xl bg-gray-100 text-gray-400">
                                <ImageIcon size={36} />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-700">No Photos</h3>
                                <p className="text-xs text-gray-400 mt-0.5 max-w-xs">
                                    Photos added in the Admin Portal will be showcased here.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PhotosWindow = WindowWrapper(Photos, "photos");
export default PhotosWindow;
