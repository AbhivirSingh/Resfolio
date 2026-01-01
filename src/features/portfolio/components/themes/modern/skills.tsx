import React from 'react';
import TiltCard from '@/components/ui/tilt-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { getDynamicGridClass } from '@/core/utils';
import { SkillsSectionProps } from '@/types/portfolio';

const SkillsSection: React.FC<SkillsSectionProps & { sectionTitle?: string }> = ({ skills, sectionTitle }) => {
  return (
    <section id="skills" className="py-20 relative bg-gradient-to-b">
      <div className="container mx-auto px-4">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-gray-700 flex-1" />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green">
              {sectionTitle || "Technical Skills"}
            </h2>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
        </RevealOnScroll>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${getDynamicGridClass(skills.length, 2)} gap-6 max-w-5xl mx-auto`}>
          {skills.map((cat, index) => (
            <RevealOnScroll key={index}>
              <TiltCard key={index} className="h-full" scale={1.03}>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neon-blue mb-4">{cat.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;