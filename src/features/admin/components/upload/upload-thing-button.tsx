"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Download, Loader2 } from "lucide-react";

interface UploadThingButtonProps {
    endpoint: "profileImage" | "resumePdf";
    field: "personalInfo.image" | "personalInfo.resume";
    onUploadComplete?: (url: string) => void;
    customClass?: string;
}

export const UploadThingButton = ({ endpoint, field, onUploadComplete, customClass }: UploadThingButtonProps) => {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing(endpoint, {
        onClientUploadComplete: async (res) => {
            if (res && res[0]) {
                const url = res[0].url;
                console.log(`Upload complete for ${endpoint}:`, url);

                try {
                    const response = await fetch("/api/update-portfolio/patch", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ field, url }),
                    });

                    if (!response.ok) throw new Error("Failed to update portfolio");

                    const data = await response.json();
                    console.log("Portfolio updated:", data);

                    if (onUploadComplete) onUploadComplete(url);
                    router.refresh();
                } catch (error) {
                    console.error("Error updating portfolio:", error);
                    alert("Failed to update portfolio data. Please try again.");
                } finally {
                    setIsUploading(false);
                }
            }
        },
        onUploadError: (error: Error) => {
            console.error("Upload error:", error);
            alert(`Upload failed! ${error.message}`);
            setIsUploading(false);
        },
    });

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            const files = Array.from(e.target.files);
            await startUpload(files);
        }
    };

    // Default styles if no custom class provided
    const defaultButtonClass = "bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-full transition-all duration-200 text-sm font-semibold shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 flex items-center gap-2";

    return (
        <>
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={endpoint === "resumePdf" ? ".pdf" : "image/*"}
            />
            <button
                onClick={handleButtonClick}
                disabled={isUploading}
                className={customClass || defaultButtonClass}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                    </>
                ) : (
                    <>
                        {endpoint === "resumePdf" ? (
                            <>
                                <Download className="w-5 h-5" />
                                <span>Upload Resume (PDF)</span>
                            </>
                        ) : (
                            <span>Upload Profile Image</span>
                        )}
                    </>
                )}
            </button>
        </>
    );
};
