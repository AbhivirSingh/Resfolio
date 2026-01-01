
import React, { useMemo } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { PortfolioData } from '@/types/portfolio';
import { COMPONENT_NAMES } from '@/features/admin/utils/helpers';
import { Trash2, Plus, Code2, ExternalLink, Github, ChevronRight, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useDeleteItem } from '../../../hooks/use-delete-item';
import { SortableList } from '../dnd/sortable-list';
import { InlineEdit } from '../ui/inline-edit';
import { LinkPopover } from '../ui/link-popover';
import { verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';

interface EditableProjectsProps {
    projects: PortfolioData['projects'];
    sectionTitle?: string;
    hidden?: boolean;
}

export const EditableProjects = (props: EditableProjectsProps) => {

    const { connectors: { connect, drag }, actions: { setProp }, id } = useNode();
    const { deleteItem, isDeleting } = useDeleteItem();
    const { enabled, actions: editorActions, query } = useEditor((state: any, query) => ({
        enabled: state.options.enabled,
        query
    }));
    const projects = props.projects || [];
    const sectionTitle = props.sectionTitle;
    const isHidden = props.hidden;

    const handleTitleChange = (newTitle: string) => {
        setProp((props: any) => {
            props.sectionTitle = newTitle;
        });
    };

    const handleDeleteSection = async () => {
        const success = await deleteItem('projects');
        if (success) {
            editorActions.delete(id);
        }
    };

    const toggleSectionVisibility = () => {
        setProp((props: any) => {
            props.hidden = !props.hidden;
        });
    };

    const handleMoveUp = () => {
        const parent = query.node(id).get().data.parent;
        if (!parent) return;
        const parentNode = query.node(parent).get();
        const childNodes = parentNode.data.nodes || [];
        const currentIndex = childNodes.indexOf(id);
        if (currentIndex > 0) {
            editorActions.move(id, parent, currentIndex - 1);
        }
    };

    const handleMoveDown = () => {
        const parent = query.node(id).get().data.parent;
        if (!parent) return;
        const parentNode = query.node(parent).get();
        const childNodes = parentNode.data.nodes || [];
        const currentIndex = childNodes.indexOf(id);
        if (currentIndex < childNodes.length - 1) {
            editorActions.move(id, parent, currentIndex + 2);  // +2 because node is temporarily removed
        }
    };

    const itemsWithIds = useMemo(() => {
        return projects.map((item, index) => ({
            ...item,
            id: item.id || `proj-${index}-${Date.now()}`
        }));
    }, [projects]);

    // Helpers
    const updateProject = (index: number, field: string, value: any) => {
        setProp((props: any) => {
            props.projects[index][field] = value;
        });
    };

    const reorderProjects = (newItems: typeof itemsWithIds) => {
        setProp((props: any) => {
            props.projects = newItems;
        });
    };

    const addProject = () => {
        setProp((props: any) => {
            if (!props.projects) props.projects = [];
            props.projects.push({
                id: Date.now().toString(),
                title: "New Project",
                techStack: ["React", "TypeScript"],
                bullets: ["Key feature 1"],
                status: "NEW",
                liveUrl: "",
                githubUrl: ""
            });
        });
    };

    const deleteProject = async (index: number, itemId: string) => {
        const success = await deleteItem('projects', itemId);
        if (success) {
            setProp((props: any) => {
                props.projects.splice(index, 1);
            });
        }
    };

    const toggleHide = (index: number) => {
        setProp((props: any) => {
            const item = props.projects[index];
            item.hidden = !item.hidden;
        });
    };

    // Tech Stack Helpers
    const updateTech = (pIndex: number, tIndex: number, val: string) => {
        setProp((props: any) => {
            props.projects[pIndex].techStack[tIndex] = val;
        });
    };
    const addTech = (pIndex: number) => {
        setProp((props: any) => {
            props.projects[pIndex].techStack.push("Tech");
        });
    };
    const deleteTech = (pIndex: number, tIndex: number) => {
        setProp((props: any) => {
            props.projects[pIndex].techStack.splice(tIndex, 1);
        });
    };

    // Bullets Helpers
    const updateBullet = (pIndex: number, bIndex: number, val: string) => {
        setProp((props: any) => {
            props.projects[pIndex].bullets[bIndex] = val;
        });
    };
    const addBullet = (pIndex: number) => {
        setProp((props: any) => {
            props.projects[pIndex].bullets.push("New Feature");
        });
    };
    const deleteBullet = (pIndex: number, bIndex: number) => {
        setProp((props: any) => {
            props.projects[pIndex].bullets.splice(bIndex, 1);
        });
    };


    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative group border border-transparent ${enabled ? 'hover:border-dashed hover:border-blue-500/30' : ''} transition-all`}>
            {enabled && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 z-50 pointer-events-none rounded-br">
                    Projects Section
                </div>
            )}

            {/* Section Controls */}
            {enabled && (
                <div className="absolute top-2 right-2 flex gap-2 z-50">
                    <button onClick={handleMoveUp} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title="Move Section Up">
                        <ChevronUp size={16} />
                    </button>
                    <button onClick={handleMoveDown} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title="Move Section Down">
                        <ChevronDown size={16} />
                    </button>
                    <button
                        onClick={toggleSectionVisibility}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded transition-colors"
                        title={isHidden ? "Show Section" : "Hide Section"}
                    >
                        {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={handleDeleteSection} className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded transition-colors" title="Delete Section">
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            <section id="projects" className={`py-20 relative bg-[#050505] ${isHidden ? 'opacity-50 grayscale' : ''}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gray-700 flex-1" />
                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                            <InlineEdit
                                value={sectionTitle || "Featured Projects"}
                                onChange={handleTitleChange}
                                placeholder="Section Title"
                                className="text-center"
                            />
                            {isHidden && <span className="ml-4 text-sm bg-gray-800 text-gray-400 px-2 py-1 rounded">Hidden from Public</span>}
                        </h2>
                        <div className="h-px bg-gray-700 flex-1" />
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <SortableList
                            items={itemsWithIds}
                            onChange={reorderProjects}
                            strategy={verticalListSortingStrategy}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            renderItem={(project, index, isOverlay) => (
                                <div className={`h-full bg-white/5 border border-white/10 rounded-xl overflow-hidden ${enabled ? 'hover:border-neon-purple/50' : ''} transition-all group/card flex flex-col ${isOverlay ? 'shadow-2xl bg-gray-900 z-50' : ''} ${project.hidden ? 'opacity-50 grayscale' : ''}`}>

                                    {/* Controls */}
                                    {!isOverlay && enabled && (
                                        <div className="absolute top-2 right-2 z-20 flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleHide(index); }}
                                                className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
                                                title={project.hidden ? "Show" : "Hide"}
                                            >
                                                {project.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteProject(index, project.id); }}
                                                className="text-red-500/70 hover:text-red-500 p-1 rounded hover:bg-red-500/10"
                                                title="Delete Permanently"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="h-2 bg-gradient-to-r from-neon-blue to-neon-purple" />

                                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-bold text-white flex-1 mr-4 flex items-center gap-2">
                                                <InlineEdit
                                                    value={project.title}
                                                    onChange={(v) => updateProject(index, 'title', v)}
                                                    placeholder="Project Title"
                                                />
                                                {project.hidden && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">HIDDEN</span>}
                                            </h3>
                                            <div className="flex gap-3">
                                                <LinkPopover
                                                    value={project.githubUrl}
                                                    onChange={(v) => updateProject(index, 'githubUrl', v)}
                                                    placeholder="GitHub Repo URL"
                                                >
                                                    <Github size={20} className={`cursor-pointer transition-colors ${project.githubUrl ? 'text-white hover:text-neon-blue' : 'text-gray-600 hover:text-gray-400'}`} />
                                                </LinkPopover>

                                                <LinkPopover
                                                    value={project.liveUrl}
                                                    onChange={(v) => updateProject(index, 'liveUrl', v)}
                                                    placeholder="Live Project URL"
                                                >
                                                    <ExternalLink size={20} className={`cursor-pointer transition-colors ${project.liveUrl ? 'text-white hover:text-neon-purple' : 'text-gray-600 hover:text-gray-400'}`} />
                                                </LinkPopover>
                                            </div>
                                        </div>

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map((tech, tIndex) => (
                                                <span key={tIndex} className="px-2 py-1 bg-neon-purple/10 text-neon-purple text-xs rounded border border-neon-purple/20 flex items-center gap-1 group/tag">
                                                    <InlineEdit
                                                        value={tech}
                                                        onChange={(v) => updateTech(index, tIndex, v)}
                                                        className="min-w-[30px]"
                                                    />
                                                    {enabled && (
                                                        <button onClick={() => deleteTech(index, tIndex)} className="hidden group-hover/tag:block text-red-400 hover:text-red-500">
                                                            <Trash2 size={10} />
                                                        </button>
                                                    )}
                                                </span>
                                            ))}
                                            {enabled && (
                                                <button onClick={() => addTech(index)} className="px-2 py-1 text-xs text-gray-500 border border-dashed border-gray-600 rounded hover:text-white hover:border-white">
                                                    + Tech
                                                </button>
                                            )}
                                        </div>

                                        {/* Bullets */}
                                        <ul className="space-y-2 flex-1">
                                            {(project.bullets || []).map((bullet, bIndex) => (
                                                <li key={bIndex} className="flex items-start gap-2 text-gray-300 text-sm group/bullet">
                                                    <ChevronRight size={16} className="text-neon-blue mt-0.5 shrink-0" />
                                                    <div className="flex-1">
                                                        <InlineEdit
                                                            value={bullet}
                                                            onChange={(v) => updateBullet(index, bIndex, v)}
                                                            multiline
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    {enabled && (
                                                        <button onClick={() => deleteBullet(index, bIndex)} className="opacity-0 group-hover/bullet:opacity-100 text-red-500/50 hover:text-red-500 shrink-0">
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                            {enabled && (
                                                <li>
                                                    <button onClick={() => addBullet(index)} className="text-xs text-blue-400 hover:underline pl-6">
                                                        + Add Feature
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        />

                        {enabled && (
                            <div className="mt-12 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={addProject}
                                    className="bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple border border-neon-purple/50 px-6 py-2.5 rounded-full flex items-center gap-2 mx-auto transition-all"
                                >
                                    <Plus size={18} /> Add Project
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const ProjectsSettings = () => {
    return <div className="p-4 text-sm text-gray-500 text-center">Edit directly on canvas</div>;
};

EditableProjects.craft = {
    displayName: COMPONENT_NAMES.PROJECTS,
    related: {
        settings: ProjectsSettings
    }
};
