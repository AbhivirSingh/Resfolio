"use client";

import React, { useState } from "react";
import { IOSAppSheet } from "../components/IOSAppSheet";
import { AdaptedMacData } from "../../constants/adapter";
import {
    Cpu,
    Database,
    Code,
    Layers,
    Copy,
    Sparkles,
    LucideIcon,
} from "lucide-react";
import { useIOSStore } from "../store/useIOSStore";

interface IOSSkillsAppProps {
    data: AdaptedMacData;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    Languages: Code,
    "AI / ML": Cpu,
    "Data & Infra": Database,
    Frameworks: Layers,
    "Core Concepts": Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
    Languages: "bg-blue-500 text-white",
    "AI / ML": "bg-purple-500 text-white",
    "Data & Infra": "bg-emerald-500 text-white",
    Frameworks: "bg-amber-500 text-white",
    "Core Concepts": "bg-rose-500 text-white",
};

export const IOSSkillsApp: React.FC<IOSSkillsAppProps> = ({ data }) => {
    const { notify } = useIOSStore();
    const [activeTab, setActiveTab] = useState<"settings" | "terminal">("settings");
    const [terminalInput, setTerminalInput] = useState("");
    const [terminalLogs, setTerminalLogs] = useState<string[]>([
        "Welcome to Terminal v2.4 (iOS Mobile)",
        "Type 'help' or 'skills' for command list.",
    ]);

    const handleCopyAll = () => {
        const text = data.techStack
            .map((cat) => `${cat.category}: ${cat.items.join(", ")}`)
            .join("\n");
        navigator.clipboard.writeText(text);
        notify("Skills Copied", "All categories to clipboard", "sparkles");
    };

    const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = terminalInput.trim().toLowerCase();
        if (!cmd) return;

        let response = "";
        if (cmd === "help") {
            response = "Available: skills, whoami, bio, clear, contact";
        } else if (cmd === "skills" || cmd === "tech") {
            response = data.techStack.map((s) => `• ${s.category}: ${s.items.join(", ")}`).join("\n");
        } else if (cmd === "whoami") {
            response = `${data.fullName} — ${data.title}`;
        } else if (cmd === "bio") {
            response = data.bio;
        } else if (cmd === "contact") {
            response = `Email: ${data.email}`;
        } else if (cmd === "clear") {
            setTerminalLogs([]);
            setTerminalInput("");
            return;
        } else {
            response = `zsh: command not found: ${cmd}. Type 'help'`;
        }

        setTerminalLogs((prev) => [...prev, `$ ${terminalInput}`, response]);
        setTerminalInput("");
    };

    return (
        <IOSAppSheet
            title="Skills & Tech"
            icon="/images/terminal.png"
            headerRight={
                <button
                    type="button"
                    onClick={handleCopyAll}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
                >
                    <Copy size={13} />
                    <span>Copy</span>
                </button>
            }
        >
            <div className="p-4 space-y-4 max-w-lg mx-auto">
                {/* Segmented Control */}
                <div className="p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center">
                    <button
                        type="button"
                        onClick={() => setActiveTab("settings")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === "settings"
                                ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        iOS Grouped View
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("terminal")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === "terminal"
                                ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        Terminal Shell
                    </button>
                </div>

                {activeTab === "settings" ? (
                    /* GROUPED iOS SETTINGS VIEW */
                    <div className="space-y-4 pb-8">
                        {data.techStack.map((category) => {
                            const IconComponent = CATEGORY_ICONS[category.category] || Code;
                            const colorClass = CATEGORY_COLORS[category.category] || "bg-blue-500 text-white";

                            return (
                                <div key={category.category} className="space-y-1.5">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-2">
                                        {category.category}
                                    </h3>
                                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-gray-100 dark:border-zinc-700/60 shadow-sm space-y-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`p-2 rounded-xl ${colorClass} shadow-sm`}>
                                                <IconComponent size={16} />
                                            </div>
                                            <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                                {category.category}
                                            </span>
                                            <span className="ml-auto text-xs text-gray-400 font-medium">
                                                {category.items.length} tools
                                            </span>
                                        </div>

                                        {/* Skill chips */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {category.items.map((item) => (
                                                <span
                                                    key={item}
                                                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-700/80 text-gray-800 dark:text-gray-200 text-xs font-medium border border-gray-200/50 dark:border-zinc-600/40"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* TERMINAL INTERACTIVE VIEW */
                    <div className="bg-[#18181b] text-emerald-400 p-4 rounded-2xl font-mono text-xs shadow-inner space-y-3 min-h-[340px] flex flex-col justify-between border border-zinc-700">
                        <div className="space-y-2 overflow-y-auto max-h-[260px]">
                            {terminalLogs.map((log, idx) => (
                                <p key={idx} className="whitespace-pre-wrap leading-relaxed">
                                    {log}
                                </p>
                            ))}
                        </div>

                        <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                            <span className="text-blue-400 font-bold">$</span>
                            <input
                                type="text"
                                value={terminalInput}
                                onChange={(e) => setTerminalInput(e.target.value)}
                                placeholder="Type command..."
                                className="flex-1 bg-transparent text-white outline-none font-mono text-xs"
                            />
                        </form>
                    </div>
                )}
            </div>
        </IOSAppSheet>
    );
};

export default IOSSkillsApp;
