export interface PortfolioData {
    personalInfo: {
        name: string;
        title: string;
        bio: string;
        email: string;
        phone: string;
        location: string;
        image?: string;
        resume?: string;
    };
    socialProfiles?: {
        github?: string;
        linkedin?: string;
        leetcode?: string;
        hackerrank?: string;
        geeksforgeeks?: string;
        codeforces?: string;
        codechef?: string;
        kaggle?: string;
    };
    skills: {
        category: string;
        items: string[];
        hidden?: boolean;
    }[];
    experience: {
        id: string;
        company: string;
        role: string;
        date: string;
        description: string;
        location?: string;
        status?: "NEW" | "OLD";
        mergeGroupId?: string;
        hidden?: boolean;
    }[];
    projects: {
        id: string;
        title: string;
        techStack: string[];
        githubUrl?: string;
        liveUrl?: string;
        bullets?: string[];
        status?: "NEW" | "OLD";
        mergeGroupId?: string;
        hidden?: boolean;
    }[];
    education: {
        id: string;
        degree: string;
        institute: string;
        year: string;
        score: string;
        status?: "NEW" | "OLD";
        mergeGroupId?: string;
        hidden?: boolean;
    }[];
    certifications: {
        id: string;
        name: string;
        issuer: string;
        link: string;
        status?: "NEW" | "OLD";
        mergeGroupId?: string;
        hidden?: boolean;
    }[];
    publications: {
        id: string;
        title: string;
        summary: string;
        link: string;
        status?: "NEW" | "OLD";
        mergeGroupId?: string;
        hidden?: boolean;
    }[];
    extracurricular: {
        id: string;
        role: string;
        organization: string;
        status?: "NEW" | "OLD";
        mergeGroupId?: string;
        hidden?: boolean;
    }[];
    achievements?: string[];
    coursework?: string[];
    customSections?: {
        id: string;
        title: string;
        items: string[];
        hidden?: boolean;
    }[];
    sectionTitles?: {
        skills?: string;
        experience?: string;
        projects?: string;
        education?: string;
        certifications?: string;
        publications?: string;
        extracurricular?: string;
        achievements?: string;
        coursework?: string;
        customSections?: string;
    };
    sectionVisibility?: {
        [key: string]: boolean;
    };
    sectionOrder?: string[];
    theme?: "minimalist" | "creative" | "professional" | "modern";
}

export interface SkillsSectionProps {
    skills: PortfolioData["skills"];
}

export interface ExperienceSectionProps {
    experience: PortfolioData["experience"];
}

export interface EducationSectionProps {
    education: PortfolioData["education"];
}

export interface ProjectsSectionProps {
    projects: PortfolioData["projects"];
}

export interface CertificationsSectionProps {
    certifications: PortfolioData["certifications"];
}

export interface PublicationsSectionProps {
    publications: PortfolioData["publications"];
}

export interface ExtracurricularSectionProps {
    extracurricular: PortfolioData["extracurricular"];
}

export interface CourseworkSectionProps {
    coursework: PortfolioData["coursework"];
}