"use client";

import React from "react";
import WindowControls from "../components/WindowControls";
import WindowWrapper from "../hoc/WindowWrapper";
import { Check, Flag, Terminal as TerminalIcon } from "lucide-react";

interface TerminalProps {
    techStack?: { category: string; items: string[] }[];
    coursework?: string[];
    username?: string;
}

const Terminal: React.FC<TerminalProps> = ({
    techStack = [],
    coursework = [],
    username = "developer",
}) => {
    const cleanUsername = username.toLowerCase().replace(/\s+/g, "-");
    const hasTechStack = techStack.length > 0;
    const hasCoursework = coursework.length > 0;

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-500 flex-shrink-0"
            >
                <WindowControls target="terminal" />
                <h2 className="font-bold text-sm text-center flex-1 text-gray-700">Tech Stack & Skills</h2>
                <div className="w-10" />
            </div>

            <div className="techstack text-sm font-roboto p-6 space-y-6 font-mono text-gray-800 flex-1 min-h-0 overflow-y-auto">
                {/* Tech Stack Command & Output */}
                {hasTechStack ? (
                    <div>
                        <p>
                            <span className="font-bold text-blue-600">@{cleanUsername} % </span>
                            show tech stack
                        </p>
                        <div className="label flex items-center ms-6 mt-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                            <p className="w-36 flex-shrink-0">Category</p>
                            <p>Technologies</p>
                        </div>
                        <ul className="content py-4 my-3 border-y border-dashed border-gray-300 space-y-2.5">
                            {techStack.map(({ category, items }) => (
                                <li key={category} className="flex items-start">
                                    <Check className="check text-[#00A154] w-5 h-5 flex-shrink-0 mt-0.5" size={18} />
                                    <h3 className="font-semibold text-[#00A154] w-36 ms-3 flex-shrink-0">{category}</h3>
                                    <ul className="flex items-center flex-wrap gap-x-2 gap-y-1">
                                        {items.map((item, i) => (
                                            <li key={i} className="text-gray-700">
                                                {item}
                                                {i < items.length - 1 ? "," : ""}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {/* Coursework Command & Output */}
                {hasCoursework ? (
                    <div>
                        <p>
                            <span className="font-bold text-purple-600">@{cleanUsername} % </span>
                            show relevant coursework
                        </p>
                        <ul className="content py-3 my-2 border-y border-dashed border-gray-300 flex flex-wrap gap-2">
                            {coursework.map((course, idx) => (
                                <li
                                    key={idx}
                                    className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-md text-xs font-medium"
                                >
                                    {course}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {/* Footnote */}
                <div className="footnote text-[#00A154] space-y-1 text-xs pt-2">
                    <p className="flex items-center gap-2">
                        <Check size={16} /> All skills and modules compiled successfully (100%)
                    </p>
                    <p className="text-gray-500 flex items-center gap-2">
                        <Flag size={14} fill="currentColor" />
                        Execution environment: macOS Darwin zsh
                    </p>
                </div>
            </div>
        </div>
    );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");
export default TerminalWindow;
