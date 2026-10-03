"use client";

import React, { useState } from "react";
import { IOSAppSheet } from "../components/IOSAppSheet";
import { photosLinks } from "../../constants";
import { X, Heart, Image as ImageIcon } from "lucide-react";

interface IOSPhotosAppProps {
    photosList?: { id: number | string; img: string; title?: string }[];
}

export const IOSPhotosApp: React.FC<IOSPhotosAppProps> = ({ photosList = [] }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<number>(1);

    return (
        <IOSAppSheet title="Photos" icon="/images/photos.png">
            <div className="p-3 space-y-3 max-w-lg mx-auto pb-10">
                {/* Segmented Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {photosLinks.map((link) => (
                        <button
                            key={link.id}
                            type="button"
                            onClick={() => setActiveTab(link.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                activeTab === link.id
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            <img src={link.icon} alt="" className="w-3.5 h-3.5 object-contain" />
                            <span>{link.title}</span>
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {photosList.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5">
                        {photosList.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPhoto(item.img)}
                                className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 relative cursor-pointer group shadow-sm"
                            >
                                <img
                                    src={item.img}
                                    alt="gallery-item"
                                    className="w-full h-full object-cover group-hover:scale-105 active:scale-95 transition-all duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                    <Heart size={14} className="text-white fill-white/20" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-2.5">
                        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-400">
                            <ImageIcon size={36} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                No Photos
                            </h3>
                            <p className="text-xs text-gray-400 max-w-xs mt-0.5">
                                Photos added in the Admin Portal will appear here.
                            </p>
                        </div>
                    </div>
                )}

                {/* Lightbox Modal */}
                {selectedPhoto && (
                    <div
                        onClick={() => setSelectedPhoto(null)}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={selectedPhoto}
                            alt="Full preview"
                            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                        />
                    </div>
                )}
            </div>
        </IOSAppSheet>
    );
};

export default IOSPhotosApp;
