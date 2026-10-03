"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DynamicIsland } from "./DynamicIsland";
import { AdaptedMacData } from "../../constants/adapter";
import { Wifi } from "lucide-react";
import { useIOSStore } from "../store/useIOSStore";

interface IOSStatusBarProps {
    data: AdaptedMacData;
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ data }) => {
    const [time, setTime] = useState<string>("");
    const { toggleControlCenter } = useIOSStore();

    useEffect(() => {
        const update = () => setTime(dayjs().format("h:mm"));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="relative w-full px-6 pt-3 pb-2 flex items-center justify-between z-40 select-none text-white pointer-events-none">
            {/* Left: Live Time */}
            <div className="flex items-center justify-start pointer-events-auto min-w-[48px]">
                <span className="text-sm font-semibold tracking-tight text-white drop-shadow-sm font-sans">
                    {time || "9:41"}
                </span>
            </div>

            {/* Center: Absolute centered Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 z-50 pointer-events-auto flex justify-center">
                <DynamicIsland data={data} />
            </div>

            {/* Right: Cellular, WiFi, Battery icons (tappable for Control Center) */}
            <div
                onClick={toggleControlCenter}
                className="flex items-center justify-end gap-1.5 pointer-events-auto cursor-pointer active:opacity-70 transition-opacity min-w-[48px]"
                title="Open Control Center"
            >
                {/* 4-bar cellular signal */}
                <div className="flex items-end gap-[1.5px] h-3">
                    <span className="w-[3px] h-1 bg-white rounded-xs" />
                    <span className="w-[3px] h-1.5 bg-white rounded-xs" />
                    <span className="w-[3px] h-2.5 bg-white rounded-xs" />
                    <span className="w-[3px] h-3 bg-white rounded-xs" />
                </div>

                {/* WiFi */}
                <Wifi size={13} className="text-white stroke-[2.5]" />

                {/* iOS Battery with green pill */}
                <div className="relative w-5 h-2.5 border border-white/80 rounded-[3px] p-[1px] flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-[1.5px]" />
                    <div className="absolute -right-1 top-0.5 bottom-0.5 w-0.5 bg-white/80 rounded-r-xs" />
                </div>
            </div>
        </header>
    );
};

export default IOSStatusBar;
