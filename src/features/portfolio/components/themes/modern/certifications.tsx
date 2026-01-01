import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { PortfolioData } from "@/types/portfolio";
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { getDynamicGridClass } from '@/core/utils';

interface CertificationsSectionProps {
  certifications: PortfolioData['certifications'];
  sectionTitle?: string;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications, sectionTitle }) => {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-20 relative">
      <div className="container mx-auto px-4">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-gray-700 flex-1" />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white">
              {sectionTitle || "Certifications"}
            </h2>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
        </RevealOnScroll>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${getDynamicGridClass(certifications.length, 3)} gap-6 max-w-4xl mx-auto`}>
          {certifications.map((cert, index) => (
            <RevealOnScroll key={index}>
              <div className="h-full">
                <div className="p-6 flex items-center justify-between gap-4 h-full group bg-white/5 rounded-xl border border-white/10 hover:border-neon-green/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors">
                        {cert.name}
                      </h3>
                      <p className="text-sm text-gray-400">{cert.issuer}</p>
                    </div>
                  </div>
                  <a
                    href={cert.link}
                    className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                    aria-label={`View ${cert.name} certificate`}
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;