"use client";

import React, { useRef, useLayoutEffect, useEffect, useCallback, ComponentType } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "../store/window";
import { animateGenie, cancelGenie } from "../utils/genieManager";

if (typeof window !== "undefined") {
    gsap.registerPlugin(Draggable);
}

const RESIZE_HANDLE_SIZE = 8;

const resizeHandleStyles: Record<string, React.CSSProperties> = {
    n: { top: 0, left: RESIZE_HANDLE_SIZE, right: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE, cursor: "ns-resize" },
    s: { bottom: 0, left: RESIZE_HANDLE_SIZE, right: RESIZE_HANDLE_SIZE, height: RESIZE_HANDLE_SIZE, cursor: "ns-resize" },
    e: { right: 0, top: RESIZE_HANDLE_SIZE, bottom: RESIZE_HANDLE_SIZE, width: RESIZE_HANDLE_SIZE, cursor: "ew-resize" },
    w: { left: 0, top: RESIZE_HANDLE_SIZE, bottom: RESIZE_HANDLE_SIZE, width: RESIZE_HANDLE_SIZE, cursor: "ew-resize" },
    ne: { top: 0, right: 0, width: RESIZE_HANDLE_SIZE * 2, height: RESIZE_HANDLE_SIZE * 2, cursor: "nesw-resize" },
    nw: { top: 0, left: 0, width: RESIZE_HANDLE_SIZE * 2, height: RESIZE_HANDLE_SIZE * 2, cursor: "nwse-resize" },
    se: { bottom: 0, right: 0, width: RESIZE_HANDLE_SIZE * 2, height: RESIZE_HANDLE_SIZE * 2, cursor: "nwse-resize" },
    sw: { bottom: 0, left: 0, width: RESIZE_HANDLE_SIZE * 2, height: RESIZE_HANDLE_SIZE * 2, cursor: "nesw-resize" },
};

const getDockIconEl = (windowKey: string): HTMLElement | null => {
    const thumb = document.querySelector<HTMLElement>(`[data-minimized-key="${windowKey}"] .dock-icon`);
    if (thumb) return thumb;
    const icon = document.querySelector<HTMLElement>(`[data-window-key="${windowKey}"] .dock-icon`);
    return icon;
};

const WindowWrapper = <P extends object>(
    Component: ComponentType<P>,
    windowKey: string
) => {
    const Wrapped: React.FC<P> = (props) => {
        const { focusWindow, windows, finishRestore } = useWindowStore();
        const win = windows[windowKey] || { isOpen: false, zIndex: 1000, isMaximized: false, isMinimized: false };
        const { isOpen, zIndex, isMaximized, isMinimized } = win;
        const ref = useRef<HTMLElement>(null);
        const preMaxRef = useRef<any>(null);
        const draggableRef = useRef<any>(null);
        const animatingRef = useRef(false);
        const prevMinimized = useRef(false);

        // Open animation
        useEffect(() => {
            const el = ref.current;
            if (!el || !isOpen) return;
            if (isMinimized) return;
            el.style.display = "flex";
            el.style.visibility = "visible";
            gsap.fromTo(
                el,
                { scale: 0.0, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, ease: "power3.out", duration: 0.4 }
            );
        }, [isOpen, isMinimized]);

        // Setup draggable
        useEffect(() => {
            const el = ref.current;
            if (!el || !isOpen) return;
            const header = el.querySelector("#window-header");
            const instances = Draggable.create(el, {
                trigger: header || el,
                cursor: "default",
                activeCursor: "default",
                onPress: () => focusWindow(windowKey),
            });
            draggableRef.current = instances[0];

            return () => {
                if (instances[0]) instances[0].kill();
            };
        }, [isOpen, focusWindow, windowKey]);

        // Handle visibility and minimize/restore animations
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;

            if (isMinimized && !prevMinimized.current && !animatingRef.current) {
                animatingRef.current = true;
                const dockIcon = getDockIconEl(windowKey);

                if (!dockIcon) {
                    el.style.display = "none";
                    animatingRef.current = false;
                    prevMinimized.current = true;
                    return;
                }

                el.style.display = "block";

                animateGenie(el, dockIcon, "minimize", () => {
                    el.style.display = "none";
                    animatingRef.current = false;
                });
            } else if (!isMinimized && prevMinimized.current && !animatingRef.current) {
                animatingRef.current = true;

                el.style.display = "block";
                el.style.opacity = "0";

                requestAnimationFrame(() => {
                    const dockIcon = getDockIconEl(windowKey);
                    if (!dockIcon) {
                        el.style.opacity = "1";
                        animatingRef.current = false;
                        return;
                    }

                    animateGenie(el, dockIcon, "restore", () => {
                        el.style.opacity = "1";
                        animatingRef.current = false;
                        finishRestore(windowKey);
                        if (draggableRef.current) {
                            draggableRef.current.update();
                        }
                    });
                });
            } else if (!animatingRef.current) {
                if (isMinimized) {
                    el.style.display = "none";
                } else if (isOpen) {
                    el.style.display = "flex";
                    el.style.visibility = "visible";
                    el.style.opacity = "1";
                } else {
                    el.style.display = "none";
                }
            }

            prevMinimized.current = isMinimized;
        }, [isMinimized, isOpen, finishRestore, windowKey]);

        // Maximize animation
        useEffect(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            if (isMaximized) {
                const rect = el.getBoundingClientRect();
                preMaxRef.current = {
                    top: el.style.top,
                    left: el.style.left,
                    width: el.style.width,
                    height: el.style.height,
                    maxWidth: el.style.maxWidth,
                    transform: el.style.transform,
                    rectTop: rect.top,
                    rectLeft: rect.left,
                    rectWidth: rect.width,
                    rectHeight: rect.height,
                };

                if (draggableRef.current) draggableRef.current.disable();

                el.style.position = "fixed";
                el.style.transform = "none";
                el.style.maxWidth = "100vw";

                gsap.fromTo(
                    el,
                    {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        borderRadius: "12px",
                    },
                    {
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        borderRadius: "0px",
                        duration: 0.35,
                        ease: "power2.inOut",
                    }
                );
            } else if (preMaxRef.current) {
                const prev = preMaxRef.current;

                gsap.to(el, {
                    top: prev.rectTop,
                    left: prev.rectLeft,
                    width: prev.rectWidth,
                    height: prev.rectHeight,
                    borderRadius: "12px",
                    duration: 0.35,
                    ease: "power2.inOut",
                    onComplete: () => {
                        el.style.position = "absolute";
                        el.style.width = prev.width;
                        el.style.height = prev.height;
                        el.style.top = prev.top;
                        el.style.left = prev.left;
                        el.style.maxWidth = prev.maxWidth;
                        el.style.transform = prev.transform;
                        el.style.borderRadius = "";
                        preMaxRef.current = null;

                        if (draggableRef.current) {
                            draggableRef.current.enable();
                            draggableRef.current.update();
                        }
                    },
                });
            }
        }, [isMaximized, isOpen]);

        useEffect(() => {
            return () => cancelGenie();
        }, []);

        const handleResize = useCallback(
            (direction: string, e: React.PointerEvent) => {
                e.preventDefault();
                e.stopPropagation();
                focusWindow(windowKey);

                const el = ref.current;
                if (!el || isMaximized) return;

                const startX = e.clientX;
                const startY = e.clientY;
                const startRect = el.getBoundingClientRect();
                const startWidth = startRect.width;
                const startHeight = startRect.height;
                const startTop = startRect.top;
                const startLeft = startRect.left;

                const onPointerMove = (moveEvent: PointerEvent) => {
                    const dx = moveEvent.clientX - startX;
                    const dy = moveEvent.clientY - startY;

                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newTop = startTop;
                    let newLeft = startLeft;

                    if (direction.includes("e")) newWidth = Math.max(200, startWidth + dx);
                    if (direction.includes("w")) {
                        newWidth = Math.max(200, startWidth - dx);
                        newLeft = startLeft + (startWidth - newWidth);
                    }
                    if (direction.includes("s")) newHeight = Math.max(100, startHeight + dy);
                    if (direction.includes("n")) {
                        newHeight = Math.max(100, startHeight - dy);
                        newTop = startTop + (startHeight - newHeight);
                    }

                    el.style.width = `${newWidth}px`;
                    el.style.height = `${newHeight}px`;
                    el.style.top = `${newTop}px`;
                    el.style.left = `${newLeft}px`;
                    el.style.maxWidth = "none";
                    el.style.minWidth = "0px";
                    el.style.minHeight = "0px";
                    el.style.transform = "none";
                };

                const onPointerUp = () => {
                    document.removeEventListener("pointermove", onPointerMove);
                    document.removeEventListener("pointerup", onPointerUp);
                    document.body.style.cursor = "";
                    document.body.style.userSelect = "";

                    if (draggableRef.current) {
                        draggableRef.current.update();
                    }
                };

                document.body.style.cursor = resizeHandleStyles[direction]?.cursor || "default";
                document.body.style.userSelect = "none";
                document.addEventListener("pointermove", onPointerMove);
                document.addEventListener("pointerup", onPointerUp);
            },
            [focusWindow, isMaximized]
        );

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{
                    zIndex,
                    overflow: isMaximized ? "auto" : "hidden",
                    display: isOpen ? "flex" : "none",
                    flexDirection: "column",
                }}
                className="absolute"
                onMouseDown={() => focusWindow(windowKey)}
            >
                <Component {...props} />
                {!isMaximized &&
                    Object.entries(resizeHandleStyles).map(([dir, style]) => (
                        <div
                            key={dir}
                            style={{ position: "absolute", zIndex: 10, ...style }}
                            onPointerDown={(e) => handleResize(dir, e)}
                        />
                    ))}
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
    return Wrapped;
};

export default WindowWrapper;
