"use client";

import React, { useRef, useEffect } from "react";
import { dockApps as defaultDockApps, locations } from "../constants";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";
import useWindowStore from "../store/window";
import useLocationStore from "../store/location";

const windowToDockIcon: Record<string, string> = {
    finder: "finder.png",
    safari: "safari.png",
    photos: "photos.png",
    contact: "contact.png",
    terminal: "terminal.png",
    txtfile: "txt.png",
    imgfile: "image.png",
    resume: "pdf.png",
    trash: "trash.png",
};

const windowToName: Record<string, string> = {
    finder: "Portfolio",
    safari: "Articles",
    photos: "Gallery",
    contact: "Contact",
    terminal: "Skills",
    txtfile: "Text",
    imgfile: "Image",
    resume: "Resume",
    trash: "Bin",
};

interface DockProps {
    dockApps?: { id: string; name: string; icon: string; canOpen: boolean }[];
}

export const Dock: React.FC<DockProps> = ({ dockApps = defaultDockApps }) => {
    const { openWindow, closeWindow, restoreWindow, windows } = useWindowStore();
    const { setActiveLocation } = useLocationStore();
    const dockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dock = dockRef.current;
        if (!dock) return;
        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcons = (mouseX: number) => {
            const { left } = dock.getBoundingClientRect();
            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2.5 / 20000));
                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: "power1.out",
                });
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            const { left } = dock.getBoundingClientRect();
            const mouseX = e.clientX - left;
            animateIcons(mouseX);
        };

        const resetIcons = () => {
            icons.forEach((icon) => {
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power1.out",
                });
            });
        };

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);
        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        };
    }, []);

    const toggleApp = (app: { id: string; canOpen: boolean }) => {
        if (!app.canOpen) return;

        if (app.id === "trash") {
            const win = windows["finder"];
            if (win && win.isOpen && !win.isMinimized) {
                setActiveLocation(locations.trash);
            } else if (win && win.isMinimized) {
                setActiveLocation(locations.trash);
                restoreWindow("finder");
            } else {
                setActiveLocation(locations.trash);
                openWindow("finder");
            }
            return;
        }

        const win = windows[app.id];
        if (win?.isMinimized) {
            restoreWindow(app.id);
        } else if (win?.isOpen) {
            closeWindow(app.id);
        } else {
            openWindow(app.id);
        }
    };

    const isAppActive = (appId: string) => {
        if (appId === "trash") return false;
        const win = windows[appId];
        return win && (win.isOpen || win.isMinimized);
    };

    const minimizedWindows = Object.entries(windows)
        .filter(([, win]) => win.isMinimized || win.isRestoring)
        .map(([key]) => key);

    return (
        <section id="dock" className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 select-none max-sm:hidden">
            <div ref={dockRef} className="dock-container bg-white/20 backdrop-blur-md justify-between rounded-2xl p-1.5 flex items-end gap-1.5">
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className="relative flex flex-col items-center" data-window-key={id}>
                        <button
                            type="button"
                            className="dock-icon size-14 3xl:size-20 cursor-default flex items-center justify-center transition-transform"
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}
                        >
                            <img
                                src={`/images/${icon}`}
                                alt={name}
                                loading="lazy"
                                className={`object-cover object-center ${canOpen ? "" : "opacity-60"}`}
                            />
                        </button>
                        {isAppActive(id) && <div className="dock-dot" />}
                    </div>
                ))}

                {minimizedWindows.length > 0 && (
                    <>
                        <div className="dock-separator" />
                        {minimizedWindows.map((windowKey) => (
                            <div
                                key={`min-${windowKey}`}
                                className="relative flex flex-col items-center"
                                data-minimized-key={windowKey}
                            >
                                <button
                                    type="button"
                                    className="dock-icon dock-minimized-thumb size-14 3xl:size-20 flex items-center justify-center p-1"
                                    aria-label={`Restore ${windowToName[windowKey] || windowKey}`}
                                    data-tooltip-id="dock-tooltip"
                                    data-tooltip-content={windowToName[windowKey] || windowKey}
                                    data-tooltip-delay-show={150}
                                    onClick={() => restoreWindow(windowKey)}
                                >
                                    <img
                                        src={`/images/${windowToDockIcon[windowKey] || "finder.png"}`}
                                        alt={windowToName[windowKey] || windowKey}
                                        loading="lazy"
                                        className="object-contain size-full"
                                    />
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <Tooltip id="dock-tooltip" place="top" className="tooltip !py-1 !px-3 !w-fit !text-center !text-xs !rounded-md !bg-blue-200 !text-blue-900 !shadow-2xl" />
        </section>
    );
};

export default Dock;
