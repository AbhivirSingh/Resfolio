
import React, { useState, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { Plus, X, User, Briefcase, Code2, Cpu, GraduationCap, Award, Book, Users, Trophy, Navigation } from 'lucide-react';

export const FloatingToolbar = () => {
    const { query, enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
    const [isOpen, setIsOpen] = useState(false);
    const [existingSections, setExistingSections] = useState<string[]>([]);

    // Map display names to icons and IDs
    // We assume the component displayNames match these or are contained in them
    const sectionConfig: Record<string, { icon: any, label: string, domId: string }> = {
        'Hero': { icon: User, label: "Hero", domId: "hero" }, // We need to ensure EIditableHero has this ID or similar
        'Experience': { icon: Briefcase, label: "Experience", domId: "experience" },
        'Projects': { icon: Code2, label: "Projects", domId: "projects" },
        'Skills': { icon: Cpu, label: "Skills", domId: "skills" },
        'Education': { icon: GraduationCap, label: "Education", domId: "education" },
        'Certifications': { icon: Award, label: "Certifications", domId: "certifications" },
        'Publications': { icon: Book, label: "Publications", domId: "publications" },
        'Extracurricular': { icon: Users, label: "Activities", domId: "extracurricular" },
        'Achievements': { icon: Trophy, label: "Achievements", domId: "achievements" },
    };

    // Effect to track which sections exist in the editor
    useEffect(() => {
        // This is a naive check. A better way is to subscribe to editor changes.
        // But for now, we can check on open or periodically.
        // Actually, we can use useEditor's connector, but let's just parse nodes on render or open
        const nodes = query.getNodes();
        const root = nodes['ROOT'];
        if (root && root.data.nodes) {
            const found = new Set<string>();
            root.data.nodes.forEach(id => {
                const node = nodes[id];
                const name = node.data.displayName || node.data.name;
                // Check if this name matches any of our known sections
                // The names seem to be "EditableHero", "EditableExperience", etc. based on previous files
                const key = Object.keys(sectionConfig).find(k => name.includes(k));
                if (key) found.add(key);
            });
            setExistingSections(Array.from(found));
        }
    }, [query, isOpen]); // Re-check when menu opens

    if (!enabled) return null;

    const scrollToSection = (key: string) => {
        // We need to ensure the components actually have these IDs. 
        // I will need to verify/add IDs to the wrapper components.
        // Assuming they might not, let's try to find them by DOM structure? 
        // No, IDs are safer. I'll add IDs to the Editable* components in the next step if they don't have them.
        // For now, I'll assume standard IDs like 'section-hero', 'section-experience' etc to avoid conflicts?
        // Or just 'hero', 'experience' as defined in config.
        const id = sectionConfig[key].domId;
        const el = document.getElementById(id);
        // Also try searching for the Craft node element if ID is missing? 
        // Simpler to just enforce IDs in the components.

        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setIsOpen(false);
        } else {
            console.warn(`Section with id ${id} not found`);
        }
    };

    const hasSections = existingSections.length > 0;

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-4 pointer-events-none">
            {/* Menu */}
            {isOpen && (
                <div className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4 animate-in slide-in-from-bottom-10 border border-white/20">
                    {Object.entries(sectionConfig)
                        .filter(([key]) => existingSections.includes(key))
                        .map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => scrollToSection(key)}
                                className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 rounded-xl transition-all hover:scale-105 active:scale-95 group min-w-[80px]"
                            >
                                <div className="p-2 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors text-gray-600 group-hover:text-blue-600">
                                    <config.icon size={20} />
                                </div>
                                <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">{config.label}</span>
                            </button>
                        ))}

                    {/* Fallback if no sections detected (shouldn't happen if portfolio loaded) */}
                    {!hasSections && (
                        <div className="col-span-full text-center text-gray-400 text-sm py-2">
                            No sections detected
                        </div>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all transform hover:scale-105 active:scale-95 ${isOpen ? 'bg-gray-800 rotate-45' : 'bg-black'} text-white border-4 border-white`}
            >
                {isOpen ? <Plus size={24} /> : <Navigation size={24} />}
                {/* Changed icon to Navigation when closed to indicate it's a navigator, or keep Plus if user thinks of it as "More info"? 
                   User said "display sections... and redirect". Navigation/Menu icon seems better than Plus if it doesn't add anything.
                   But "Plus" was the original. Let's use Navigation or Layout icon. "Navigation" is good.
                */}
            </button>
        </div>
    );
};
