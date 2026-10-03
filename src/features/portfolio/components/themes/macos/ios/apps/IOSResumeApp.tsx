"use client";

import React, { useState } from "react";
import { IOSAppSheet } from "../components/IOSAppSheet";
import { Download, ExternalLink } from "lucide-react";
import { useIOSStore } from "../store/useIOSStore";

interface IOSResumeAppProps {
    resumeUrl?: string;
}

export const IOSResumeApp: React.FC<IOSResumeAppProps> = ({
    resumeUrl = "/files/resume.pdf",
}) => {
    const { notify } = useIOSStore();

    const handleDownload = () => {
        notify("Downloading Resume", "Saving PDF...", "file", 2500);
    };

    return (
        <IOSAppSheet
            title="Resume.pdf"
            icon="/images/pdf.png"
            headerRight={
                <a
                    href={resumeUrl}
                    download="Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-blue-500 text-white font-medium text-xs flex items-center gap-1 active:scale-95 transition-all"
                >
                    <Download size={13} />
                    <span>Save</span>
                </a>
            }
        >
            <div className="flex flex-col h-full bg-gray-100 dark:bg-zinc-950 p-2">
                {/* PDF Container */}
                <div className="flex-1 w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[480px]">
                    <iframe
                        src={`${resumeUrl}#toolbar=0&navpanes=0`}
                        title="Resume Preview"
                        className="w-full h-full border-none"
                    />
                </div>

                {/* Bottom Quick Bar */}
                <div className="py-2.5 flex items-center justify-between px-2 text-xs text-gray-500">
                    <span>PDF Document • 1 Page</span>
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 font-semibold flex items-center gap-1"
                    >
                        <span>Open Full Screen</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </IOSAppSheet>
    );
};

export default IOSResumeApp;
