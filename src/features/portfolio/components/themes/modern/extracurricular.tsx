import React from 'react';
import TiltCard from '@/components/ui/tilt-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { Zap, Heart, Users } from 'lucide-react';
import { getDynamicGridClass } from '@/lib/utils';
import { ExtracurricularSectionProps } from '@/types/portfolio';

const ExtracurricularSection: React.FC<ExtracurricularSectionProps> = ({ extracurricular }) => {
  if (!extracurricular || extracurricular.length === 0) return null;

  return (
    <section id="extracurricular" className="py-20 relative bg-gradient-to-t from-slate-900/50 to-transparent">
      <div className="container mx-auto px-4">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-gray-700 flex-1" />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Extracurricular
            </h2>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
        </RevealOnScroll>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${getDynamicGridClass(extracurricular.length, 3)} gap-8 max-w-6xl mx-auto`}>
          {extracurricular.map((activity, index) => (
            <RevealOnScroll key={index}>
              <TiltCard key={index} className="h-full">
                <div className="p-6 h-full flex flex-col items-center text-center">
                  <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 text-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.1)]">
                    {index === 0 ? <Zap size={28} /> : index === 1 ? <Heart size={28} /> : <Users size={28} />}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {activity.role}
                  </h3>
                  <p className="text-orange-400 text-sm font-medium mb-4 uppercase tracking-wide">
                    {activity.organization}
                  </p>
                </div>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtracurricularSection;