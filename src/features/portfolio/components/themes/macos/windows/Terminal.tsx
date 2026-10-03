"use client";

import React from "react";
import WindowControls from "../components/WindowControls";
import WindowWrapper from "../hoc/WindowWrapper";
import { Check, Flag } from "lucide-react";

interface TerminalProps {
    techStack?: { category: string; items: string[] }[];
    username?: string;
}

const Terminal: React.FC<TerminalProps> = ({ techStack = [], username = "developer" }) => {
    const cleanUsername = username.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-500 flex-shrink-0"
            >
                <WindowControls target="terminal" />
                <h2 className="font-bold text-sm text-center flex-1 text-gray-700">Tech Stack</h2>
                <div className="w-10" />
            </div>
            <div className="techstack text-sm font-roboto p-6 space-y-4 font-mono text-gray-800 flex-1 min-h-0 overflow-y-auto">
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
                <div className="footnote text-[#00A154] space-y-1 text-xs">
                    <p className="flex items-center gap-2">
                        <Check size={16} /> {techStack.length} of {techStack.length} stacks loaded successfully (100%)
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                        <Flag size={14} fill="currentColor" />
                        Render time: 4ms
                    </p>
                </div>
            </div>
        </div>
    );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");
export default TerminalWindow;
