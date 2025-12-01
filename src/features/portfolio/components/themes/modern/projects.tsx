import React from 'react';
import TiltCard from '@/components/ui/tilt-card';
import { Github, ExternalLink, Code2 } from 'lucide-react';
import { PortfolioData } from "@/types/portfolio";
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { getDynamicGridClass } from '@/lib/utils';

interface ProjectsSectionProps {
  projects: PortfolioData["projects"];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <section id="projects" className="py-20 relative bg-black/50">
      <div className="container mx-auto px-4">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-gray-700 flex-1" />
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue text-center">
              Featured Projects
            </h2>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
        </RevealOnScroll>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${getDynamicGridClass(projects.length, 3)} gap-8`}>
          {projects.map((project, index) => (
            <RevealOnScroll key={index}>
              <TiltCard className="h-full" disabled>
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-lg bg-white/5 text-neon-blue">
                      <Code2 size={24} />
                    </div>
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                          <Github size={20} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>

                  <p className="text-sm text-neon-purple mb-4 font-mono">{project.techStack.join(", ")}</p>

                  <div className="flex-grow">
                    <ul className="space-y-2 text-sm text-gray-400">
                      {project.bullets?.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-neon-green/70 font-bold">›</span>
                          {item}
                        </li>
                      ))}
                    </ul>
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

export default ProjectsSection;