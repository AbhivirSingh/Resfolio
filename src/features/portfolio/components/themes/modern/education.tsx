import React from 'react';
import TiltCard from '@/components/ui/tilt-card';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { GraduationCap } from 'lucide-react';
import { EducationSectionProps } from '@/types/portfolio';

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-20 relative">
      <div className="container mx-auto px-4">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-gray-700 flex-1" />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neon-purple">
              Education
            </h2>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
        </RevealOnScroll>
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <TiltCard className="w-full" scale={1.02}>
              <div className="p-8 bg-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-neon-purple/90 text-sm uppercase tracking-wider">
                        <th className="py-4 px-4">Degree / Certificate</th>
                        <th className="py-4 px-4">Institute / Board</th>
                        <th className="py-4 px-4 text-center">CGPA / %</th>
                        <th className="py-4 px-4 text-right">Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {education.map((edu, index) => (
                        <tr key={index} className="text-gray-300 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                            <GraduationCap size={18} className="text-neon-blue hidden md:block" />
                            {edu.degree}
                          </td>
                          <td className="py-4 px-4">{edu.institute}</td>
                          <td className="py-4 px-4 text-neon-green font-mono">{edu.score}</td>
                          <td className="py-4 px-4 text-gray-500">{edu.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TiltCard>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;