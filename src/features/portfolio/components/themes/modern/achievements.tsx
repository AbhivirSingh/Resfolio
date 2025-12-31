import React from 'react';
import { Trophy } from 'lucide-react';
import TiltCard from '@/components/ui/tilt-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';

import { getDynamicGridClass } from '@/lib/utils';

interface AchievementsProps {
    achievements: string[];
    sectionTitle?: string;
}

const Achievements = ({ achievements, sectionTitle }: AchievementsProps) => {
    if (!achievements || achievements.length === 0) return null;

    return (
        <section id="achievements" className="py-20 container mx-auto px-4">
            <RevealOnScroll>
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px bg-gray-700 flex-1" />
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {sectionTitle || "Achievements"}
                    </h2>
                    <div className="h-px bg-gray-700 flex-1" />
                </div>
            </RevealOnScroll>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${getDynamicGridClass(achievements.length, 2)} gap-6 max-w-4xl mx-auto`}>
                {achievements.map((item, idx) => (
                    <RevealOnScroll key={idx} delay={idx * 0.1} className="h-full">
                        <TiltCard className="h-full">
                            <div className="p-6 flex items-start gap-4">
                                <div className="bg-yellow-500/10 p-4 rounded-2xl text-yellow-500 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                    <Trophy size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm mt-1 leading-relaxed">{item}</p>
                                </div>
                            </div>
                        </TiltCard>
                    </RevealOnScroll>
                ))}
            </div>
        </section>
    );
};

export default Achievements;
