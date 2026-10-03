"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIOSStore } from "../store/useIOSStore";
import {
    Wifi,
    Bluetooth,
    Radio,
    Sun,
    Volume2,
    FileText,
    Mail,
    X,
    Sparkles,
} from "lucide-react";
import { AdaptedMacData } from "../../constants/adapter";

interface IOSControlCenterProps {
    data: AdaptedMacData;
}

export const IOSControlCenter: React.FC<IOSControlCenterProps> = ({ data }) => {
    const { controlCenterOpen, setControlCenterOpen, notify, openApp } = useIOSStore();
    const [wifiOn, setWifiOn] = useState(true);
    const [bluetoothOn, setBluetoothOn] = useState(true);
    const [brightness, setBrightness] = useState(85);
    const [volume, setVolume] = useState(70);

    return (
        <AnimatePresence>
            {controlCenterOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 350 }}
                    className="fixed inset-0 z-50 p-4 pt-12 flex flex-col justify-start items-center bg-black/40 backdrop-blur-2xl"
                    onClick={() => setControlCenterOpen(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm space-y-3 select-none"
                    >
                        {/* Header with Close */}
                        <div className="flex items-center justify-between px-2 text-white">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Control Center
                            </span>
                            <button
                                type="button"
                                onClick={() => setControlCenterOpen(false)}
                                className="p-1 rounded-full bg-white/20 text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Top 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Connectivity Box */}
                            <div className="p-3.5 rounded-[26px] bg-black/40 border border-white/10 backdrop-blur-xl grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setWifiOn(!wifiOn)}
                                    className={`p-3 rounded-full flex items-center justify-center transition-all ${
                                        wifiOn ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400"
                                    }`}
                                >
                                    <Wifi size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBluetoothOn(!bluetoothOn)}
                                    className={`p-3 rounded-full flex items-center justify-center transition-all ${
                                        bluetoothOn ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400"
                                    }`}
                                >
                                    <Bluetooth size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => notify("Cellular", "5G Connected", "sparkles")}
                                    className="p-3 rounded-full bg-emerald-500 text-white flex items-center justify-center"
                                >
                                    <Radio size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => notify("AirDrop", "Contacts Only", "sparkles")}
                                    className="p-3 rounded-full bg-blue-500 text-white flex items-center justify-center"
                                >
                                    <Sparkles size={18} />
                                </button>
                            </div>

                            {/* Status card */}
                            <div className="p-3.5 rounded-[26px] bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col justify-between text-white">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Focus</span>
                                    <h4 className="text-sm font-semibold">Coding Mode</h4>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs text-gray-300">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Sliders Box */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Brightness Slider */}
                            <div className="h-36 rounded-[26px] bg-black/40 border border-white/10 backdrop-blur-xl p-3 flex flex-col justify-between items-center relative overflow-hidden">
                                <Sun size={18} className="text-white z-10" />
                                <div className="w-full text-center z-10">
                                    <span className="text-xs font-semibold text-white">{brightness}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={brightness}
                                    onChange={(e) => setBrightness(Number(e.target.value))}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div
                                    style={{ height: `${brightness}%` }}
                                    className="absolute bottom-0 left-0 right-0 bg-white/25 rounded-b-[26px] transition-all"
                                />
                            </div>

                            {/* Volume Slider */}
                            <div className="h-36 rounded-[26px] bg-black/40 border border-white/10 backdrop-blur-xl p-3 flex flex-col justify-between items-center relative overflow-hidden">
                                <Volume2 size={18} className="text-white z-10" />
                                <div className="w-full text-center z-10">
                                    <span className="text-xs font-semibold text-white">{volume}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => setVolume(Number(e.target.value))}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div
                                    style={{ height: `${volume}%` }}
                                    className="absolute bottom-0 left-0 right-0 bg-white/25 rounded-b-[26px] transition-all"
                                />
                            </div>
                        </div>

                        {/* Quick Action Toggles */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setControlCenterOpen(false);
                                    openApp("resume");
                                }}
                                className="p-3.5 rounded-[22px] bg-black/40 border border-white/10 backdrop-blur-xl text-white flex items-center gap-2.5 active:scale-95 transition-all text-left"
                            >
                                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold">Resume</h5>
                                    <p className="text-[10px] text-gray-400">Quick View</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setControlCenterOpen(false);
                                    if (data.email) {
                                        navigator.clipboard.writeText(data.email);
                                        notify("Email Copied", data.email, "mail");
                                    }
                                }}
                                className="p-3.5 rounded-[22px] bg-black/40 border border-white/10 backdrop-blur-xl text-white flex items-center gap-2.5 active:scale-95 transition-all text-left"
                            >
                                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold">Copy Email</h5>
                                    <p className="text-[10px] text-gray-400">{data.email ? "Direct" : ""}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IOSControlCenter;
