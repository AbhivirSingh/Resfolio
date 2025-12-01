"use client";

import { PortfolioData } from "@/types/portfolio";
import { Save } from "lucide-react";
import { useResumeReview } from "../../hooks/use-resume-review";
import { FieldRow } from "./field-row";
import { ManualMergeModal } from "./manual-merge-modal";
import { ReviewSection } from "./review-section";
import { ReviewState, ReviewField } from "../../types";

interface ResumeReviewProps {
    initialData: PortfolioData;
    onSave: (data: PortfolioData) => void;
    onCancel: () => void;
}

const transformStateToData = (state: ReviewState, initialData: PortfolioData): PortfolioData => {
    const val = (field: ReviewField<any>) => field.value;

    const mapList = <T extends { visible: boolean }, R>(
        list: T[],
        transform: (item: T) => R
    ): R[] => list.filter(i => i.visible).map(transform);

    return {
        personalInfo: {
            name: val(state.personalInfo.name),
            title: val(state.personalInfo.title),
            bio: val(state.personalInfo.bio),
            email: val(state.personalInfo.email),
            phone: initialData.personalInfo.phone,
            location: initialData.personalInfo.location,
            image: initialData.personalInfo.image
        },
        socialProfiles: {
            github: val(state.socialProfiles.github),
            linkedin: val(state.socialProfiles.linkedin),
            leetcode: val(state.socialProfiles.leetcode),
            hackerrank: val(state.socialProfiles.hackerrank),
            geeksforgeeks: val(state.socialProfiles.geeksforgeeks),
            codeforces: val(state.socialProfiles.codeforces),
            codechef: val(state.socialProfiles.codechef),
            kaggle: val(state.socialProfiles.kaggle),
        },
        skills: state.skills.visible ? mapList(state.skills.items, cat => ({
            category: val(cat.category),
            items: mapList(cat.items, i => val(i))
        })) : [],
        experience: state.experience.visible ? mapList(state.experience.items, exp => ({
            id: exp.id,
            company: val(exp.company),
            role: val(exp.role),
            date: val(exp.date),
            description: val(exp.description),
            status: exp.status,
            mergeGroupId: exp.mergeGroupId
        })) : [],
        projects: state.projects.visible ? mapList(state.projects.items, proj => ({
            id: proj.id,
            title: val(proj.title),
            techStack: mapList(proj.techStack, t => val(t)),
            githubUrl: val(proj.githubUrl),
            liveUrl: val(proj.liveUrl),
            bullets: mapList(proj.bullets, b => val(b)),
            status: proj.status,
            mergeGroupId: proj.mergeGroupId
        })) : [],
        education: state.education.visible ? mapList(state.education.items, edu => ({
            id: edu.id,
            degree: val(edu.degree),
            institute: val(edu.institute),
            year: val(edu.year),
            score: val(edu.score),
            status: edu.status,
            mergeGroupId: edu.mergeGroupId
        })) : [],
        certifications: state.certifications.visible ? mapList(state.certifications.items, cert => ({
            id: cert.id,
            name: val(cert.name),
            issuer: val(cert.issuer),
            link: val(cert.link),
            status: cert.status,
            mergeGroupId: cert.mergeGroupId
        })) : [],
        publications: state.publications.visible ? mapList(state.publications.items, pub => ({
            id: pub.id,
            title: val(pub.title),
            summary: val(pub.summary),
            link: val(pub.link),
            status: pub.status,
            mergeGroupId: pub.mergeGroupId
        })) : [],
        extracurricular: state.extracurricular.visible ? mapList(state.extracurricular.items, extra => ({
            id: extra.id,
            role: val(extra.role),
            organization: val(extra.organization),
            status: extra.status,
            mergeGroupId: extra.mergeGroupId
        })) : [],
        coursework: state.coursework.visible ? mapList(state.coursework.items, c => val(c.value)) : [],
        achievements: state.achievements.visible ? mapList(state.achievements.items, a => val(a.value)) : [],
        customSections: state.customSections.visible ? mapList(state.customSections.items, sec => ({
            id: sec.id,
            title: val(sec.title),
            items: mapList(sec.items, i => val(i))
        })) : []
    };
};

export function ResumeReview({ initialData, onSave, onCancel }: ResumeReviewProps) {
    const {
        state,
        editingId,
        setEditingId,
        tempValue,
        setTempValue,
        mergeModalOpen,
        setMergeModalOpen,
        mergeSection,
        selectedForMerge,
        setSelectedForMerge,
        setMergeSection: setMergeSectionState,
        toggle,
        update,
        handleManualMerge,
        executeMerge
    } = useResumeReview(initialData);

    const handleSave = () => {
        if (!state) return;
        onSave(transformStateToData(state, initialData));
    };

    if (!state) return <div>Loading...</div>;

    const commonFieldProps = {
        editingId,
        setEditingId,
        tempValue,
        setTempValue,
        toggle,
        update
    };

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-4 border-b">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Review Parsed Data</h1>
                        <p className="text-gray-500">Review and edit the extracted information before saving.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            <Save size={18} />
                            Save Portfolio
                        </button>
                    </div>
                </div>

                <div className="space-y-8 pb-20">
                    <section className="bg-white border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                Personal Information
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FieldRow label="Full Name" value={state.personalInfo.name.value} visible={state.personalInfo.name.visible} path={["personalInfo", "name"]} {...commonFieldProps} />
                            <FieldRow label="Job Title" value={state.personalInfo.title.value} visible={state.personalInfo.title.visible} path={["personalInfo", "title"]} {...commonFieldProps} />
                            <FieldRow label="Email" value={state.personalInfo.email.value} visible={state.personalInfo.email.visible} path={["personalInfo", "email"]} {...commonFieldProps} />
                            <div className="md:col-span-2">
                                <FieldRow label="Bio" value={state.personalInfo.bio.value} visible={state.personalInfo.bio.visible} path={["personalInfo", "bio"]} multiline {...commonFieldProps} />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                Social Profiles
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.keys(state.socialProfiles).map((key) => {
                                if (key === 'visible') return null;
                                const field = state.socialProfiles[key as keyof typeof state.socialProfiles] as ReviewField<string>;
                                return (
                                    <FieldRow
                                        key={key}
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        value={field.value}
                                        visible={field.visible}
                                        path={["socialProfiles", key]}
                                        {...commonFieldProps}
                                    />
                                );
                            })}
                        </div>
                    </section>

                    <section className="border rounded-xl overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={state.skills.visible}
                                onChange={() => toggle(["skills", "visible"])}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600"
                            />
                            <h2 className="font-bold text-gray-900">Skills</h2>
                        </div>
                        {state.skills.visible && (
                            <div className="divide-y">
                                {state.skills.items.map((cat, idx) => (
                                    <div key={cat.id} className={`p-4 ${!cat.visible ? 'bg-gray-50' : ''}`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <input
                                                type="checkbox"
                                                checked={cat.visible}
                                                onChange={() => toggle(["skills", "items", idx.toString(), "visible"])}
                                                className="w-4 h-4 rounded border-gray-300"
                                            />
                                            <span className="font-semibold text-gray-700">{cat.category.value}</span>
                                        </div>

                                        {cat.visible && (
                                            <div className="pl-7 grid gap-2">
                                                <FieldRow
                                                    label="Category Name"
                                                    value={cat.category.value}
                                                    visible={cat.category.visible}
                                                    path={["skills", "items", idx.toString(), "category"]}
                                                    {...commonFieldProps}
                                                />
                                                <div className="mt-2">
                                                    <div className="text-xs font-medium text-gray-500 mb-2">Items</div>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                        {cat.items.map((item, iIdx) => (
                                                            <FieldRow
                                                                key={iIdx}
                                                                label={`Item ${iIdx + 1}`}
                                                                value={item.value}
                                                                visible={item.visible}
                                                                path={["skills", "items", idx.toString(), "items", iIdx.toString()]}
                                                                {...commonFieldProps}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <ReviewSection
                        title="Experience"
                        items={state.experience.items}
                        sectionKey="experience"
                        visible={state.experience.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldRow label="Company" value={item.company.value} visible={item.company.visible} path={["experience", "items", idx.toString(), "company"]} {...commonFieldProps} />
                                <FieldRow label="Role" value={item.role.value} visible={item.role.visible} path={["experience", "items", idx.toString(), "role"]} {...commonFieldProps} />
                                <FieldRow label="Date" value={item.date.value} visible={item.date.visible} path={["experience", "items", idx.toString(), "date"]} {...commonFieldProps} />
                                <div className="md:col-span-2">
                                    <FieldRow label="Description" value={item.description.value} visible={item.description.visible} path={["experience", "items", idx.toString(), "description"]} multiline {...commonFieldProps} />
                                </div>
                            </div>
                        )}
                    />

                    <ReviewSection
                        title="Projects"
                        items={state.projects.items}
                        sectionKey="projects"
                        visible={state.projects.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldRow label="Title" value={item.title.value} visible={item.title.visible} path={["projects", "items", idx.toString(), "title"]} {...commonFieldProps} />
                                <FieldRow label="GitHub URL" value={item.githubUrl.value} visible={item.githubUrl.visible} path={["projects", "items", idx.toString(), "githubUrl"]} {...commonFieldProps} />
                                <FieldRow label="Live URL" value={item.liveUrl.value} visible={item.liveUrl.visible} path={["projects", "items", idx.toString(), "liveUrl"]} {...commonFieldProps} />
                                <div className="md:col-span-2">
                                    <div className="text-xs font-medium text-gray-500 mb-2">Tech Stack</div>
                                    <div className="flex flex-wrap gap-2">
                                        {item.techStack.map((tech: any, tIdx: number) => (
                                            <FieldRow key={tIdx} label={`Tech ${tIdx + 1}`} value={tech.value} visible={tech.visible} path={["projects", "items", idx.toString(), "techStack", tIdx.toString()]} {...commonFieldProps} />
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="text-xs font-medium text-gray-500 mb-2">Bullets</div>
                                    <div className="space-y-2">
                                        {item.bullets.map((bullet: any, bIdx: number) => (
                                            <FieldRow key={bIdx} label={`Bullet ${bIdx + 1}`} value={bullet.value} visible={bullet.visible} path={["projects", "items", idx.toString(), "bullets", bIdx.toString()]} multiline {...commonFieldProps} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    />

                    <ReviewSection
                        title="Education"
                        items={state.education.items}
                        sectionKey="education"
                        visible={state.education.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldRow label="Degree" value={item.degree.value} visible={item.degree.visible} path={["education", "items", idx.toString(), "degree"]} {...commonFieldProps} />
                                <FieldRow label="Institute" value={item.institute.value} visible={item.institute.visible} path={["education", "items", idx.toString(), "institute"]} {...commonFieldProps} />
                                <FieldRow label="Year" value={item.year.value} visible={item.year.visible} path={["education", "items", idx.toString(), "year"]} {...commonFieldProps} />
                                <FieldRow label="Score" value={item.score.value} visible={item.score.visible} path={["education", "items", idx.toString(), "score"]} {...commonFieldProps} />
                            </div>
                        )}
                    />

                    <ReviewSection
                        title="Certifications"
                        items={state.certifications.items}
                        sectionKey="certifications"
                        visible={state.certifications.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldRow label="Name" value={item.name.value} visible={item.name.visible} path={["certifications", "items", idx.toString(), "name"]} {...commonFieldProps} />
                                <FieldRow label="Issuer" value={item.issuer.value} visible={item.issuer.visible} path={["certifications", "items", idx.toString(), "issuer"]} {...commonFieldProps} />
                                <div className="md:col-span-2">
                                    <FieldRow label="Link" value={item.link.value} visible={item.link.visible} path={["certifications", "items", idx.toString(), "link"]} {...commonFieldProps} />
                                </div>
                            </div>
                        )}
                    />

                    <ReviewSection
                        title="Publications"
                        items={state.publications.items}
                        sectionKey="publications"
                        visible={state.publications.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldRow label="Title" value={item.title.value} visible={item.title.visible} path={["publications", "items", idx.toString(), "title"]} {...commonFieldProps} />
                                <FieldRow label="Link" value={item.link.value} visible={item.link.visible} path={["publications", "items", idx.toString(), "link"]} {...commonFieldProps} />
                                <div className="md:col-span-2">
                                    <FieldRow label="Summary" value={item.summary.value} visible={item.summary.visible} path={["publications", "items", idx.toString(), "summary"]} multiline {...commonFieldProps} />
                                </div>
                            </div>
                        )}
                    />

                    <ReviewSection
                        title="Extracurricular"
                        items={state.extracurricular.items}
                        sectionKey="extracurricular"
                        visible={state.extracurricular.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FieldRow label="Role" value={item.role.value} visible={item.role.visible} path={["extracurricular", "items", idx.toString(), "role"]} {...commonFieldProps} />
                                <FieldRow label="Organization" value={item.organization.value} visible={item.organization.visible} path={["extracurricular", "items", idx.toString(), "organization"]} {...commonFieldProps} />
                            </div>
                        )}
                    />

                    <ReviewSection
                        title="Coursework"
                        items={state.coursework.items}
                        sectionKey="coursework"
                        visible={state.coursework.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="w-full">
                                <FieldRow label="Course" value={item.value.value} visible={item.value.visible} path={["coursework", "items", idx.toString(), "value"]} {...commonFieldProps} />
                            </div>
                        )}
                    />

                    <ReviewSection
                        title="Achievements"
                        items={state.achievements.items}
                        sectionKey="achievements"
                        visible={state.achievements.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="w-full">
                                <FieldRow label="Achievement" value={item.value.value} visible={item.value.visible} path={["achievements", "items", idx.toString(), "value"]} multiline {...commonFieldProps} />
                            </div>
                        )}
                    />

                    <ReviewSection
                        title="Custom Sections"
                        items={state.customSections.items}
                        sectionKey="customSections"
                        visible={state.customSections.visible}
                        toggle={toggle}
                        selectedForMerge={selectedForMerge}
                        setSelectedForMerge={setSelectedForMerge}
                        mergeSection={mergeSection}
                        setMergeSection={setMergeSectionState}
                        handleManualMerge={handleManualMerge}
                        renderFields={(item, idx) => (
                            <div className="w-full">
                                <FieldRow label="Title" value={item.title.value} visible={item.title.visible} path={["customSections", "items", idx.toString(), "title"]} {...commonFieldProps} />
                                <div className="mt-2 space-y-2">
                                    {item.items.map((subItem: any, sIdx: number) => (
                                        <FieldRow key={sIdx} label={`Item ${sIdx + 1}`} value={subItem.value} visible={subItem.visible} path={["customSections", "items", idx.toString(), "items", sIdx.toString()]} {...commonFieldProps} />
                                    ))}
                                </div>
                            </div>
                        )}
                    />

                </div>
            </div>

            {state && (
                <ManualMergeModal
                    isOpen={mergeModalOpen}
                    onClose={() => setMergeModalOpen(false)}
                    sectionName={mergeSection}
                    items={
                        (mergeSection &&
                            mergeSection !== 'socialProfiles' &&
                            mergeSection !== 'personalInfo' &&
                            (state as any)[mergeSection]?.items) || []
                    }
                    selectedIds={selectedForMerge}
                    onConfirm={executeMerge}
                />
            )}
        </div>
    );
}
