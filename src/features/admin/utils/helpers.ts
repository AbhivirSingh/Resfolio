
import { PortfolioData } from "@/types/portfolio";
import { SerializedNode, SerializedNodes } from "@craftjs/core";
import _ from 'lodash';

export const COMPONENT_NAMES = {
    HERO: "EditableHero",
    EXPERIENCE: "EditableExperience",
    PROJECTS: "EditableProjects",
    SKILLS: "EditableSkills",
    EDUCATION: "EditableEducation",
    CERTIFICATIONS: "EditableCertifications",
    PUBLICATIONS: "EditablePublications",
    EXTRACURRICULAR: "EditableExtracurricular",
    ACHIEVEMENTS: "EditableAchievements",
    COURSEWORK: "EditableCoursework",
    CUSTOM_SECTIONS: "EditableCustomSections",
};

export const reconstructPortfolioData = (nodes: SerializedNodes, originalData: PortfolioData): PortfolioData => {
    const newData = _.cloneDeep(originalData);

    // clear list-based sections; editor state is source of truth
    const listSections: (keyof PortfolioData)[] = [
        'experience', 'projects', 'skills', 'education', 'certifications',
        'publications', 'extracurricular', 'achievements', 'coursework', 'customSections'
    ];
    listSections.forEach(key => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newData[key] as any) = [];
    });

    newData.sectionTitles = newData.sectionTitles || {};
    newData.sectionVisibility = newData.sectionVisibility || {};

    const containerNode = Object.values(nodes).find(n =>
        n.displayName === "Container" || (n.type as any).resolvedName === "Container"
    );

    if (containerNode?.nodes) {
        const componentNameMap: Record<string, string> = Object.entries(COMPONENT_NAMES)
            .reduce((acc, [key, val]) => ({ ...acc, [val]: _.camelCase(key) === 'customSections' ? 'customSections' : _.camelCase(key) }), {});

        newData.sectionOrder = containerNode.nodes
            .map(childId => {
                const node = nodes[childId];
                if (!node) return null;
                const name = node.displayName || (node.type as { resolvedName?: string }).resolvedName;
                return componentNameMap[name || ""] || null;
            })
            .filter((n): n is string => n !== null);
    }

    Object.values(nodes).forEach((node: SerializedNode) => {
        const name = node.displayName || (node.type as { resolvedName?: string }).resolvedName;
        const { props } = node;

        switch (name) {
            case COMPONENT_NAMES.HERO:
                newData.personalInfo = { ...newData.personalInfo, ...props.personalInfo };
                if (props.socialProfiles) {
                    newData.socialProfiles = { ...newData.socialProfiles, ...props.socialProfiles };
                }
                break;
            case COMPONENT_NAMES.CUSTOM_SECTIONS:
                newData.customSections = props.customSections;
                break;
            default:
                // Handle standard list sections dynamically
                const sectionKey = Object.keys(COMPONENT_NAMES).find(k => COMPONENT_NAMES[k as keyof typeof COMPONENT_NAMES] === name)?.toLowerCase();

                // Map generic keys to state keys (e.g. SKILLS -> skills)
                if (sectionKey && sectionKey !== 'hero') {
                    // special case handling if needed, or consistent naming
                    const propKey = _.camelCase(sectionKey);

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (props[propKey]) (newData as any)[propKey] = props[propKey];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (props.sectionTitle) newData.sectionTitles![propKey as keyof typeof newData.sectionTitles] = props.sectionTitle;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (props.hidden !== undefined) newData.sectionVisibility![propKey as keyof typeof newData.sectionVisibility] = !!props.hidden;
                }
                break;
        }
    });

    // Cleanup orphaned data
    if (newData.sectionOrder) {
        const activeSet = new Set(newData.sectionOrder);
        listSections.forEach(section => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!activeSet.has(section as string)) (newData[section] as any) = [];
        });
    }

    return newData;
};

export const generateChangeLog = (initial: PortfolioData, current: PortfolioData): string[] => {
    const changes: string[] = [];

    if (!_.isEqual(initial.personalInfo, current.personalInfo)) {
        changes.push("Updated Personal Information");
    }
    if (!_.isEqual(initial.socialProfiles, current.socialProfiles)) {
        changes.push("Updated Social Profiles");
    }
    if (!_.isEqual(initial.experience, current.experience)) {
        changes.push("Updated Experience Section");
    }
    if (!_.isEqual(initial.projects, current.projects)) {
        changes.push("Updated Projects Section");
    }
    if (!_.isEqual(initial.skills, current.skills)) {
        changes.push("Updated Skills Section");
    }
    if (!_.isEqual(initial.education, current.education)) {
        changes.push("Updated Education Section");
    }
    if (!_.isEqual(initial.certifications, current.certifications)) {
        changes.push("Updated Certifications Section");
    }
    if (!_.isEqual(initial.publications, current.publications)) {
        changes.push("Updated Publications Section");
    }
    if (!_.isEqual(initial.extracurricular, current.extracurricular)) {
        changes.push("Updated Extracurricular Section");
    }
    if (!_.isEqual(initial.achievements, current.achievements)) {
        changes.push("Updated Achievements Section");
    }
    if (!_.isEqual(initial.coursework, current.coursework)) {
        changes.push("Updated Coursework Section");
    }
    if (!_.isEqual(initial.customSections, current.customSections)) {
        changes.push("Updated Custom Sections");
    }
    if (!_.isEqual(initial.sectionOrder, current.sectionOrder)) {
        changes.push("Updated Section Order");
    }
    if (!_.isEqual(initial.sectionVisibility, current.sectionVisibility)) {
        changes.push("Updated Section Visibility");
    }

    return changes;
};
