"use client";

import React, { useState, useEffect } from "react";
import WindowWrapper from "../hoc/WindowWrapper";
import { WindowControls } from "../components";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";

const Document = dynamic(
    () => import("react-pdf").then((mod) => mod.Document),
    { ssr: false }
);

const Page = dynamic(
    () => import("react-pdf").then((mod) => mod.Page),
    { ssr: false }
);

interface ResumeProps {
    resumeUrl?: string;
}

const Resume: React.FC<ResumeProps> = ({ resumeUrl = "/files/resume.pdf" }) => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(1);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("react-pdf").then((pdfjsPackage) => {
                pdfjsPackage.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsPackage.pdfjs.version}/build/pdf.worker.min.mjs`;
            }).catch(() => setHasError(true));
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400 flex-shrink-0"
            >
                <WindowControls target="resume" />
                <h2 className="font-bold text-sm text-center flex-1 text-gray-700">Resume.pdf</h2>
                <a
                    href={resumeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-gray-600 hover:text-black transition-colors"
                    title="Download Resume"
                >
                    <Download className="icon p-1 hover:bg-gray-200 rounded w-5 h-5" />
                </a>
            </div>

            <div className="p-2 overflow-auto flex-1 min-h-0 flex justify-center bg-gray-100 min-w-0">
                {!hasError ? (
                    <Document
                        file={resumeUrl}
                        onLoadSuccess={({ numPages: total }) => setNumPages(total)}
                        onLoadError={() => setHasError(true)}
                        loading={
                            <div className="p-10 text-center text-sm text-gray-500">
                                Loading resume...
                            </div>
                        }
                    >
                        <Page pageNumber={pageNumber} width={520} renderTextLayer={false} renderAnnotationLayer={false} />
                    </Document>
                ) : (
                    <iframe
                        src={resumeUrl}
                        title="Resume PDF"
                        className="w-[520px] h-[600px] border-none rounded"
                    />
                )}
            </div>
        </div>
    );
};

const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
