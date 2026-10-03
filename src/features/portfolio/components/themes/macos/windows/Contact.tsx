"use client";

import React from "react";
import WindowWrapper from "../hoc/WindowWrapper";
import { WindowControls } from "../components";

interface ContactProps {
    name?: string;
    image?: string;
    bio?: string;
    socials?: { id: number | string; text: string; icon: string; bg: string; link: string }[];
}

const Contact: React.FC<ContactProps> = ({
    name = "Abhivir",
    image = "/icons/user.svg",
    bio = "Got an idea? A bug to squash? Or just wanna talk tech? I'm in.",
    socials = [],
}) => {
    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-500 flex-shrink-0"
            >
                <WindowControls target="contact" />
                <h2 className="font-bold text-sm text-center flex-1 text-gray-700">Contact</h2>
                <div className="w-10" />
            </div>
            <div className="p-6 space-y-5 flex-1 min-h-0 overflow-y-auto">
                <div className="flex items-center gap-4">
                    <img
                        src={image}
                        alt={name}
                        className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-200 flex-shrink-0"
                    />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Let's connect</h3>
                        <p className="text-xs text-gray-500 font-medium">Get in touch with {name}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
                <ul className="flex flex-wrap items-stretch gap-3 pt-2">
                    {socials.map(({ id, bg, link, icon, text }) => (
                        <li
                            key={id}
                            style={{ backgroundColor: bg }}
                            className="flex-1 min-w-[130px] rounded-xl shadow-sm hover:-translate-y-0.5 hover:scale-105 transition-all duration-300"
                        >
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={text}
                                className="flex items-center gap-3 p-3.5 text-white no-underline font-semibold text-sm"
                            >
                                <img src={icon} alt={text} className="size-5 brightness-0 invert flex-shrink-0" />
                                <span>{text}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow;
