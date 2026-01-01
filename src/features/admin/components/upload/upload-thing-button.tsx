"use client";

import { useUploadThing } from "@/core/upload/config";
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
            if (!res?.[0]) return;
            const url = res[0].url;

            try {
                const response = await fetch("/api/update-portfolio/patch", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ field, url }),
                });

                if (!response.ok) throw new Error("Update failed");

                onUploadComplete?.(url);
                router.refresh();
            } catch (error) {
                console.error(error);
                alert("Failed to update portfolio data.");
            } finally {
                setIsUploading(false);
            }
        },
        onUploadError: (error: Error) => {
            alert(`Upload failed: ${error.message}`);
            setIsUploading(false);
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setIsUploading(true);
        await startUpload(Array.from(e.target.files));
    };

    const defaultClass = "bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-full transition-all duration-200 text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";

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
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={customClass || defaultClass}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                    </>
                ) : (
                    <>
                        {endpoint === "resumePdf" ? <Download className="w-5 h-5" /> : null}
                        <span>{endpoint === "resumePdf" ? "Upload Resume (PDF)" : "Upload Profile Image"}</span>
                    </>
                )}
            </button>
        </>
    );
};
