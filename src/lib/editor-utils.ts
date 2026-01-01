
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
    console.log("=== Reconstructing Portfolio Data ===");
    console.log("Original Order:", originalData.sectionOrder);
    const newData = _.cloneDeep(originalData);

    // Reset all list-based sections to empty arrays.
    // We rely on the Editor Nodes to be the source of truth.
    // If a section exists in the editor, its data will be populated in the loop below.
    // If a section has been deleted from the editor, it will remain empty here, ensuring it is removed from the DB.
    newData.experience = [];
    newData.projects = [];
    newData.skills = [];
    newData.education = [];
    newData.certifications = [];
    newData.publications = [];
    newData.extracurricular = [];
    newData.achievements = [];
    newData.coursework = [];
    newData.customSections = [];

    // Initialize sectionTitles if not exist
    if (!newData.sectionTitles) {
        newData.sectionTitles = {};
    }

    if (!newData.sectionVisibility) {
        newData.sectionVisibility = {};
    }

    // Determine section order from the Container node
    // Find the Container node (it usually has displayName "Container")
    const containerNode = Object.values(nodes).find(n => n.displayName === "Container" || (n.type as any).resolvedName === "Container");

    if (containerNode) {
        console.log("Container Node Found");
        console.log("Container Children:", containerNode.nodes);
    } else {
        console.log("!! WARNING: Container Node NOT Found !!");
    }


    if (containerNode && containerNode.nodes) {
        const order: string[] = [];
        containerNode.nodes.forEach((childId: string) => {
            const childNode = nodes[childId];
            if (childNode) {
                const name = childNode.displayName || (childNode.type as any).resolvedName;
                if (name === COMPONENT_NAMES.HERO) order.push("hero");
                else if (name === COMPONENT_NAMES.EXPERIENCE) order.push("experience");
                else if (name === COMPONENT_NAMES.PROJECTS) order.push("projects");
                else if (name === COMPONENT_NAMES.SKILLS) order.push("skills");
                else if (name === COMPONENT_NAMES.EDUCATION) order.push("education");
                else if (name === COMPONENT_NAMES.CERTIFICATIONS) order.push("certifications");
                else if (name === COMPONENT_NAMES.PUBLICATIONS) order.push("publications");
                else if (name === COMPONENT_NAMES.EXTRACURRICULAR) order.push("extracurricular");
                else if (name === COMPONENT_NAMES.ACHIEVEMENTS) order.push("achievements");
                else if (name === COMPONENT_NAMES.COURSEWORK) order.push("coursework");
                else if (name === COMPONENT_NAMES.CUSTOM_SECTIONS) order.push("customSections");
            }
        });
        console.log("Generated Section Order:", order);
        newData.sectionOrder = order;
    }

    Object.values(nodes).forEach((node: SerializedNode) => {
        // We identify nodes by their displayName or custom.name which we will set in the wrappers
        const name = node.displayName || (node.type as any).resolvedName;
        // console.log("Processing Node:", name, node.id);

        if (name === COMPONENT_NAMES.HERO) {
            newData.personalInfo = { ...newData.personalInfo, ...node.props.personalInfo };
            if (node.props.socialProfiles) {
                newData.socialProfiles = { ...newData.socialProfiles, ...node.props.socialProfiles };
            }
        } else if (name === COMPONENT_NAMES.EXPERIENCE) {
            newData.experience = node.props.experience;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.experience = node.props.sectionTitle;
            }
            newData.sectionVisibility!.experience = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.PROJECTS) {
            newData.projects = node.props.projects;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.projects = node.props.sectionTitle;
            }
            newData.sectionVisibility!.projects = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.SKILLS) {
            newData.skills = node.props.skills;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.skills = node.props.sectionTitle;
            }
            newData.sectionVisibility!.skills = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.EDUCATION) {
            newData.education = node.props.education;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.education = node.props.sectionTitle;
            }
            newData.sectionVisibility!.education = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.CERTIFICATIONS) {
            newData.certifications = node.props.certifications;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.certifications = node.props.sectionTitle;
            }
            newData.sectionVisibility!.certifications = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.PUBLICATIONS) {
            newData.publications = node.props.publications;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.publications = node.props.sectionTitle;
            }
            newData.sectionVisibility!.publications = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.EXTRACURRICULAR) {
            newData.extracurricular = node.props.extracurricular;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.extracurricular = node.props.sectionTitle;
            }
            newData.sectionVisibility!.extracurricular = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.ACHIEVEMENTS) {
            newData.achievements = node.props.achievements;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.achievements = node.props.sectionTitle;
            }
            newData.sectionVisibility!.achievements = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.COURSEWORK) {
            newData.coursework = node.props.coursework;
            if (node.props.sectionTitle) {
                newData.sectionTitles!.coursework = node.props.sectionTitle;
            }
            newData.sectionVisibility!.coursework = !!node.props.hidden;
        } else if (name === COMPONENT_NAMES.CUSTOM_SECTIONS) {
            newData.customSections = node.props.customSections;
            // Custom sections visibility logic might be more complex if per-section
        }
    });

    // Consistency Check: If a section is not in sectionOrder (i.e., not in the visual tree), 
    // ensure its data is cleared. This prevents orphaned nodes from populating data.
    if (newData.sectionOrder) {
        const activeSections = new Set(newData.sectionOrder);
        if (!activeSections.has('experience')) newData.experience = [];
        if (!activeSections.has('projects')) newData.projects = [];
        if (!activeSections.has('skills')) newData.skills = [];
        if (!activeSections.has('education')) newData.education = [];
        if (!activeSections.has('certifications')) newData.certifications = [];
        if (!activeSections.has('publications')) newData.publications = [];
        if (!activeSections.has('extracurricular')) newData.extracurricular = [];
        if (!activeSections.has('achievements')) newData.achievements = [];
        if (!activeSections.has('coursework')) newData.coursework = [];
        if (!activeSections.has('customSections')) newData.customSections = [];
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
