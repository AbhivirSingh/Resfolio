import React from 'react';
import TiltCard from '@/components/ui/tilt-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { ExperienceSectionProps } from '@/types/portfolio';

const ExperienceSection: React.FC<ExperienceSectionProps & { sectionTitle?: string }> = ({ experience, sectionTitle }) => {
  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-gray-700 flex-1" />

            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              {sectionTitle || "Experience"}
            </h2>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {experience.map((exp, index) => (
            <RevealOnScroll key={index}>
              <TiltCard key={index} className="w-full">
                <div className="p-8">
                  <div className="flex flex-col gap-1 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors">
                        {exp.company}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>{exp.date}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-neon-blue">
                        <Briefcase size={16} />
                        <span className="font-medium">{exp.role}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {exp.description.split('\n').filter(item => item.trim().length > 0).map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-300">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-neon-purple flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;