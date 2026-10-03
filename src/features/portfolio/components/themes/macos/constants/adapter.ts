import { PortfolioData } from "@/types/portfolio";
import {
    LocationItem,
    techStack as defaultTechStack,
    socials as defaultSocials,
    blogPosts as defaultBlogPosts,
    locations as defaultLocations,
} from "./index";

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
    blogPosts: { id: number | string; date: string; title: string }[];
    locations: Record<string, LocationItem>;
    projects: LocationItem[];
    gallery: { id: number | string; img: string; title?: string }[];
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

    // Build Gallery Photos
    let adaptedGallery: { id: number | string; img: string; title?: string }[] = [];
    if (data?.gallery && data.gallery.length > 0) {
        adaptedGallery = data.gallery.map((g: any, idx: number) => ({
            id: g.id || idx + 1,
            img: typeof g === "string" ? g : g.img,
            title: typeof g === "string" ? `Photo ${idx + 1}` : g.title || `Photo ${idx + 1}`,
        }));
    }

    // Build Tech Stack
    let adaptedTechStack = defaultTechStack;
    if (data?.skills && data.skills.length > 0) {
        const visibleSkills = data.skills.filter((s) => !s.hidden && s.items.length > 0);
        if (visibleSkills.length > 0) {
            adaptedTechStack = visibleSkills.map((s) => ({
                category: s.category,
                items: s.items,
            }));
        }
    }

    // Build Socials
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

    // Build Blog Posts / Achievements
    let adaptedBlogPosts = defaultBlogPosts;
    if (data?.achievements && data.achievements.length > 0) {
        adaptedBlogPosts = data.achievements.map((ach, idx) => ({
            id: idx + 1,
            date: "Award",
            title: ach,
        }));
    } else if (data?.publications && data.publications.length > 0) {
        adaptedBlogPosts = data.publications.map((pub, idx) => ({
            id: idx + 1,
            date: "Publication",
            title: `${pub.title}: ${pub.summary || ""}`,
        }));
    }

    // Build Dynamic Project Folders
    let projectFolders: LocationItem[] = defaultLocations.work.children || [];
    if (data?.projects && data.projects.length > 0) {
        const visibleProjects = data.projects.filter((p) => !p.hidden);
        if (visibleProjects.length > 0) {
            const positions = [
                { folder: "top-[7vh] left-7", inside: "top-10 left-5" },
                { folder: "top-[20vh] left-7", inside: "top-52 right-80" },
                { folder: "top-[33vh] left-7", inside: "top-10 left-80" },
                { folder: "top-[46vh] left-7", inside: "top-40 right-20" },
                { folder: "top-[59vh] left-7", inside: "top-20 left-40" },
            ];

            projectFolders = visibleProjects.map((proj, idx) => {
                const pos = positions[idx % positions.length];
                const folderChildren: LocationItem[] = [
                    {
                        id: 1,
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
                        id: 2,
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
                        id: 3,
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
    }

    const adaptedLocations: Record<string, LocationItem> = {
        work: {
            id: 1,
            type: "work",
            name: "Work",
            icon: "/icons/work.svg",
            kind: "folder",
            children: projectFolders,
        },
        about: {
            id: 2,
            type: "about",
            name: "About me",
            icon: "/icons/info.svg",
            kind: "folder",
            children: [
                {
                    id: 1,
                    name: "me.png",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    position: "top-10 left-5",
                    imageUrl: image,
                },
                {
                    id: 4,
                    name: "about-me.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-60 left-5",
                    subtitle: title,
                    description: [bio],
                },
            ],
        },
        resume: {
            id: 3,
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
        },
        trash: defaultLocations.trash,
    };

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
        blogPosts: adaptedBlogPosts,
        locations: adaptedLocations,
        projects: projectFolders,
        gallery: adaptedGallery,
    };
}
