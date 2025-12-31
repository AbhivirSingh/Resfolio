import React from 'react';
import TiltCard from '@/components/ui/tilt-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { BookOpen } from 'lucide-react';
import { CourseworkSectionProps } from '@/types/portfolio';

const CourseworkSection: React.FC<CourseworkSectionProps & { sectionTitle?: string }> = ({ coursework, sectionTitle }) => {
  if (!coursework || coursework.length === 0) return null;

  return (
    <section id="coursework" className="py-20 relative bg-black/30">
      <div className="container mx-auto px-4">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-gray-700 flex-1" />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-gray-200">
              {sectionTitle || "Relevant Coursework"}
            </h2>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
        </RevealOnScroll>

        <div className="max-w-5xl mx-auto">
          <RevealOnScroll>
            <TiltCard className="w-full" disabled={true}>
              <div className="p-8 md:p-12 text-center">
                <div className="flex flex-wrap justify-center gap-4">
                  {coursework.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-neon-blue hover:border-neon-blue/50 hover:bg-neon-blue/5 transition-all duration-300 cursor-default"
                    >
                      <BookOpen size={16} className="text-neon-blue/70" />
                      <span className="font-medium">{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </RevealOnScroll>
        </div>
      </div >
    </section >
  );
};

export default CourseworkSection;