import { useState, useEffect } from "react";
import { PortfolioData } from "@/types/portfolio";
import { ReviewState, ReviewField } from "../types";

const createField = <T>(value: T): ReviewField<T> => ({ value, visible: true });

const generateId = () => Math.random().toString(36).slice(2, 11);

export function useResumeReview(initialData: PortfolioData) {
    const [state, setState] = useState<ReviewState | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState("");

    const [mergeModalOpen, setMergeModalOpen] = useState(false);
    const [mergeSection, setMergeSection] = useState<string | null>(null);
    const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);

    useEffect(() => {
        if (!initialData) return;

        const { personalInfo, socialProfiles, skills, experience, projects, education, certifications, publications, extracurricular, coursework, achievements, customSections } = initialData;

        setState({
            personalInfo: {
                visible: true,
                name: createField(personalInfo.name),
                title: createField(personalInfo.title),
                bio: createField(personalInfo.bio),
                email: createField(personalInfo.email),
            },
            socialProfiles: {
                visible: true,
                github: createField(socialProfiles?.github || ""),
                linkedin: createField(socialProfiles?.linkedin || ""),
                leetcode: createField(socialProfiles?.leetcode || ""),
                hackerrank: createField(socialProfiles?.hackerrank || ""),
                geeksforgeeks: createField(socialProfiles?.geeksforgeeks || ""),
                codeforces: createField(socialProfiles?.codeforces || ""),
                codechef: createField(socialProfiles?.codechef || ""),
                kaggle: createField(socialProfiles?.kaggle || ""),
            },
            skills: {
                visible: true,
                items: skills.map(cat => ({
                    id: generateId(),
                    visible: true,
                    category: createField(cat.category),
                    items: cat.items.map(createField)
                }))
            },
            experience: {
                visible: true,
                items: experience.map(exp => ({
                    ...exp,
                    id: exp.id || generateId(),
                    visible: true,
                    company: createField(exp.company),
                    role: createField(exp.role),
                    date: createField(exp.date),
                    description: createField(exp.description)
                }))
            },
            projects: {
                visible: true,
                items: projects.map(proj => ({
                    ...proj,
                    id: proj.id || generateId(),
                    visible: true,
                    title: createField(proj.title),
                    techStack: proj.techStack.map(createField),
                    githubUrl: createField(proj.githubUrl || ""),
                    liveUrl: createField(proj.liveUrl || ""),
                    bullets: (proj.bullets || []).map(createField)
                }))
            },
            education: {
                visible: true,
                items: education.map(edu => ({
                    ...edu,
                    id: edu.id || generateId(),
                    visible: true,
                    degree: createField(edu.degree),
                    institute: createField(edu.institute),
                    year: createField(edu.year),
                    score: createField(edu.score)
                }))
            },
            certifications: {
                visible: true,
                items: certifications.map(cert => ({
                    ...cert,
                    id: cert.id || generateId(),
                    visible: true,
                    name: createField(cert.name),
                    issuer: createField(cert.issuer),
                    link: createField(cert.link)
                }))
            },
            publications: {
                visible: true,
                items: publications.map(pub => ({
                    ...pub,
                    id: pub.id || generateId(),
                    visible: true,
                    title: createField(pub.title),
                    summary: createField(pub.summary),
                    link: createField(pub.link)
                }))
            },
            extracurricular: {
                visible: true,
                items: extracurricular.map(extra => ({
                    ...extra,
                    id: extra.id || generateId(),
                    visible: true,
                    role: createField(extra.role),
                    organization: createField(extra.organization)
                }))
            },
            coursework: {
                visible: true,
                items: (coursework || []).map(c => ({
                    id: generateId(),
                    visible: true,
                    value: createField(c)
                }))
            },
            achievements: {
                visible: true,
                items: (achievements || []).map(a => ({
                    id: generateId(),
                    visible: true,
                    value: createField(a)
                }))
            },
            customSections: {
                visible: true,
                items: (customSections || []).map(sec => ({
                    id: sec.id || generateId(),
                    visible: true,
                    title: createField(sec.title),
                    items: sec.items.map(createField)
                }))
            }
        });
    }, [initialData]);

    const setIn = (obj: any, path: string[], value: any): any => {
        if (path.length === 0) return value;
        const [head, ...tail] = path;
        const next = obj[head];

        return {
            ...obj,
            [head]: path.length === 1 ? value : setIn(next, tail, value)
        };
    };

    const getIn = (obj: any, path: string[]): any => {
        return path.reduce((acc, key) => acc?.[key], obj);
    };

    const toggle = (path: string[]) => {
        if (!state) return;
        const currentVal = getIn(state, path);
        setState(prev => setIn(prev, path, !currentVal));
    };

    const update = (path: string[], value: any) => {
        if (!state) return;
        setState(prev => setIn(prev, path, value));
    };

    const handleManualMerge = (section: string) => {
        if (selectedForMerge.length !== 2) return;
        setMergeSection(section);
        setMergeModalOpen(true);
    };

    const executeMerge = (mergedItem: any) => {
        if (!state || !mergeSection) return;

        const sectionKey = mergeSection as keyof ReviewState;
        // @ts-ignore
        const currentItems = state[sectionKey].items;
        const remainingItems = currentItems.filter((i: any) => !selectedForMerge.includes(i.id));

        const reconstructedItem: any = {
            id: mergedItem.id || generateId(),
            visible: true,
            status: "NEW",
            mergeGroupId: undefined
        };

        Object.entries(mergedItem).forEach(([key, value]) => {
            if (['id', '_id', 'visible', 'status', 'mergeGroupId'].includes(key)) return;

            if (Array.isArray(value)) {
                reconstructedItem[key] = value.map(createField);
            } else {
                reconstructedItem[key] = createField(value);
            }
        });

        setState(prev => ({
            ...prev!,
            [sectionKey]: {
                // @ts-ignore
                ...prev![sectionKey],
                items: [reconstructedItem, ...remainingItems]
            }
        }));

        setMergeModalOpen(false);
        setMergeSection(null);
        setSelectedForMerge([]);
    };

    return {
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
        toggle,
        update,
        handleManualMerge,
        executeMerge,
        setMergeSection
    };
}
