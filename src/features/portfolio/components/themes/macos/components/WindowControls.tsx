"use client";

import React from "react";
import useWindowStore from "../store/window";

interface WindowControlsProps {
    target: string;
}

export const WindowControls: React.FC<WindowControlsProps> = ({ target }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, windows } = useWindowStore();
    const isMaximized = windows[target]?.isMaximized ?? false;

    return (
        <div id="window-controls" className="group/controls">
            <div className="close" onClick={() => closeWindow(target)}>
                <span className="control-icon">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="#7f2f30" strokeWidth="2.7" strokeLinecap="round" />
                    </svg>
                </span>
            </div>
            <div
                className={`minimize ${isMaximized ? "is-maximized" : ""}`}
                onClick={() => !isMaximized && minimizeWindow(target)}
            >
                <span className="control-icon">
                    <svg width="8" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1H9" stroke="#7e640c" strokeWidth="2.7" strokeLinecap="round" />
                    </svg>
                </span>
            </div>
            <div className="maximize" onClick={() => maximizeWindow(target)}>
                <span className="control-icon">
                    {isMaximized ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "10px", height: "10px" }}
                            viewBox="-4 -4 40 40"
                        >
                            <g transform="rotate(-135 16 16)">
                                <path d="M 2,2 L 2,30 L 14,16 Z" fill="#1e632d" />
                                <path d="M 30,2 L 30,30 L 18,16 Z" fill="#1e632d" />
                            </g>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="8"
                            height="8"
                            viewBox="0 0 32 32"
                        >
                            <g transform="rotate(-90 16 16)">
                                <path d="M 6.5,2.5 L 29.5,2.5 L 29.5,25.5 Z" fill="#1e632d" />
                                <path d="M 2.5,6.5 L 2.5,29.5 L 25.5,29.5 Z" fill="#1e632d" />
                            </g>
                        </svg>
                    )}
                </span>
            </div>
        </div>
    );
};

export default WindowControls;
