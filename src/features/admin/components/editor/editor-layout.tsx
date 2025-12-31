
import React from 'react';
import { Topbar } from './topbar';
import { FloatingToolbar } from './ui/floating-toolbar';
import { Frame, Element } from '@craftjs/core';
import { Container } from './wrappers/container';
import { PortfolioData } from '@/types/portfolio';
import { EditableHero } from './wrappers/editable-hero';
import { EditableExperience } from './wrappers/editable-experience';
import { EditableProjects } from './wrappers/editable-projects';
import { EditableSkills } from './wrappers/editable-skills';
import { EditableEducation } from './wrappers/editable-education';
import { EditableCertifications } from './wrappers/editable-certifications';
import { EditablePublications } from './wrappers/editable-publications';
import { EditableExtracurricular } from './wrappers/editable-extracurricular';
import { EditableAchievements } from './wrappers/editable-achievements';
import { EditableCoursework } from './wrappers/editable-coursework';
import { EditableCustomSections } from './wrappers/editable-custom-sections';

interface EditorLayoutProps {
    initialData: PortfolioData;
    onReview: (data: PortfolioData) => void;
}

export const EditorLayout = ({ initialData, onReview }: EditorLayoutProps) => {
    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden font-sans text-gray-900">
            {/* Force visibility of RevealOnScroll elements in the editor */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .craft-editor-canvas [style*="opacity: 0"] {
                    opacity: 1 !important;
                    transform: none !important;
                    filter: none !important;
                }
                
                /* Custom Scrollbar to match Modern Theme */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #0f0f0f; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #ffffff; }
            `}} />
            <Topbar initialData={initialData} onReview={onReview} />

            <div className="flex-1 flex overflow-hidden relative">
                <FloatingToolbar />

                <div className="flex-1 h-full overflow-y-auto bg-[#f0f0f0] flex justify-center craft-editor-canvas">
                    <div className="w-full h-full min-h-screen bg-[#050505] shadow-2xl overflow-y-auto font-outfit text-white selection:bg-neon-blue selection:text-black"> {/* Full screen black bg for Modern Theme */}
                        <Frame>
                            <Element is={Container} canvas className="min-h-full pb-20">
                                {initialData.sectionOrder ? (
                                    initialData.sectionOrder.map((sectionId) => {
                                        switch (sectionId) {
                                            case 'hero':
                                                return <EditableHero key={sectionId} personalInfo={initialData.personalInfo} socialProfiles={initialData.socialProfiles} />;
                                            case 'experience':
                                                return initialData.experience && initialData.experience.length > 0 &&
                                                    <EditableExperience
                                                        key={sectionId}
                                                        experience={initialData.experience}
                                                        sectionTitle={initialData.sectionTitles?.experience}
                                                        hidden={initialData.sectionVisibility?.experience}
                                                    />;
                                            case 'skills':
                                                return initialData.skills && initialData.skills.length > 0 &&
                                                    <EditableSkills
                                                        key={sectionId}
                                                        skills={initialData.skills}
                                                        sectionTitle={initialData.sectionTitles?.skills}
                                                        hidden={initialData.sectionVisibility?.skills}
                                                    />;
                                            case 'projects':
                                                return initialData.projects && initialData.projects.length > 0 &&
                                                    <EditableProjects
                                                        key={sectionId}
                                                        projects={initialData.projects}
                                                        sectionTitle={initialData.sectionTitles?.projects}
                                                        hidden={initialData.sectionVisibility?.projects}
                                                    />;
                                            case 'publications':
                                                return initialData.publications && initialData.publications.length > 0 &&
                                                    <EditablePublications
                                                        key={sectionId}
                                                        publications={initialData.publications}
                                                        sectionTitle={initialData.sectionTitles?.publications}
                                                        hidden={initialData.sectionVisibility?.publications}
                                                    />;
                                            case 'achievements':
                                                return initialData.achievements && initialData.achievements.length > 0 &&
                                                    <EditableAchievements
                                                        key={sectionId}
                                                        achievements={initialData.achievements}
                                                        sectionTitle={initialData.sectionTitles?.achievements}
                                                        hidden={initialData.sectionVisibility?.achievements}
                                                    />;
                                            case 'certifications':
                                                return initialData.certifications && initialData.certifications.length > 0 &&
                                                    <EditableCertifications
                                                        key={sectionId}
                                                        certifications={initialData.certifications}
                                                        sectionTitle={initialData.sectionTitles?.certifications}
                                                        hidden={initialData.sectionVisibility?.certifications}
                                                    />;
                                            case 'education':
                                                return initialData.education && initialData.education.length > 0 &&
                                                    <EditableEducation
                                                        key={sectionId}
                                                        education={initialData.education}
                                                        sectionTitle={initialData.sectionTitles?.education}
                                                        hidden={initialData.sectionVisibility?.education}
                                                    />;
                                            case 'extracurricular':
                                                return initialData.extracurricular && initialData.extracurricular.length > 0 &&
                                                    <EditableExtracurricular
                                                        key={sectionId}
                                                        extracurricular={initialData.extracurricular}
                                                        sectionTitle={initialData.sectionTitles?.extracurricular}
                                                        hidden={initialData.sectionVisibility?.extracurricular}
                                                    />;
                                            case 'coursework':
                                                return initialData.coursework && initialData.coursework.length > 0 &&
                                                    <EditableCoursework
                                                        key={sectionId}
                                                        coursework={initialData.coursework}
                                                        sectionTitle={initialData.sectionTitles?.coursework}
                                                        hidden={initialData.sectionVisibility?.coursework}
                                                    />;
                                            case 'customSections':
                                                return initialData.customSections && initialData.customSections.length > 0 &&
                                                    <EditableCustomSections
                                                        key={sectionId}
                                                        customSections={initialData.customSections}
                                                        sectionTitle={initialData.sectionTitles?.customSections} // Note: sectionTitles might not have customSections key in some types, but check PortfolioData interface.
                                                        hidden={initialData.sectionVisibility?.customSections}
                                                    />;
                                            default:
                                                return null;
                                        }
                                    })
                                ) : (
                                    // Fallback for older data without sectionOrder
                                    <>
                                        <EditableHero personalInfo={initialData.personalInfo} socialProfiles={initialData.socialProfiles} />
                                        {initialData.experience && initialData.experience.length > 0 && <EditableExperience experience={initialData.experience} sectionTitle={initialData.sectionTitles?.experience} />}
                                        {initialData.skills && initialData.skills.length > 0 && <EditableSkills skills={initialData.skills} sectionTitle={initialData.sectionTitles?.skills} />}
                                        {initialData.projects && initialData.projects.length > 0 && <EditableProjects projects={initialData.projects} sectionTitle={initialData.sectionTitles?.projects} />}
                                        {initialData.publications && initialData.publications.length > 0 && <EditablePublications publications={initialData.publications} sectionTitle={initialData.sectionTitles?.publications} />}
                                        {initialData.achievements && initialData.achievements.length > 0 && <EditableAchievements achievements={initialData.achievements} sectionTitle={initialData.sectionTitles?.achievements} />}
                                        {initialData.certifications && initialData.certifications.length > 0 && <EditableCertifications certifications={initialData.certifications} sectionTitle={initialData.sectionTitles?.certifications} />}
                                        {initialData.education && initialData.education.length > 0 && <EditableEducation education={initialData.education} sectionTitle={initialData.sectionTitles?.education} />}
                                        {initialData.extracurricular && initialData.extracurricular.length > 0 && <EditableExtracurricular extracurricular={initialData.extracurricular} sectionTitle={initialData.sectionTitles?.extracurricular} />}
                                        {initialData.coursework && initialData.coursework.length > 0 && <EditableCoursework coursework={initialData.coursework} sectionTitle={initialData.sectionTitles?.coursework} />}
                                        {initialData.customSections && initialData.customSections.length > 0 && <EditableCustomSections customSections={initialData.customSections} />}
                                    </>
                                )}
                            </Element>
                        </Frame>
                    </div>
                </div>
            </div>
        </div>
    );
};
