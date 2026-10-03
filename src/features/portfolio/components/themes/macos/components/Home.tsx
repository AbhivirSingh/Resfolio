"use client";

import React, { useEffect } from "react";
import { LocationItem } from "../constants";
import { clsx } from "clsx";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "../store/window";
import useLocationStore from "../store/location";

interface HomeProps {
    projects?: LocationItem[];
}

export const Home: React.FC<HomeProps> = ({ projects = [] }) => {
    const { setActiveLocation } = useLocationStore();
    const { openWindow } = useWindowStore();

    const handleOpenProjectFinder = (project: LocationItem) => {
        setActiveLocation(project);
        openWindow("finder");
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            Draggable.create(".folder", {
                cursor: "default",
                activeCursor: "default",
            });
        }
    }, [projects]);

    return (
        <section id="home" className="relative z-0 max-sm:hidden">
            <ul>
                {projects.map((project) => (
                    <li
                        key={project.id}
                        className={clsx("group folder absolute z-0 select-none flex items-center flex-col cursor-default", project.windowPosition)}
                        onClick={() => handleOpenProjectFinder(project)}
                    >
                        <img
                            src="/images/folder.png"
                            alt={project.name}
                            className="group-hover:bg-gray-950/10 p-1 rounded-md w-16 h-16 object-contain"
                        />
                        <p className="text-sm text-white text-center px-1 rounded-md group-hover:bg-blue-500 transition-colors max-w-40 truncate">
                            {project.name}
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Home;
