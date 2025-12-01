import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioData } from "@/types/portfolio";

interface NavbarProps {
    data: PortfolioData;
}

const Navbar = ({ data }: NavbarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Collect all links
    const links: { label: string; href: string }[] = [];

    if (data.experience && data.experience.length > 0) links.push({ label: 'Experience', href: '#experience' });
    if (data.skills && data.skills.length > 0) links.push({ label: 'Skills', href: '#skills' });
    if (data.projects && data.projects.length > 0) links.push({ label: 'Projects', href: '#projects' });
    if (data.education && data.education.length > 0) links.push({ label: 'Education', href: '#education' });

    if (data.customSections) {
        data.customSections.forEach(section => {
            links.push({ label: section.title, href: `#${section.title.toLowerCase().replace(/\s+/g, '-')}` });
        });
    }

    if (data.achievements && data.achievements.length > 0) links.push({ label: 'Achievements', href: '#achievements' });
    if (data.certifications && data.certifications.length > 0) links.push({ label: 'Certifications', href: '#certifications' });
    if (data.publications && data.publications.length > 0) links.push({ label: 'Publications', href: '#publications' });
    if (data.extracurricular && data.extracurricular.length > 0) links.push({ label: 'Extracurricular', href: '#extracurricular' });
    if (data.coursework && data.coursework.length > 0) links.push({ label: 'Coursework', href: '#coursework' });

    links.push({ label: 'Contact', href: '#contact' });

    const shouldCollapse = links.length > 6;
    const displayedLinks = shouldCollapse && !isExpanded ? links.slice(0, 4) : links;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10"
        >
            <div className="container mx-auto px-4 py-4 flex items-center">
                {/* Left: Personal Info */}
                <AnimatePresence mode="popLayout">
                    {(!isExpanded || !shouldCollapse) && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="text-2xl font-bold tracking-tighter text-white overflow-hidden whitespace-nowrap mr-auto"
                        >
                            {data.personalInfo.name.split(' ').map(word => word[0].toUpperCase()).join('')}<span className="text-neon-blue">.</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Middle: Links Container */}
                <motion.div
                    layout
                    className={`flex-1 hidden md:flex gap-8 text-sm font-medium text-gray-400 ${isExpanded ? 'justify-center' : 'justify-end'}`}
                >
                    <AnimatePresence mode="popLayout">
                        {displayedLinks.map((link) => (
                            <motion.a
                                layout
                                key={link.label}
                                href={link.href}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="hover:text-white transition-colors whitespace-nowrap"
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Right: Toggle Button (Fixed Position) */}
                {shouldCollapse && (
                    <div className="w-12 flex justify-end ml-4"> {/* Fixed width container for stability */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-white hover:text-gray-300 transition-colors font-bold p-2"
                        >
                            {isExpanded ? '>>' : '<<'}
                        </button>
                    </div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
