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
                {(data.sectionOrder || [
                    'hero', 'experience', 'skills', 'projects', 'publications',
                    'achievements', 'certifications', 'education', 'coursework',
                    'extracurricular', 'customSections'
                ])
                    .filter(sectionName => !data.sectionVisibility?.[sectionName]) // Filter hidden sections
                    .map((sectionName) => {
                        switch (sectionName) {
                            case 'hero':
                                // Hero is usually always visible if in order, but we can check sectionVisibility too if needed
                                return <Hero key="hero" personalInfo={data.personalInfo} socialProfiles={data.socialProfiles} />;
                            case 'experience':
                                // Filter hidden items
                                const visibleExperience = data.experience?.filter(item => !item.hidden) || [];
                                return visibleExperience.length > 0 && (
                                    <ExperienceSection key="experience" experience={visibleExperience} sectionTitle={data.sectionTitles?.experience} />
                                );
                            case 'skills':
                                // Skills structure is categories -> items. We might need to filter categories if they have a hidden prop (not yet added to type), or just sections.
                                // Assuming skills categories don't have hidden prop yet, just section level.
                                return data.skills && data.skills.length > 0 && (
                                    <SkillsSection key="skills" skills={data.skills} sectionTitle={data.sectionTitles?.skills} />
                                );
                            case 'projects':
                                const visibleProjects = data.projects?.filter(item => !item.hidden) || [];
                                return visibleProjects.length > 0 && (
                                    <ProjectsSection key="projects" projects={visibleProjects} sectionTitle={data.sectionTitles?.projects} />
                                );
                            case 'publications':
                                const visiblePublications = data.publications?.filter(item => !item.hidden) || [];
                                return visiblePublications.length > 0 && (
                                    <PublicationsSection key="publications" publications={visiblePublications} sectionTitle={data.sectionTitles?.publications} />
                                );
                            case 'achievements':
                                // achievements is string[], so no hidden prop per item unless we change schema. 
                                // Just section visibility for now.
                                return data.achievements && data.achievements.length > 0 && (
                                    <Achievements key="achievements" achievements={data.achievements} sectionTitle={data.sectionTitles?.achievements} />
                                );
                            case 'certifications':
                                const visibleCertifications = data.certifications?.filter(item => !item.hidden) || [];
                                return visibleCertifications.length > 0 && (
                                    <CertificationsSection key="certifications" certifications={visibleCertifications} sectionTitle={data.sectionTitles?.certifications} />
                                );
                            case 'education':
                                const visibleEducation = data.education?.filter(item => !item.hidden) || [];
                                return visibleEducation.length > 0 && (
                                    <EducationSection key="education" education={visibleEducation} sectionTitle={data.sectionTitles?.education} />
                                );
                            case 'coursework':
                                // coursework is string[], same as achievements
                                return data.coursework && data.coursework.length > 0 && (
                                    <CourseworkSection key="coursework" coursework={data.coursework} sectionTitle={data.sectionTitles?.coursework} />
                                );
                            case 'extracurricular':
                                const visibleExtracurricular = data.extracurricular?.filter(item => !item.hidden) || [];
                                return visibleExtracurricular.length > 0 && (
                                    <ExtracurricularSection key="extracurricular" extracurricular={visibleExtracurricular} sectionTitle={data.sectionTitles?.extracurricular} />
                                );
                            case 'customSections':
                                // Custom sections might need deep check but for now section level
                                // If items have hidden, filter:
                                // const visibleCustom = data.customSections?.map(s => ({...s, items: s.items.filter(i => !i.hidden)})) ... wait items are strings?
                                return data.customSections && data.customSections.length > 0 && (
                                    <CustomSections key="custom-sections" data={data.customSections} />
                                );
                            default:
                                return null;
                        }
                    })}
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
