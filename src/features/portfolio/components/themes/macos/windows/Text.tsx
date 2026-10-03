"use client";

import React from "react";
import WindowWrapper from "../hoc/WindowWrapper";
import { WindowControls } from "../components";
import useWindowStore from "../store/window";

const Text: React.FC = () => {
    const { windows } = useWindowStore();
    const data = windows.txtfile?.data;
    if (!data) return null;
    const { name, image, subtitle, description } = data;

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <div
                id="window-header"
                className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-500 flex-shrink-0"
            >
                <WindowControls target="txtfile" />
                <h2 className="font-bold text-sm text-center flex-1 text-gray-700">{name}</h2>
                <div className="w-10" />
            </div>
            <div className="p-6 space-y-5 bg-white flex-1 min-h-0 overflow-y-auto">
                {image ? (
                    <div className="w-full">
                        <img src={image} alt={name} className="rounded-lg shadow-sm" />
                    </div>
                ) : null}
                {subtitle ? <h3 className="text-base font-semibold text-gray-900">{subtitle}</h3> : null}
                {Array.isArray(description) && description.length > 0 ? (
                    <div className="space-y-3 leading-relaxed text-sm text-gray-800">
                        {description.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const TextWindow = WindowWrapper(Text, "txtfile");
export default TextWindow;
