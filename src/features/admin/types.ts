import { PortfolioData } from "@/types/portfolio";

export type ReviewField<T> = {
    value: T;
    visible: boolean;
};

export interface ReviewState {
    personalInfo: {
        visible: boolean;
        name: ReviewField<string>;
        title: ReviewField<string>;
        bio: ReviewField<string>;
        email: ReviewField<string>;
    };
    socialProfiles: {
        visible: boolean;
        github: ReviewField<string>;
        linkedin: ReviewField<string>;
        leetcode: ReviewField<string>;
        hackerrank: ReviewField<string>;
        geeksforgeeks: ReviewField<string>;
        codeforces: ReviewField<string>;
        codechef: ReviewField<string>;
        kaggle: ReviewField<string>;
    };
    skills: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            category: ReviewField<string>;
            items: ReviewField<string>[];
        }[];
    };
    experience: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            company: ReviewField<string>;
            role: ReviewField<string>;
            date: ReviewField<string>;
            description: ReviewField<string>;
            status?: "NEW" | "OLD";
            mergeGroupId?: string;
        }[];
    };
    projects: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            title: ReviewField<string>;
            techStack: ReviewField<string>[];
            githubUrl: ReviewField<string>;
            liveUrl: ReviewField<string>;
            bullets: ReviewField<string>[];
            status?: "NEW" | "OLD";
            mergeGroupId?: string;
        }[];
    };
    customSections: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            title: ReviewField<string>;
            items: ReviewField<string>[];
        }[];
    };
    education: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            degree: ReviewField<string>;
            institute: ReviewField<string>;
            year: ReviewField<string>;
            score: ReviewField<string>;
            status?: "NEW" | "OLD";
            mergeGroupId?: string;
        }[];
    };
    certifications: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            name: ReviewField<string>;
            issuer: ReviewField<string>;
            link: ReviewField<string>;
            status?: "NEW" | "OLD";
            mergeGroupId?: string;
        }[];
    };
    publications: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            title: ReviewField<string>;
            summary: ReviewField<string>;
            link: ReviewField<string>;
            status?: "NEW" | "OLD";
            mergeGroupId?: string;
        }[];
    };
    extracurricular: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            role: ReviewField<string>;
            organization: ReviewField<string>;
            status?: "NEW" | "OLD";
            mergeGroupId?: string;
        }[];
    };
    coursework: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            value: ReviewField<string>;
        }[];
    };
    achievements: {
        visible: boolean;
        items: {
            id: string;
            visible: boolean;
            value: ReviewField<string>;
        }[];
    };
}
