export interface LocationItem {
    id: number | string;
    name: string;
    icon: string;
    kind: "file" | "folder";
    fileType?: "txt" | "img" | "pdf" | "url" | "fig";
    position?: string;
    windowPosition?: string;
    description?: string[];
    subtitle?: string;
    imageUrl?: string;
    image?: string;
    href?: string;
    children?: LocationItem[];
    type?: string;
}

export const navLinks = [
    {
        id: 1,
        name: "Projects",
        type: "finder",
    },
    {
        id: 3,
        name: "Contact",
        type: "contact",
    },
    {
        id: 4,
        name: "Resume",
        type: "resume",
    },
];

export const navIcons = [
    {
        id: 1,
        img: "/icons/wifi.svg",
    },
    {
        id: 2,
        img: "/icons/search.svg",
    },
    {
        id: 3,
        img: "/icons/user.svg",
    },
    {
        id: 4,
        img: "/icons/mode.svg",
    },
];

export const dockApps = [
    {
        id: "finder",
        name: "Portfolio",
        icon: "finder.png",
        canOpen: true,
    },
    {
        id: "safari",
        name: "Articles",
        icon: "safari.png",
        canOpen: true,
    },
    {
        id: "photos",
        name: "Gallery",
        icon: "photos.png",
        canOpen: true,
    },
    {
        id: "contact",
        name: "Contact",
        icon: "contact.png",
        canOpen: true,
    },
    {
        id: "terminal",
        name: "Skills",
        icon: "terminal.png",
        canOpen: true,
    },
    {
        id: "trash",
        name: "Bin",
        icon: "trash.png",
        canOpen: true,
    },
];

export const blogPosts = [
    {
        id: 1,
        date: "Feb 2025",
        title: "Secured 2nd Runner-Up at KodeKurrent 2025 Hackathon by IEEE-RGIPT",
    },
    {
        id: 2,
        date: "2023",
        title: "Runner-Up at Dark Pattern Buster Hackathon (DPBH)",
    },
    {
        id: 3,
        date: "2023 - Present",
        title: "Academic Mentorship & Leadership at RGIPT",
    },
];

export const techStack = [
    {
        category: "Languages",
        items: ["Python", "C++", "Java", "SQL", "JavaScript", "C", "MATLAB"],
    },
    {
        category: "AI / ML",
        items: ["PyTorch", "Deep Learning", "LLMs", "Causal Inference", "Transformers"],
    },
    {
        category: "Data & Infra",
        items: ["AWS", "Docker", "Linux", "Git", "Vector DBs", "REST APIs"],
    },
    {
        category: "Frameworks",
        items: ["Flask", "FastAPI", "LangChain", "OpenCV", "DeepFace"],
    },
    {
        category: "Core Concepts",
        items: ["DSA", "System Design", "Machine Learning Theory"],
    },
];

export const socials = [
    {
        id: 1,
        text: "Github",
        icon: "/icons/github.svg",
        bg: "#f4656b",
        link: "https://github.com/AbhivirSingh",
    },
    {
        id: 2,
        text: "LinkedIn",
        icon: "/icons/linkedin.svg",
        bg: "#05b6f6",
        link: "https://www.linkedin.com/in/abhivirsingh/",
    },
    {
        id: 3,
        text: "Email",
        icon: "/icons/mail.svg",
        bg: "#ff866b",
        link: "mailto:abhivir.singh.tech@gmail.com",
    },
];

export const photosLinks = [
    {
        id: 1,
        icon: "/icons/gicon1.svg",
        title: "Library",
    },
    {
        id: 2,
        icon: "/icons/gicon2.svg",
        title: "Memories",
    },
    {
        id: 3,
        icon: "/icons/file.svg",
        title: "Places",
    },
    {
        id: 4,
        icon: "/icons/gicon4.svg",
        title: "People",
    },
    {
        id: 5,
        icon: "/icons/gicon5.svg",
        title: "Favorites",
    },
];

export const gallery: { id: number; img: string }[] = [];

export const WORK_LOCATION: LocationItem = {
    id: 1,
    type: "work",
    name: "Work",
    icon: "/icons/work.svg",
    kind: "folder",
    children: [
        {
            id: 5,
            name: "Trading Agent",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-10 left-5",
            windowPosition: "top-[7vh] left-7",
            children: [
                {
                    id: 1,
                    name: "Trading Agent.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-10",
                    description: [
                        "Autonomous LLM-Based Trading Agent & Market Simulation.",
                        "Designed an autonomous decision-making agent leveraging large language models to analyze real-time market sentiment.",
                        "Modeled sequential decision trajectories and complex user interaction behaviors across dynamic market conditions.",
                    ],
                },
                {
                    id: 2,
                    name: "demo.com",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "#",
                    position: "top-10 right-20",
                },
                {
                    id: 5,
                    name: "Design.fig",
                    icon: "/images/plain.png",
                    kind: "file",
                    fileType: "fig",
                    href: "#",
                    position: "top-60 right-20",
                },
            ],
        },
    ],
};

export const ABOUT_LOCATION: LocationItem = {
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
            imageUrl: "/icons/user.svg",
        },
        {
            id: 4,
            name: "about-me.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-60 left-5",
            subtitle: "Full Stack Developer & AI/ML Researcher",
            description: [
                "Developer and AI/ML Researcher with expertise in full-stack development, AI/ML and trading systems.",
            ],
        },
    ],
};

export const RESUME_LOCATION: LocationItem = {
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
        },
    ],
};

export const TRASH_LOCATION: LocationItem = {
    id: 4,
    type: "trash",
    name: "Bin",
    icon: "/icons/trash.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "trash1.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            position: "top-10 left-10",
            imageUrl: "/images/trash-1.png",
        },
    ],
};

export const locations: Record<string, LocationItem> = {
    work: WORK_LOCATION,
    about: ABOUT_LOCATION,
    resume: RESUME_LOCATION,
    trash: TRASH_LOCATION,
};

export const INITIAL_Z_INDEX = 1000;

export interface WindowState {
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isRestoring?: boolean;
    zIndex: number;
    data: any;
}

export const WINDOW_CONFIG: Record<string, WindowState> = {
    finder: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    contact: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    resume: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    safari: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    photos: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    terminal: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    txtfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    imgfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
    trash: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
};
