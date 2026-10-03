"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface WelcomeProps {
    name?: string;
}

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 700, default: 400 },
};

const setupTextHover = (container: HTMLElement | null, type: "subtitle" | "title") => {
    if (!container) return () => {};
    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHTS[type];
    const animateLetter = (letter: HTMLElement, weight: number, duration = 0.25) => {
        return gsap.to(letter, { duration, ease: "power2.out", fontVariationSettings: `'wght' ${weight}` });
    };
    let letterCenters: number[] = [];
    const updateLetterCenters = () => {
        const containerRect = container.getBoundingClientRect();
        letterCenters = Array.from(letters).map((letter) => {
            const rect = letter.getBoundingClientRect();
            return rect.left - containerRect.left + rect.width / 2;
        });
    };
    const handleMouseEnter = () => {
        updateLetterCenters();
    };
    const handleMouseMove = (e: MouseEvent) => {
        if (letterCenters.length === 0) {
            updateLetterCenters();
        }
        const containerRect = container.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        letters.forEach((letter, index) => {
            const center = letterCenters[index];
            if (center === undefined) return;
            const distance = Math.abs(mouseX - center);
            const intensity = Math.exp(-(distance ** 2) / 20000);
            animateLetter(letter as HTMLElement, min + (max - min) * intensity);
        });
    };
    const handleMouseLeave = () => {
        letters.forEach((letter) => {
            animateLetter(letter as HTMLElement, base, 0.3);
        });
        letterCenters = [];
    };
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(updateLetterCenters);
    }

    return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    };
};

const renderText = (text: string, className: string, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={`${className} inline-block transition-all`}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
};

export const Welcome: React.FC<WelcomeProps> = ({ name = "Abhivir" }) => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const titleCleanup = setupTextHover(titleRef.current, "title");
        const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");
        return () => {
            subtitleCleanup();
            titleCleanup();
        };
    }, [name]);

    return (
        <section
            id="welcome"
            className="text-gray-200 flex flex-col justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none max-sm:h-screen max-sm:w-full max-sm:px-10 pointer-events-auto"
        >
            <p ref={subtitleRef} className="text-center">
                {renderText(`Hey, I'm ${name}! Welcome to my`, "text-4xl font-georama", 100)}
            </p>
            <h1 ref={titleRef} className="mt-7 text-center">
                {renderText("portfolio", "text-9xl italic font-georama", 400)}
            </h1>
        </section>
    );
};

export default Welcome;
