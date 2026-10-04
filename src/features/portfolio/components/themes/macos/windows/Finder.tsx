"use client";

import React from "react";
import { WindowControls } from "../components";
import { Search } from "lucide-react";
import WindowWrapper from "../hoc/WindowWrapper";
import { LocationItem } from "../constants";
import useLocationStore from "../store/location";
import clsx from "clsx";
import useWindowStore from "../store/window";

interface FinderProps {
    locationsMap?: Record<string, LocationItem>;
}

const Finder: React.FC<FinderProps> = ({ locationsMap }) => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();

    const openItem = (item: LocationItem) => {
        if (item.fileType === "pdf") return openWindow("resume");
        if (item.kind === "folder") return setActiveLocation(item);
        if (["fig", "url"].includes(item.fileType || "") && item.href) return window.open(item.href, "_blank");
        openWindow(`${item.fileType}${item.kind}`, item);
    };

    const renderList = (name: string, items: LocationItem[] = []) => (
        <div className="mb-4 last:mb-0">
            <h3 className="text-xs font-medium text-gray-400 mb-1">{name}</h3>
            <ul className="space-y-1">
                {items.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => setActiveLocation(item)}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-md cursor-default transition-colors",
                            item.id === activeLocation?.id ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        <img className="w-4 h-4 object-contain" src={item.icon} alt={item.name} />
                        <p className="text-sm font-medium truncate">{item.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

    const favorites = locationsMap ? Object.values(locationsMap) : [];
    const myProjects = locationsMap?.work?.children || [];
    const currentActive = activeLocation || favorites[0];

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <div id="window-header" className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400 flex-shrink-0">
                <WindowControls target="finder" />
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">{currentActive?.name || "Finder"}</span>
                </div>
                <Search className="icon p-1 hover:bg-gray-200 rounded cursor-default w-5 h-5 text-gray-500" />
            </div>
            <div className="bg-white flex flex-1 overflow-hidden min-h-0">
                <div className="sidebar w-48 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col p-5 space-y-3 overflow-y-auto">
                    {renderList("Favorites", favorites)}
                    {myProjects.length > 0 && renderList("Projects", myProjects)}
                </div>
                <ul className="content flex-1 p-8 bg-white relative overflow-auto min-h-0">
                    {currentActive?.children && currentActive.children.length > 0 ? (
                        currentActive.children.map((item) => (
                            <li
                                className={clsx("absolute flex items-center flex-col gap-3 cursor-default group", item.position || "relative")}
                                onClick={() => openItem(item)}
                                key={item.id}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className="object-contain object-center size-16 relative group-hover:scale-105 transition-transform"
                                />
                                <p className="text-sm text-center font-medium w-40 truncate text-gray-800">{item.name}</p>
                            </li>
                        ))
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                            Empty folder
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

const FinderWindow = WindowWrapper(Finder, "finder");
export default FinderWindow;
