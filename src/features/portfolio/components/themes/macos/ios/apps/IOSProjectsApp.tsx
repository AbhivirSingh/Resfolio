"use client";

import React, { useState } from "react";
import { IOSAppSheet } from "../components/IOSAppSheet";
import { AdaptedMacData } from "../../constants/adapter";
import { LocationItem } from "../../constants";
import {
    Folder,
    ExternalLink,
    Github,
    Search,
    Sparkles,
    ArrowUpRight,
} from "lucide-react";
import { useIOSStore } from "../store/useIOSStore";

interface IOSProjectsAppProps {
    data: AdaptedMacData;
}

export const IOSProjectsApp: React.FC<IOSProjectsAppProps> = ({ data }) => {
    const { notify } = useIOSStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState<LocationItem | null>(null);

    const rawProjects = data.projects || [];

    const filteredProjects = rawProjects.filter((project) => {
        const textToMatch = `${project.name} ${
            project.children?.map((c) => c.name + " " + (c.subtitle || "") + " " + (c.description?.join(" ") || "")).join(" ") || ""
        }`.toLowerCase();
        return textToMatch.includes(searchQuery.toLowerCase());
    });

    return (
        <IOSAppSheet
            title="Projects & Work"
            icon="/images/folder.png"
            onBack={selectedProject ? () => setSelectedProject(null) : undefined}
        >
            <div className="p-4 space-y-4 max-w-lg mx-auto">
                {/* Search Bar */}
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search projects, skills, or tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    />
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {filteredProjects.length} Projects Available
                    </span>
                    <span className="text-xs font-medium text-blue-500 flex items-center gap-1">
                        <Sparkles size={12} /> Curated
                    </span>
                </div>

                {/* Projects List */}
                <div className="space-y-3 pb-8">
                    {filteredProjects.map((project, idx) => {
                        const txtFile = project.children?.find((c) => c.fileType === "txt");
                        const liveLink = project.children?.find(
                            (c) => c.fileType === "url" && c.href && !c.href.includes("github.com")
                        );
                        const githubLink = project.children?.find(
                            (c) => c.fileType === "url" && c.href?.includes("github.com")
                        );

                        return (
                            <div
                                key={project.id || idx}
                                onClick={() => setSelectedProject(project)}
                                className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700/60 shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex-shrink-0">
                                            <Folder size={24} className="fill-blue-500/20" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-base text-gray-900 dark:text-white leading-snug">
                                                {project.name}
                                            </h3>
                                            {txtFile?.subtitle && (
                                                <p className="text-xs font-medium text-blue-500 dark:text-blue-400 mt-0.5 line-clamp-1">
                                                    {txtFile.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowUpRight size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                                </div>

                                {/* Description Bullets */}
                                {txtFile?.description && txtFile.description.length > 0 && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                        {txtFile.description[0]}
                                    </p>
                                )}

                                {/* Links and Actions */}
                                <div className="flex items-center gap-2 pt-1 border-t border-gray-50 dark:border-zinc-700/40">
                                    {liveLink?.href && (
                                        <a
                                            href={liveLink.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                notify("Opening Live Demo", project.name, "globe");
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white font-medium text-xs shadow-sm hover:bg-blue-600 active:scale-95 transition-all"
                                        >
                                            <span>Live Demo</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    )}

                                    {githubLink?.href && (
                                        <a
                                            href={githubLink.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                notify("Opening GitHub Repo", project.name, "github");
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 font-medium text-xs hover:bg-gray-200 active:scale-95 transition-all"
                                        >
                                            <Github size={13} />
                                            <span>GitHub</span>
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProject(project);
                                        }}
                                        className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900"
                                    >
                                        Details →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Project Detail Modal if active */}
                {selectedProject && (
                    <div
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[28px] p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
                                        <Folder size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                        {selectedProject.name}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedProject(null)}
                                    className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            {selectedProject.children?.map((child) => (
                                <div key={child.id} className="space-y-2">
                                    {child.subtitle && (
                                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium">
                                            {child.subtitle}
                                        </div>
                                    )}
                                    {child.description && (
                                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
                                            {child.description.map((bullet, bIdx) => (
                                                <li key={bIdx} className="leading-relaxed">
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {child.fileType === "url" && child.href && (
                                        <a
                                            href={child.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-medium mt-2 mr-2"
                                        >
                                            <span>Open {child.name}</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </IOSAppSheet>
    );
};

export default IOSProjectsApp;
