import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { getDynamicGridClass } from '@/core/utils';

interface CustomSectionsProps {
    data: PortfolioData['customSections'];
}

const CustomSections = ({ data }: CustomSectionsProps) => {
    if (!data || data.length === 0) return null;

    return (
        <>
            {data.map((section, idx) => (
                <section key={idx} id={section.title.toLowerCase().replace(/\s+/g, '-')} className="py-20 container mx-auto px-4">
                    <RevealOnScroll>
                        <div className="flex items-center gap-4 mb-16">
                            <div className="h-px bg-gray-700 flex-1" />
                            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                {section.title}
                            </h2>
                            <div className="h-px bg-gray-700 flex-1" />
                        </div>
                    </RevealOnScroll>

                    <div className={`grid grid-cols-1 md:grid-cols-2 ${getDynamicGridClass(section.items.length, 2)} gap-6 max-w-5xl mx-auto`}>
                        {section.items.map((item, itemIdx) => (
                            <RevealOnScroll key={itemIdx} delay={itemIdx * 0.1} className="h-full">
                                <div className="group relative h-full p-1 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 hover:from-cyan-500/50 hover:to-blue-500/50 transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative h-full bg-black/80 backdrop-blur-xl rounded-xl p-8 border border-white/10 group-hover:border-white/20 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-2 h-2 mt-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                            <p className="text-gray-300 text-lg leading-relaxed font-light">
                                                {item}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </section>
            ))}
        </>
    );
};

export default CustomSections;
