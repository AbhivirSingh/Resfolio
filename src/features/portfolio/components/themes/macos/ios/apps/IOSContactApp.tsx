"use client";

import React from "react";
import { IOSAppSheet } from "../components/IOSAppSheet";
import { AdaptedMacData } from "../../constants/adapter";
import {
    Mail,
    Copy,
    Check,
    Github,
    Linkedin,
    ExternalLink,
} from "lucide-react";
import { useIOSStore } from "../store/useIOSStore";

interface IOSContactAppProps {
    data: AdaptedMacData;
}

export const IOSContactApp: React.FC<IOSContactAppProps> = ({ data }) => {
    const { notify } = useIOSStore();
    const [copiedEmail, setCopiedEmail] = React.useState(false);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        if (label === "Email") setCopiedEmail(true);
        notify(`${label} Copied`, text, "mail");
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <IOSAppSheet title="Contact Card" icon="/images/contact.png">
            <div className="p-4 space-y-5 max-w-lg mx-auto pb-12">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-2 pt-2">
                    <div className="relative">
                        <img
                            src={data.image || "/icons/user.svg"}
                            alt={data.name}
                            className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white dark:border-zinc-700 bg-white/20"
                        />
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-800" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {data.fullName || data.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {data.title}
                        </p>
                    </div>
                </div>

                {/* iOS Quick Action Row */}
                <div className="grid grid-cols-4 gap-2">
                    <a
                        href={`mailto:${data.email}`}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm active:scale-95 transition-all text-center"
                    >
                        <div className="p-2 rounded-full bg-blue-500 text-white mb-1">
                            <Mail size={16} />
                        </div>
                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Mail</span>
                    </a>

                    <button
                        type="button"
                        onClick={() => handleCopy(data.email, "Email")}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm active:scale-95 transition-all text-center"
                    >
                        <div className="p-2 rounded-full bg-emerald-500 text-white mb-1">
                            {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                        </div>
                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                            {copiedEmail ? "Copied" : "Copy"}
                        </span>
                    </button>

                    {data.socials.find((s) => s.text.toLowerCase().includes("linkedin")) && (
                        <a
                            href={data.socials.find((s) => s.text.toLowerCase().includes("linkedin"))?.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm active:scale-95 transition-all text-center"
                        >
                            <div className="p-2 rounded-full bg-[#0077B5] text-white mb-1">
                                <Linkedin size={16} />
                            </div>
                            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
                        </a>
                    )}

                    {data.socials.find((s) => s.text.toLowerCase().includes("github")) && (
                        <a
                            href={data.socials.find((s) => s.text.toLowerCase().includes("github"))?.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm active:scale-95 transition-all text-center"
                        >
                            <div className="p-2 rounded-full bg-zinc-900 text-white mb-1">
                                <Github size={16} />
                            </div>
                            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                        </a>
                    )}
                </div>

                {/* Bio card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        About
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {data.bio}
                    </p>
                </div>

                {/* Social Profiles List */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
                        Social & Profiles
                    </h4>
                    <div className="rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm divide-y divide-gray-100 dark:divide-zinc-700/60 overflow-hidden">
                        {data.socials.map((social) => (
                            <a
                                key={social.id}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 hover:bg-gray-50 dark:hover:bg-zinc-700/40 active:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        style={{ backgroundColor: social.bg }}
                                        className="p-2 rounded-xl text-white shadow-xs"
                                    >
                                        <img
                                            src={social.icon}
                                            alt={social.text}
                                            className="w-4 h-4 brightness-0 invert"
                                        />
                                    </div>
                                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                        {social.text}
                                    </span>
                                </div>
                                <ExternalLink size={14} className="text-gray-400" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </IOSAppSheet>
    );
};

export default IOSContactApp;
