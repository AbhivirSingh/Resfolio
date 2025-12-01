import React from 'react';
import { ChevronUp } from 'lucide-react';
import Hero from './hero';
import ExperienceSection from './experience';
import ProjectsSection from './projects';
import EducationSection from './education';
import SkillsSection from './skills';
import CustomSections from './custom-sections';
import Achievements from './achievements';
import CertificationsSection from './certifications';
import PublicationsSection from './publications';
import ExtracurricularSection from './extracurricular';
import CourseworkSection from './coursework';
import Navbar from './navbar';
import Footer from './footer';
import { PortfolioData } from "@/types/portfolio";

export function ModernTheme({ data }: { data: PortfolioData }) {
    const [showScrollTop, setShowScrollTop] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen font-outfit selection:bg-neon-blue selection:text-black bg-[#050505] text-white">
            <style jsx global>{`
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f0f0f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #ffffff; }
      `}</style>

            {/* Navigation */}
            <Navbar data={data} />

            <main className="relative">
                {/* Hero */}
                <Hero personalInfo={data.personalInfo} socialProfiles={data.socialProfiles} />

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <ExperienceSection experience={data.experience} />
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <SkillsSection skills={data.skills} />
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <ProjectsSection projects={data.projects} />
                )}

                {/* Publications */}
                {data.publications && data.publications.length > 0 && (
                    <PublicationsSection publications={data.publications} />
                )}

                {/* Achievements */}
                {data.achievements && data.achievements.length > 0 && (
                    <Achievements achievements={data.achievements} />
                )}

                {/* Certifications */}
                {data.certifications && data.certifications.length > 0 && (
                    <CertificationsSection certifications={data.certifications} />
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <EducationSection education={data.education} />
                )}

                {/* Coursework */}
                {data.coursework && data.coursework.length > 0 && (
                    <CourseworkSection coursework={data.coursework} />
                )}

                {/* Extracurricular */}
                {data.extracurricular && data.extracurricular.length > 0 && (
                    <ExtracurricularSection extracurricular={data.extracurricular} />
                )}

                {/* Custom Sections (Generic) */}
                {data.customSections && data.customSections.length > 0 && (
                    <CustomSections data={data.customSections} />
                )}
            </main>

            {/* Footer */}
            <Footer data={data} />

            {/* Scroll to top */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 p-4 bg-white text-black rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <ChevronUp size={24} />
            </button>

        </div>
    );
}

export default ModernTheme;
