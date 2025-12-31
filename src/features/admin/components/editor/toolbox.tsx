
import React from "react";
import { useEditor, Element } from "@craftjs/core";
import { EditableHero } from "./wrappers/editable-hero";
import { EditableExperience } from "./wrappers/editable-experience";
import { EditableProjects } from "./wrappers/editable-projects";
import { EditableSkills } from "./wrappers/editable-skills";
import { EditableEducation } from "./wrappers/editable-education";
import { EditableCertifications } from "./wrappers/editable-certifications";
import { EditablePublications } from "./wrappers/editable-publications";
import { EditableExtracurricular } from "./wrappers/editable-extracurricular";
import { EditableAchievements } from "./wrappers/editable-achievements";
import { EditableCoursework } from "./wrappers/editable-coursework";
import { EditableCustomSections } from "./wrappers/editable-custom-sections";
import { User, Briefcase, Code2, Cpu, GraduationCap, Award, Book, Users, Trophy, BookOpen, Layout } from "lucide-react";

export const Toolbox = () => {
    const { connectors, query, actions } = useEditor();

    const addItem = (component: React.ReactElement, name: string) => {
        const { node } = query.createNode(React.cloneElement(component));

        // Find the Container node to add to
        // In this simple setup, we assume the first logical container in the parsed tree or the root canvas's first child
        // But simpler: we just add to the ROOT canvas's child container.

        // We need to know which node is the "Container". 
        // We can get the text of the Root node.
        const rootNodeId = query.getNodes()['ROOT'].data.nodes[0]; // Usually the Container

        if (rootNodeId) {
            actions.add(node, rootNodeId);
        } else {
            // Fallback to ROOT if structure is different
            const rootId = 'ROOT';
            // Check if ROOT accepts it. ROOT usually expects an Element as child
            actions.add(node, rootId);
        }
    };

    return (
        <div className="w-64 bg-white border-r h-full flex flex-col shadow-sm">
            <div className="p-4 border-b">
                <h2 className="font-bold text-lg text-gray-800">Components</h2>
                <p className="text-xs text-gray-500">Drag or click to add</p>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableHero personalInfo={{ name: "Your Name", title: "Title", bio: "Bio", email: "email@example.com", phone: "", location: "" }} />)}
                    onClick={() => addItem(<EditableHero personalInfo={{ name: "New Name", title: "New Title", bio: "New Bio", email: "email@example.com", phone: "", location: "" }} />, "Hero")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <User size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Hero Section</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableExperience experience={[]} />)}
                    onClick={() => addItem(<EditableExperience experience={[{ id: Date.now().toString(), company: "New Co", role: "New Role", date: "2024", description: "Desc...", location: "", status: "NEW" }]} />, "Experience")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <Briefcase size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Experience</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableProjects projects={[]} />)}
                    onClick={() => addItem(<EditableProjects projects={[{ id: Date.now().toString(), title: "New Project", techStack: ["React"], bullets: ["Feature"], status: "NEW" }]} />, "Projects")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <Code2 size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Projects</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableSkills skills={[{ category: "Frontend", items: ["React", "CSS"] }]} />)}
                    onClick={() => addItem(<EditableSkills skills={[{ category: "New Category", items: ["New Skill"] }]} />, "Skills")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <Cpu size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Skills</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableEducation education={[]} />)}
                    onClick={() => addItem(<EditableEducation education={[{ id: Date.now().toString(), degree: "Degree", institute: "Institute", year: "2024", score: "4.0", status: "NEW" }]} />, "Education")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <GraduationCap size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Education</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableCertifications certifications={[]} />)}
                    onClick={() => addItem(<EditableCertifications certifications={[{ id: Date.now().toString(), name: "Cert Name", issuer: "Issuer", link: "", status: "NEW" }]} />, "Certifications")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <Award size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Certifications</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditablePublications publications={[]} />)}
                    onClick={() => addItem(<EditablePublications publications={[{ id: Date.now().toString(), title: "Title", summary: "Summary", link: "", status: "NEW" }]} />, "Publications")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <Book size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Publications</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableExtracurricular extracurricular={[]} />)}
                    onClick={() => addItem(<EditableExtracurricular extracurricular={[{ id: Date.now().toString(), role: "Role", organization: "Org", status: "NEW" }]} />, "Extracurricular")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <Users size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Extracurricular</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableAchievements achievements={[]} />)}
                    onClick={() => addItem(<EditableAchievements achievements={["New Achievement"]} />, "Achievements")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <Trophy size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Achievements</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableCoursework coursework={[]} />)}
                    onClick={() => addItem(<EditableCoursework coursework={["Course 1", "Course 2"]} />, "Coursework")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <BookOpen size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Coursework</span>
                </div>

                <div
                    ref={(ref) => void connectors.create(ref as HTMLElement, <EditableCustomSections customSections={[]} />)}
                    onClick={() => addItem(<EditableCustomSections customSections={[{ id: Date.now().toString(), title: "Custom Section", items: ["Item 1"] }]} />, "Custom Sections")}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded cursor-move hover:bg-gray-100 hover:border-blue-500 transition-colors"
                >
                    <Layout size={20} className="text-gray-600" />
                    <span className="text-sm font-medium">Custom Sections</span>
                </div>
            </div>
        </div>
    );
};

