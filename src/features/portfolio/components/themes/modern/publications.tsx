import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PortfolioData } from "@/types/portfolio";
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { getDynamicGridClass } from '@/lib/utils';

interface PublicationsSectionProps {
  publications: PortfolioData['publications'];
}

const PublicationsSection: React.FC<PublicationsSectionProps> = ({ publications }) => {
  if (!publications || publications.length === 0) return null;

  return (
    <section id="publications" className="py-20 relative bg-black/50">
      <div className="container mx-auto px-4">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-gray-700 flex-1" />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Publications
            </h2>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
        </RevealOnScroll>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${getDynamicGridClass(publications.length, 2)} gap-8 max-w-6xl mx-auto`}>
          {publications.map((pub, index) => (
            <RevealOnScroll key={index}>
              <div className="h-full">
                <div className="p-8 flex flex-col h-full relative overflow-hidden group bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {pub.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                    {pub.summary}
                  </p>

                  <a
                    href={pub.link}
                    className="inline-flex items-center text-sm font-bold text-white uppercase tracking-wider hover:text-purple-400 transition-colors"
                  >
                    Read Paper <span className="ml-2">→</span>
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

export default PublicationsSection;