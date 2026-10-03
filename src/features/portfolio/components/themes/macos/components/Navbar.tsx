"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { navIcons, navLinks } from "../constants";
import useWindowStore from "../store/window";

interface NavbarProps {
    name?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ name = "Abhivir" }) => {
    const { openWindow } = useWindowStore();
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        setCurrentTime(dayjs().format("ddd MMM D h:mm A"));
        const timer = setInterval(() => {
            setCurrentTime(dayjs().format("ddd MMM D h:mm A"));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <nav className="flex justify-between items-center bg-white/50 backdrop-blur-3xl p-2 px-5 select-none z-40 relative">
            <div className="flex items-center max-sm:w-full max-sm:justify-center gap-5">
                <img src="/images/logo.svg" alt="logo" className="w-4 h-4" />
                <p className="font-bold text-sm text-black">{name}'s Portfolio</p>
                <ul className="flex items-center gap-5 max-sm:hidden">
                    {navLinks.map(({ id, name: linkName, type }) => (
                        <li key={id} onClick={() => openWindow(type)} className="cursor-default">
                            <p className="text-sm cursor-default hover:underline transition-all text-black">{linkName}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center gap-5 max-sm:hidden">
                <ul className="flex items-center gap-5">
                    {navIcons.map(({ id, img }) => (
                        <li key={id}>
                            <img src={img} className="icon p-1 hover:bg-gray-200 rounded cursor-default w-6 h-6" alt={`icon-${id}`} />
                        </li>
                    ))}
                </ul>
                <time className="text-sm font-medium text-black min-w-[130px] text-right">
                    {currentTime || dayjs().format("ddd MMM D h:mm A")}
                </time>
            </div>
        </nav>
    );
};

export default Navbar;
