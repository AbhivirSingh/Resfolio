import { PortfolioData } from "@/types/portfolio";
import {
    LocationItem,
    socials as defaultSocials,
    locations as defaultLocations,
} from "./index";

export interface CustomSectionItem {
    id: string;
    title: string;
    items: string[];
}

export interface AdaptedMacData {
    name: string;
    firstName: string;
    fullName: string;
    title: string;
    bio: string;
    email: string;
    image: string;
    resumeUrl: string;
    socials: { id: number | string; text: string; icon: string; bg: string; link: string }[];
    techStack: { category: string; items: string[] }[];
    hasSkills: boolean;
    coursework: string[];
    hasCoursework: boolean;
    experience: {
        id: string;
        company: string;
        role: string;
        date: string;
        description: string;
        location?: string;
    }[];
    hasExperience: boolean;
    projects: LocationItem[];
    hasProjects: boolean;
    education: {
        id: string;
        degree: string;
        institute: string;
        year: string;
        score: string;
    }[];
    hasEducation: boolean;
    certifications: {
        id: string;
        name: string;
        issuer: string;
        link: string;
    }[];
    hasCertifications: boolean;
    publications: {
        id: string;
        title: string;
        summary: string;
        link: string;
    }[];
    hasPublications: boolean;
    achievements: string[];
    hasAchievements: boolean;
    extracurricular: {
        id: string;
        role: string;
        organization: string;
    }[];
    hasExtracurricular: boolean;
    customSections: CustomSectionItem[];
    hasCustomSections: boolean;
    blogPosts: { id: number | string; date: string; title: string; link?: string; summary?: string; type?: string }[];
    hasArticles: boolean;
    gallery: { id: number | string; img: string; title?: string }[];
    hasGallery: boolean;
    hasResume: boolean;
    hasContact: boolean;
    locations: Record<string, LocationItem>;
    desktopFolders: LocationItem[];
    navLinks: { id: string | number; name: string; type: string }[];
    dockApps: { id: string; name: string; icon: string; canOpen: boolean }[];
    availableSections: string[];
}

export function adaptPortfolioData(data?: PortfolioData): AdaptedMacData {
    const rawFullName = data?.personalInfo?.name?.trim() || "Abhivir Singh";
    const firstName = rawFullName.split(/\s+/)[0] || "Abhivir";
    const name = firstName;
    const title = data?.personalInfo?.title?.trim() || "Full Stack Developer & AI/ML Researcher";
    const bio =
        data?.personalInfo?.bio?.trim() ||
        `Hi, I'm ${firstName} — Integrated Dual Degree student (BTech CSE + MTech AI) at RGIPT with expertise in full-stack development, AI/ML and trading systems.`;
    const email = data?.personalInfo?.email?.trim() || "abhivir.singh.tech@gmail.com";
    const image = data?.personalInfo?.image || "";
    const resumeUrl = data?.personalInfo?.resume || "/files/resume.pdf";

    // Section Visibility check helper (true means hidden)
    const isVisible = (secKey: string) => !data?.sectionVisibility?.[secKey];

    // 1. Gallery Photos
    let adaptedGallery: { id: number | string; img: string; title?: string }[] = [];
    if (data?.gallery && Array.isArray(data.gallery) && data.gallery.length > 0) {
        adaptedGallery = data.gallery.map((g: any, idx: number) => ({
            id: g.id || idx + 1,
            img: typeof g === "string" ? g : g.img,
            title: typeof g === "string" ? `Photo ${idx + 1}` : g.title || `Photo ${idx + 1}`,
        }));
    }
    const hasGallery = isVisible("gallery") && adaptedGallery.length > 0;

    // 2. Skills / Tech Stack
    let adaptedTechStack: { category: string; items: string[] }[] = [];
    if (data?.skills && isVisible("skills")) {
        const visibleSkills = data.skills.filter((s) => !s.hidden && s.items && s.items.length > 0);
        if (visibleSkills.length > 0) {
            adaptedTechStack = visibleSkills.map((s) => ({
                category: s.category,
                items: s.items,
            }));
        }
    }
    const hasSkills = adaptedTechStack.length > 0;

    // 3. Coursework
    const courseworkList = (data?.coursework && isVisible("coursework") && Array.isArray(data.coursework))
        ? data.coursework.filter((c) => typeof c === "string" && c.trim().length > 0)
        : [];
    const hasCoursework = courseworkList.length > 0;

    // 4. Experience
    const visibleExperience = (data?.experience && isVisible("experience"))
        ? data.experience.filter((exp) => !exp.hidden)
        : [];
    const hasExperience = visibleExperience.length > 0;

    // 5. Education
    const visibleEducation = (data?.education && isVisible("education"))
        ? data.education.filter((edu) => !edu.hidden)
        : [];
    const hasEducation = visibleEducation.length > 0;

    // 6. Certifications
    const visibleCertifications = (data?.certifications && isVisible("certifications"))
        ? data.certifications.filter((cert) => !cert.hidden)
        : [];
    const hasCertifications = visibleCertifications.length > 0;

    // 7. Publications
    const visiblePublications = (data?.publications && isVisible("publications"))
        ? data.publications.filter((pub) => !pub.hidden)
        : [];
    const hasPublications = visiblePublications.length > 0;

    // 8. Extracurricular
    const visibleExtracurricular = (data?.extracurricular && isVisible("extracurricular"))
        ? data.extracurricular.filter((extra) => !extra.hidden)
        : [];
    const hasExtracurricular = visibleExtracurricular.length > 0;

    // 9. Achievements
    const achievementsList = (data?.achievements && isVisible("achievements") && Array.isArray(data.achievements))
        ? data.achievements.filter((ach) => typeof ach === "string" && ach.trim().length > 0)
        : [];
    const hasAchievements = achievementsList.length > 0;

    // 10. Custom Sections / Dynamic Sections
    const customSectionsList: CustomSectionItem[] = [];
    if (data?.customSections && isVisible("customSections") && Array.isArray(data.customSections)) {
        data.customSections.forEach((sec) => {
            if (!sec.hidden && sec.items && sec.items.length > 0) {
                customSectionsList.push({
                    id: sec.id || sec.title.toLowerCase().replace(/\s+/g, "-"),
                    title: sec.title,
                    items: sec.items,
                });
            }
        });
    }

    // Dynamic unknown keys in data (e.g. if any other dynamic section is present in data)
    if (data) {
        const standardKeys = new Set([
            "personalInfo", "socialProfiles", "skills", "experience", "projects",
            "education", "certifications", "publications", "extracurricular",
            "achievements", "coursework", "customSections", "sectionTitles",
            "sectionVisibility", "sectionOrder", "theme", "gallery", "_id", "createdAt", "updatedAt", "__v"
        ]);
        Object.entries(data).forEach(([key, val]) => {
            if (!standardKeys.has(key) && isVisible(key)) {
                if (Array.isArray(val) && val.length > 0) {
                    const stringItems = val.map((item) =>
                        typeof item === "string" ? item : JSON.stringify(item)
                    );
                    const formattedTitle = data.sectionTitles?.[key as keyof typeof data.sectionTitles] ||
                        key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
                    customSectionsList.push({
                        id: key,
                        title: formattedTitle,
                        items: stringItems,
                    });
                }
            }
        });
    }
    const hasCustomSections = customSectionsList.length > 0;

    // 11. Projects
    const visibleProjects = (data?.projects && isVisible("projects"))
        ? data.projects.filter((p) => !p.hidden)
        : [];
    const hasProjects = visibleProjects.length > 0;

    // Build Project Folder Location Items
    let projectFolderItems: LocationItem[] = [];
    if (hasProjects) {
        const positions = [
            { folder: "top-[7vh] left-7", inside: "top-10 left-5" },
            { folder: "top-[20vh] left-7", inside: "top-52 right-80" },
            { folder: "top-[33vh] left-7", inside: "top-10 left-80" },
            { folder: "top-[46vh] left-7", inside: "top-40 right-20" },
            { folder: "top-[59vh] left-7", inside: "top-20 left-40" },
            { folder: "top-[72vh] left-7", inside: "top-32 left-60" },
        ];

        projectFolderItems = visibleProjects.map((proj, idx) => {
            const pos = positions[idx % positions.length];
            const folderChildren: LocationItem[] = [
                {
                    id: `proj-txt-${proj.id || idx}`,
                    name: `${proj.title}.txt`,
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-10",
                    subtitle: proj.techStack?.length ? `Tech: ${proj.techStack.join(", ")}` : undefined,
                    description: proj.bullets && proj.bullets.length > 0 ? proj.bullets : [proj.title],
                },
            ];

            if (proj.liveUrl) {
                let cleanDomain = proj.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
                folderChildren.push({
                    id: `proj-url-${proj.id || idx}`,
                    name: cleanDomain || "live-demo.com",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: proj.liveUrl,
                    position: "top-10 right-20",
                });
            }

            if (proj.githubUrl) {
                folderChildren.push({
                    id: `proj-git-${proj.id || idx}`,
                    name: "GitHub Repository",
                    icon: "/icons/github.svg",
                    kind: "file",
                    fileType: "url",
                    href: proj.githubUrl,
                    position: "top-60 left-5",
                });
            }

            return {
                id: proj.id || idx + 10,
                name: proj.title,
                icon: "/images/folder.png",
                kind: "folder",
                position: pos.inside,
                windowPosition: pos.folder,
                children: folderChildren,
            };
        });
    }

    // 12. Experience Folder Location Items
    let experienceFolderItems: LocationItem[] = [];
    if (hasExperience) {
        experienceFolderItems = visibleExperience.map((exp, idx) => {
            const lines: string[] = [];
            if (exp.role) lines.push(`Role: ${exp.role}`);
            if (exp.company) lines.push(`Company: ${exp.company}`);
            if (exp.date) lines.push(`Period: ${exp.date}`);
            if (exp.location) lines.push(`Location: ${exp.location}`);
            if (exp.description) lines.push(exp.description);

            return {
                id: `exp-${exp.id || idx}`,
                name: `${exp.company || "Experience"} - ${exp.role || "Role"}.txt`,
                icon: "/images/txt.png",
                kind: "file",
                fileType: "txt",
                position: `top-${10 + (idx % 4) * 20} left-${10 + (idx % 3) * 30}`,
                subtitle: `${exp.role} at ${exp.company} (${exp.date})`,
                description: lines,
            };
        });
    }

    // 13. Custom Section Location Items
    let customSectionFolderItems: LocationItem[] = [];
    if (hasCustomSections) {
        customSectionFolderItems = customSectionsList.map((sec, idx) => {
            return {
                id: `custom-folder-${sec.id || idx}`,
                name: sec.title,
                icon: "/images/folder.png",
                kind: "folder",
                position: `top-${10 + idx * 15} left-${10 + idx * 20}`,
                windowPosition: `top-[${40 + idx * 12}vh] right-7`,
                children: [
                    {
                        id: `custom-txt-${sec.id || idx}`,
                        name: `${sec.title}.txt`,
                        icon: "/images/txt.png",
                        kind: "file",
                        fileType: "txt",
                        position: "top-10 left-10",
                        subtitle: sec.title,
                        description: sec.items,
                    },
                ],
            };
        });
    }

    // 14. Socials
    const adaptedSocials: { id: number | string; text: string; icon: string; bg: string; link: string }[] = [];
    if (data?.socialProfiles?.github) {
        adaptedSocials.push({
            id: "github",
            text: "Github",
            icon: "/icons/github.svg",
            bg: "#f4656b",
            link: data.socialProfiles.github.startsWith("http")
                ? data.socialProfiles.github
                : `https://github.com/${data.socialProfiles.github}`,
        });
    }
    if (data?.socialProfiles?.linkedin) {
        adaptedSocials.push({
            id: "linkedin",
            text: "LinkedIn",
            icon: "/icons/linkedin.svg",
            bg: "#05b6f6",
            link: data.socialProfiles.linkedin.startsWith("http")
                ? data.socialProfiles.linkedin
                : `https://linkedin.com/in/${data.socialProfiles.linkedin}`,
        });
    }
    if (email) {
        adaptedSocials.push({
            id: "email",
            text: "Email",
            icon: "/icons/mail.svg",
            bg: "#ff866b",
            link: `mailto:${email}`,
        });
    }
    if (data?.socialProfiles?.kaggle) {
        adaptedSocials.push({
            id: "kaggle",
            text: "Kaggle",
            icon: "/icons/user.svg",
            bg: "#20beff",
            link: data.socialProfiles.kaggle.startsWith("http")
                ? data.socialProfiles.kaggle
                : `https://kaggle.com/${data.socialProfiles.kaggle}`,
        });
    }
    if (data?.socialProfiles?.leetcode) {
        adaptedSocials.push({
            id: "leetcode",
            text: "LeetCode",
            icon: "/icons/edit.svg",
            bg: "#ffa116",
            link: data.socialProfiles.leetcode.startsWith("http")
                ? data.socialProfiles.leetcode
                : `https://leetcode.com/${data.socialProfiles.leetcode}`,
        });
    }
    const finalSocials = adaptedSocials.length > 0 ? adaptedSocials : defaultSocials;
    const hasContact = finalSocials.length > 0 || !!email;

    // 15. Articles / Blog / Publications / Achievements / Certifications in Safari
    const adaptedBlogPosts: { id: number | string; date: string; title: string; link?: string; summary?: string; type?: string }[] = [];

    if (hasPublications) {
        visiblePublications.forEach((pub, idx) => {
            adaptedBlogPosts.push({
                id: `pub-${pub.id || idx}`,
                date: "Publication",
                title: pub.title,
                summary: pub.summary,
                link: pub.link,
                type: "publication",
            });
        });
    }

    if (hasAchievements) {
        achievementsList.forEach((ach, idx) => {
            adaptedBlogPosts.push({
                id: `ach-${idx}`,
                date: "Achievement",
                title: ach,
                type: "achievement",
            });
        });
    }

    if (hasCertifications) {
        visibleCertifications.forEach((cert, idx) => {
            adaptedBlogPosts.push({
                id: `cert-${cert.id || idx}`,
                date: cert.issuer || "Certificate",
                title: cert.name,
                link: cert.link,
                type: "certification",
            });
        });
    }

    if (hasExtracurricular) {
        visibleExtracurricular.forEach((extra, idx) => {
            adaptedBlogPosts.push({
                id: `extra-${extra.id || idx}`,
                date: extra.organization || "Extracurricular",
                title: extra.role,
                type: "extracurricular",
            });
        });
    }

    if (hasCustomSections) {
        customSectionsList.forEach((sec, idx) => {
            adaptedBlogPosts.push({
                id: `custom-${sec.id || idx}`,
                date: "Section",
                title: sec.title,
                summary: sec.items.join(" • "),
                type: "custom",
            });
        });
    }

    const hasArticles = adaptedBlogPosts.length > 0;
    const hasResume = !!resumeUrl;

    // 16. Build About Location Files
    const aboutChildren: LocationItem[] = [];
    if (image) {
        aboutChildren.push({
            id: "about-img",
            name: "me.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-10 left-5",
            imageUrl: image,
        });
    }
    aboutChildren.push({
        id: "about-txt",
        name: "about-me.txt",
        icon: "/images/txt.png",
        kind: "file",
        fileType: "txt",
        position: image ? "top-60 left-5" : "top-10 left-5",
        subtitle: title,
        description: [bio],
    });

    if (hasEducation) {
        aboutChildren.push({
            id: "edu-txt",
            name: "education.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-10 right-20",
            subtitle: "Education & Degrees",
            description: visibleEducation.map((e) =>
                `${e.degree} - ${e.institute} (${e.year})${e.score ? ` [Score: ${e.score}]` : ""}`
            ),
        });
    }

    if (hasCoursework) {
        aboutChildren.push({
            id: "coursework-txt",
            name: "coursework.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-40 right-20",
            subtitle: "Relevant Coursework",
            description: courseworkList,
        });
    }

    // 17. Build Dynamic Finder Locations
    const adaptedLocations: Record<string, LocationItem> = {};

    if (hasProjects) {
        adaptedLocations.work = {
            id: 1,
            type: "work",
            name: data?.sectionTitles?.projects || "Projects",
            icon: "/icons/work.svg",
            kind: "folder",
            children: projectFolderItems,
        };
    }

    if (hasExperience) {
        adaptedLocations.experience = {
            id: 2,
            type: "experience",
            name: data?.sectionTitles?.experience || "Experience",
            icon: "/images/folder.png",
            kind: "folder",
            children: experienceFolderItems,
        };
    }

    adaptedLocations.about = {
        id: 3,
        type: "about",
        name: "About me",
        icon: "/icons/info.svg",
        kind: "folder",
        children: aboutChildren,
    };

    if (hasCertifications) {
        adaptedLocations.certifications = {
            id: 4,
            type: "certifications",
            name: data?.sectionTitles?.certifications || "Certifications",
            icon: "/images/plain.png",
            kind: "folder",
            children: visibleCertifications.map((cert, idx) => ({
                id: `cert-file-${cert.id || idx}`,
                name: `${cert.name}.txt`,
                icon: "/images/txt.png",
                kind: "file",
                fileType: "txt",
                position: `top-${10 + (idx % 3) * 20} left-${10 + (idx % 3) * 20}`,
                subtitle: `${cert.name} by ${cert.issuer}`,
                description: [
                    `Certificate: ${cert.name}`,
                    `Issuer: ${cert.issuer}`,
                    cert.link ? `Link: ${cert.link}` : "",
                ].filter(Boolean),
            })),
        };
    }

    if (hasCustomSections) {
        adaptedLocations.custom = {
            id: 5,
            type: "custom",
            name: "Custom Sections",
            icon: "/images/folder.png",
            kind: "folder",
            children: customSectionFolderItems,
        };
    }

    if (hasResume) {
        adaptedLocations.resume = {
            id: 6,
            type: "resume",
            name: "Resume",
            icon: "/icons/file.svg",
            kind: "folder",
            children: [
                {
                    id: 1,
                    name: "Resume.pdf",
                    icon: "/images/pdf.png",
                    kind: "file",
                    fileType: "pdf",
                    href: resumeUrl,
                },
            ],
        };
    }

    adaptedLocations.trash = defaultLocations.trash;

    // 18. Desktop Folders in Home.tsx
    const desktopFolders: LocationItem[] = [
        ...(hasProjects ? projectFolderItems : []),
        ...(hasCustomSections ? customSectionFolderItems : []),
    ];

    // 19. Dynamic Navbar Links
    const navLinks: { id: string | number; name: string; type: string }[] = [];
    if (hasProjects) {
        navLinks.push({ id: "projects", name: data?.sectionTitles?.projects || "Projects", type: "finder" });
    }
    if (hasExperience && !hasProjects) {
        navLinks.push({ id: "experience", name: data?.sectionTitles?.experience || "Experience", type: "finder" });
    }
    if (hasSkills) {
        navLinks.push({ id: "skills", name: data?.sectionTitles?.skills || "Skills", type: "terminal" });
    }
    if (hasArticles) {
        navLinks.push({
            id: "articles",
            name: data?.sectionTitles?.publications || data?.sectionTitles?.achievements || "Articles",
            type: "safari",
        });
    }
    if (hasGallery) {
        navLinks.push({ id: "gallery", name: "Gallery", type: "photos" });
    }
    if (hasResume) {
        navLinks.push({ id: "resume", name: "Resume", type: "resume" });
    }
    if (hasContact) {
        navLinks.push({ id: "contact", name: "Contact", type: "contact" });
    }

    // 20. Dynamic Dock Apps (strictly conditionally included)
    const dockApps: { id: string; name: string; icon: string; canOpen: boolean }[] = [];

    // Finder: only if we have folders or file locations
    if (Object.keys(adaptedLocations).length > 1) {
        dockApps.push({
            id: "finder",
            name: hasProjects ? (data?.sectionTitles?.projects || "Portfolio") : "Finder",
            icon: "finder.png",
            canOpen: true,
        });
    }

    // Safari: only if publications, achievements, certifications, or custom sections exist
    if (hasArticles) {
        dockApps.push({
            id: "safari",
            name: data?.sectionTitles?.publications || "Articles",
            icon: "safari.png",
            canOpen: true,
        });
    }

    // Photos: only if gallery photos exist
    if (hasGallery) {
        dockApps.push({
            id: "photos",
            name: "Gallery",
            icon: "photos.png",
            canOpen: true,
        });
    }

    // Terminal: only if skills or coursework exist
    if (hasSkills || hasCoursework) {
        dockApps.push({
            id: "terminal",
            name: data?.sectionTitles?.skills || "Skills",
            icon: "terminal.png",
            canOpen: true,
        });
    }

    // Contact
    if (hasContact) {
        dockApps.push({
            id: "contact",
            name: "Contact",
            icon: "contact.png",
            canOpen: true,
        });
    }

    // Trash: standard macOS trash
    dockApps.push({
        id: "trash",
        name: "Bin",
        icon: "trash.png",
        canOpen: true,
    });

    const availableSections: string[] = [];
    if (hasProjects) availableSections.push("projects");
    if (hasExperience) availableSections.push("experience");
    if (hasSkills) availableSections.push("skills");
    if (hasEducation) availableSections.push("education");
    if (hasCertifications) availableSections.push("certifications");
    if (hasPublications) availableSections.push("publications");
    if (hasAchievements) availableSections.push("achievements");
    if (hasCoursework) availableSections.push("coursework");
    if (hasExtracurricular) availableSections.push("extracurricular");
    if (hasCustomSections) availableSections.push("customSections");
    if (hasGallery) availableSections.push("gallery");
    if (hasResume) availableSections.push("resume");

    return {
        name,
        firstName,
        fullName: rawFullName,
        title,
        bio,
        email,
        image,
        resumeUrl,
        socials: finalSocials,
        techStack: adaptedTechStack,
        hasSkills,
        coursework: courseworkList,
        hasCoursework,
        experience: visibleExperience,
        hasExperience,
        projects: projectFolderItems,
        hasProjects,
        education: visibleEducation,
        hasEducation,
        certifications: visibleCertifications,
        hasCertifications,
        publications: visiblePublications,
        hasPublications,
        achievements: achievementsList,
        hasAchievements,
        extracurricular: visibleExtracurricular,
        hasExtracurricular,
        customSections: customSectionsList,
        hasCustomSections,
        blogPosts: adaptedBlogPosts,
        hasArticles,
        gallery: adaptedGallery,
        hasGallery,
        hasResume,
        hasContact,
        locations: adaptedLocations,
        desktopFolders,
        navLinks,
        dockApps,
        availableSections,
    };
}
