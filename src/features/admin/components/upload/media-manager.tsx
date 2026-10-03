"use client";

import React, { useState, useRef } from "react";
import { PortfolioData } from "@/types/portfolio";
import { useUploadThing } from "@/core/upload/config";
import {
    ImagePlus,
    FileText,
    Trash2,
    Loader2,
    Check,
    Upload,
    ExternalLink,
    Sparkles,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface MediaManagerProps {
    currentData: PortfolioData | null;
    onUpdate?: (updatedData: PortfolioData) => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ currentData, onUpdate }) => {
    const router = useRouter();
    const [profileImage, setProfileImage] = useState<string>(
        currentData?.personalInfo?.image || ""
    );
    const [resumeUrl, setResumeUrl] = useState<string>(
        currentData?.personalInfo?.resume || ""
    );
    const [gallery, setGallery] = useState<{ id: number | string; img: string; title?: string }[]>(
        currentData?.gallery || []
    );

    const [uploadingTarget, setUploadingTarget] = useState<"profile" | "resume" | "gallery" | null>(
        null
    );

    const profileInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (currentData) {
            setProfileImage(currentData.personalInfo?.image || "");
            setResumeUrl(currentData.personalInfo?.resume || "");
            setGallery(currentData.gallery || []);
        }
    }, [currentData]);

    // Profile Image Upload via UploadThing
    const { startUpload: startProfileUpload } = useUploadThing("profileImage", {
        onClientUploadComplete: async (res) => {
            if (!res?.[0]) return;
            const url = res[0].url;
            setProfileImage(url);
            try {
                await fetch("/api/update-portfolio/patch", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ field: "personalInfo.image", url }),
                });
                router.refresh();
            } catch (err) {
                console.error(err);
            } finally {
                setUploadingTarget(null);
            }
        },
        onUploadError: (err) => {
            alert(`Profile upload error: ${err.message}`);
            setUploadingTarget(null);
        },
    });

    // Resume PDF Upload via UploadThing
    const { startUpload: startResumeUpload } = useUploadThing("resumePdf", {
        onClientUploadComplete: async (res) => {
            if (!res?.[0]) return;
            const url = res[0].url;
            setResumeUrl(url);
            try {
                await fetch("/api/update-portfolio/patch", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ field: "personalInfo.resume", url }),
                });
                router.refresh();
            } catch (err) {
                console.error(err);
            } finally {
                setUploadingTarget(null);
            }
        },
        onUploadError: (err) => {
            alert(`Resume upload error: ${err.message}`);
            setUploadingTarget(null);
        },
    });

    // Gallery Photos Upload via UploadThing
    const { startUpload: startGalleryUpload } = useUploadThing("galleryImage", {
        onClientUploadComplete: async (res) => {
            if (!res?.length) return;
            try {
                for (const file of res) {
                    const newItem = {
                        id: Date.now() + Math.random(),
                        img: file.url,
                        title: "Gallery Photo",
                    };
                    await fetch("/api/update-portfolio/patch", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            field: "gallery",
                            action: "add",
                            item: newItem,
                        }),
                    });
                    setGallery((prev) => [...prev, newItem]);
                }
                router.refresh();
            } catch (err) {
                console.error(err);
            } finally {
                setUploadingTarget(null);
            }
        },
        onUploadError: (err) => {
            alert(`Gallery upload error: ${err.message}`);
            setUploadingTarget(null);
        },
    });

    const handleDeleteGalleryItem = async (id: number | string) => {
        setGallery((prev) => prev.filter((item) => item.id !== id));
        try {
            await fetch("/api/update-portfolio/patch", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    field: "gallery",
                    action: "delete",
                    id,
                }),
            });
            router.refresh();
        } catch (err) {
            console.error("Failed to delete gallery item:", err);
        }
    };

    return (
        <div className="bg-white max-w-4xl w-full rounded-2xl shadow-xl p-8 space-y-8 animate-in fade-in">
            {/* Hidden File Inputs */}
            <input
                type="file"
                accept="image/*"
                ref={profileInputRef}
                className="hidden"
                onChange={async (e) => {
                    if (!e.target.files?.length) return;
                    setUploadingTarget("profile");
                    await startProfileUpload(Array.from(e.target.files));
                }}
            />
            <input
                type="file"
                accept=".pdf"
                ref={resumeInputRef}
                className="hidden"
                onChange={async (e) => {
                    if (!e.target.files?.length) return;
                    setUploadingTarget("resume");
                    await startResumeUpload(Array.from(e.target.files));
                }}
            />
            <input
                type="file"
                multiple
                accept="image/*"
                ref={galleryInputRef}
                className="hidden"
                onChange={async (e) => {
                    if (!e.target.files?.length) return;
                    setUploadingTarget("gallery");
                    await startGalleryUpload(Array.from(e.target.files));
                }}
            />

            <div>
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider mb-1">
                    <Sparkles size={16} />
                    <span>UploadThing Media Assets</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Portfolio Media & Gallery Manager</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Upload and manage your profile picture, resume PDF, and gallery showcase photos securely. All uploaded assets automatically sync across macOS, iOS, and Modern themes.
                </p>
            </div>

            {/* Grid for Profile Image & Resume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Photo Card */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col justify-between space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                <User size={18} className="text-blue-600" />
                                <span>Profile Avatar</span>
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Used on Hero, macOS Contact, and iOS Dynamic Island
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 border border-gray-300 flex-shrink-0 flex items-center justify-center">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={32} className="text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <button
                                type="button"
                                onClick={() => profileInputRef.current?.click()}
                                disabled={uploadingTarget === "profile"}
                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {uploadingTarget === "profile" ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={14} />
                                        <span>Upload New Photo</span>
                                    </>
                                )}
                            </button>
                            {profileImage && (
                                <a
                                    href={profileImage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-gray-500 hover:text-blue-600 flex items-center gap-1"
                                >
                                    <span>View full image</span>
                                    <ExternalLink size={10} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resume PDF Card */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/60 flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                            <FileText size={18} className="text-red-500" />
                            <span>Resume PDF</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Used in Resume window, iOS PDF viewer, and download links
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-500">
                            <FileText size={32} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <button
                                type="button"
                                onClick={() => resumeInputRef.current?.click()}
                                disabled={uploadingTarget === "resume"}
                                className="w-full px-4 py-2 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {uploadingTarget === "resume" ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Uploading PDF...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={14} />
                                        <span>Upload Resume PDF</span>
                                    </>
                                )}
                            </button>
                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-gray-500 hover:text-blue-600 flex items-center gap-1"
                                >
                                    <span>Preview active PDF</span>
                                    <ExternalLink size={10} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Showcase Photos Section */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                            <ImagePlus size={18} className="text-purple-600" />
                            <span>Gallery Showcase Photos ({gallery.length})</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Displayed inside the macOS & iOS Photos App for public visitors
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={uploadingTarget === "gallery"}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
                    >
                        {uploadingTarget === "gallery" ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Uploading Photos...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={14} />
                                <span>+ Add Gallery Photos</span>
                            </>
                        )}
                    </button>
                </div>

                {gallery.length > 0 ? (
                    <>
                        {/* Mobile View: Photo on the left, Side Panel with Open & Delete on the right */}
                        <div className="flex flex-col space-y-3 sm:hidden">
                            {gallery.map((item, idx) => (
                                <div
                                    key={item.id}
                                    className="flex items-stretch bg-white border border-gray-200 rounded-2xl p-3 shadow-xs gap-3"
                                >
                                    {/* Left: Photo */}
                                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative">
                                        <img
                                            src={item.img}
                                            alt={item.title || `Gallery photo ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Right: Side Panel with Details & Actions */}
                                    <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-gray-800 truncate">
                                                {item.title || `Photo ${idx + 1}`}
                                            </span>
                                            <span className="text-[10px] text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                                                Active
                                            </span>
                                        </div>

                                        {/* Actions Side Panel */}
                                        <div className="flex flex-col gap-1.5 mt-2">
                                            <a
                                                href={item.img}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-98"
                                                title="Open in new tab"
                                            >
                                                <ExternalLink size={13} className="text-gray-500" />
                                                <span>Open in new tab</span>
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteGalleryItem(item.id)}
                                                className="w-full py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-98"
                                                title="Delete photo"
                                            >
                                                <Trash2 size={13} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Grid with Hover Controls */}
                        <div className="hidden sm:grid sm:grid-cols-4 gap-3">
                            {gallery.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative group aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 shadow-xs"
                                >
                                    <img
                                        src={item.img}
                                        alt="Gallery item"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                        <a
                                            href={item.img}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white"
                                            title="Open in new tab"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGalleryItem(item.id)}
                                            className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="py-12 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-2 bg-white">
                        <ImagePlus size={32} className="text-gray-400" />
                        <p className="text-sm font-medium text-gray-700">No showcase photos uploaded yet</p>
                        <p className="text-xs text-gray-400 max-w-sm">
                            Click &quot;+ Add Gallery Photos&quot; above to upload your pictures using UploadThing.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaManager;
