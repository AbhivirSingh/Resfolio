
import React, { useMemo } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { PortfolioData } from '@/types/portfolio';
import { COMPONENT_NAMES } from '@/lib/editor-utils';
import { Trash2, Plus, Calendar, MapPin, Building2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useDeleteItem } from '../../../hooks/use-delete-item';
import { SortableList } from '../dnd/sortable-list';
import { InlineEdit } from '../ui/inline-edit';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

interface EditableExperienceProps {
    experience: PortfolioData['experience'];
    sectionTitle?: string;
    hidden?: boolean;
}

export const EditableExperience = (props: EditableExperienceProps) => {
    const { connectors: { connect, drag }, actions: { setProp }, id } = useNode();
    const { deleteItem, isDeleting } = useDeleteItem();
    const { enabled, actions: editorActions, query } = useEditor((state: any, query) => ({
        enabled: state.options.enabled,
        query
    }));
    const experience = props.experience || [];
    const sectionTitle = props.sectionTitle;
    const isHidden = props.hidden;

    const handleTitleChange = (newTitle: string) => {
        setProp((props: any) => {
            props.sectionTitle = newTitle;
        });
    };

    const handleDeleteSection = async () => {
        const success = await deleteItem('experience');
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

    // Ensure ID stability for dnd
    const itemsWithIds = useMemo(() => {
        return experience.map((item, index) => ({
            ...item,
            id: item.id || `exp-${index}-${Date.now()}`
        }));
    }, [experience]);

    const handleReorder = (newItems: typeof itemsWithIds) => {
        setProp((props: any) => {
            props.experience = newItems;
        });
    };

    const handleUpdate = (index: number, field: string, value: string) => {
        setProp((props: any) => {
            props.experience[index][field] = value;
        });
    };

    const handleDelete = async (index: number, itemId: string) => {
        const success = await deleteItem('experience', itemId);
        if (success) {
            setProp((props: any) => {
                props.experience.splice(index, 1);
            });
        }
    };

    const toggleHide = (index: number) => {
        setProp((props: any) => {
            const item = props.experience[index];
            item.hidden = !item.hidden;
        });
    };

    const handleAdd = () => {
        setProp((props: any) => {
            if (!props.experience) props.experience = [];
            props.experience.push({
                id: Date.now().toString(),
                company: "Company Name",
                role: "Role Title",
                date: "2023 - Present",
                description: "Describe your responsibilities and achievements...",
                location: "Location",
                status: "NEW"
            });
        });
    };

    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative group border border-transparent ${enabled ? 'hover:border-dashed hover:border-blue-500/30' : ''} transition-all`}>
            {enabled && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 z-50 pointer-events-none rounded-br">
                    Experience
                </div>
            )}

            {/* Section Controls */}
            {enabled && (
                <div className="absolute top-2 right-2 flex gap-2 z-50">
                    <button
                        onClick={handleMoveUp}
                        className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors"
                        title="Move Section Up"
                    >
                        <ChevronUp size={16} />
                    </button>
                    <button
                        onClick={handleMoveDown}
                        className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors"
                        title="Move Section Down"
                    >
                        <ChevronDown size={16} />
                    </button>
                    <button
                        onClick={toggleSectionVisibility}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded transition-colors"
                        title={isHidden ? "Show Section" : "Hide Section"}
                    >
                        {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                        onClick={handleDeleteSection}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded transition-colors"
                        title="Delete Section"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            <section id="experience" className={`py-20 relative bg-[#050505] ${isHidden ? 'opacity-50 grayscale' : ''}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gray-700 flex-1" />
                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                            <InlineEdit
                                value={sectionTitle || "Experience"}
                                onChange={handleTitleChange}
                                placeholder="Section Title"
                                className="text-center"
                            />
                            {isHidden && <span className="ml-4 text-sm bg-gray-800 text-gray-400 px-2 py-1 rounded">Hidden from Public</span>}
                        </h2>
                        <div className="h-px bg-gray-700 flex-1" />
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <SortableList
                            items={itemsWithIds}
                            onChange={handleReorder}
                            strategy={verticalListSortingStrategy}
                            className="space-y-12"
                            disabled={!enabled}
                            renderItem={(job, index, isOverlay) => (
                                <div className={`relative pl-8 md:pl-0 border-l md:border-l-0 ${isOverlay ? 'shadow-2xl bg-gray-900 z-50 p-4 rounded-xl' : ''}`}>
                                    <div className={`md:flex items-center justify-between gap-12 group/item ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>

                                        {/* Content Side */}
                                        <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-right'} relative`}>
                                            <div className={`p-6 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/30 transition-all hover:bg-white/[0.07] group/card ${job.hidden ? 'opacity-50 grayscale' : ''}`}>
                                                {/* Controls */}
                                                {!isOverlay && enabled && (
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleHide(index); }}
                                                            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
                                                            title={job.hidden ? "Show" : "Hide"}
                                                        >
                                                            {job.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(index, job.id); }}
                                                            className="text-red-500/70 hover:text-red-500 p-1 rounded hover:bg-red-500/10"
                                                            title="Delete Permanently"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="space-y-4">
                                                    {/* Role & Company */}
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                                            <InlineEdit
                                                                value={job.role}
                                                                onChange={(v) => handleUpdate(index, 'role', v)}
                                                                placeholder="Role Title"
                                                                className="text-white"
                                                            />
                                                            {job.hidden && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">HIDDEN</span>}
                                                        </h3>
                                                        <div className="text-neon-blue font-medium flex items-center gap-2 justify-end md:justify-start">
                                                            <Building2 size={16} />
                                                            <InlineEdit
                                                                value={job.company}
                                                                onChange={(v) => handleUpdate(index, 'company', v)}
                                                                placeholder="Company Name"
                                                                className="text-neon-blue"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Date & Location */}
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 justify-end md:justify-start">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar size={14} />
                                                            <InlineEdit
                                                                value={job.date}
                                                                onChange={(v) => handleUpdate(index, 'date', v)}
                                                                placeholder="2023 - Present"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={14} />
                                                            <InlineEdit
                                                                value={job.location || ""}
                                                                onChange={(v) => handleUpdate(index, 'location', v)}
                                                                placeholder="Location"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Description Points */}
                                                    <div className="space-y-2">
                                                        {(job.description || "").split('\n').map((point, pointIndex, arr) => (
                                                            <div key={pointIndex} className="flex gap-2 items-start group/point">
                                                                <span className="text-neon-purple mt-1.5">•</span>
                                                                <div className="flex-1">
                                                                    <InlineEdit
                                                                        value={point}
                                                                        onChange={(v) => {
                                                                            const newPoints = [...arr];
                                                                            newPoints[pointIndex] = v;
                                                                            handleUpdate(index, 'description', newPoints.join('\n'));
                                                                        }}
                                                                        placeholder="Describe achievement..."
                                                                        multiline
                                                                        className="min-h-[1.5em]"
                                                                    />
                                                                </div>
                                                                {enabled && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            const newPoints = arr.filter((_, i) => i !== pointIndex);
                                                                            handleUpdate(index, 'description', newPoints.join('\n'));
                                                                        }}
                                                                        className="opacity-0 group-hover/point:opacity-100 text-red-400 hover:bg-red-500/10 p-1 rounded transition-all"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}

                                                        {enabled && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const current = job.description || "";
                                                                    const newDesc = current ? current + "\n" : "";
                                                                    handleUpdate(index, 'description', newDesc);
                                                                }}
                                                                className="flex items-center gap-1 text-xs text-neon-blue/70 hover:text-neon-blue mt-2 ml-4"
                                                            >
                                                                <Plus size={12} /> Add Point
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        />

                        {enabled && (
                            <div className="mt-12 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={handleAdd}
                                    className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50 px-6 py-2.5 rounded-full flex items-center gap-2 mx-auto transition-all"
                                >
                                    <Plus size={18} /> Add Experience
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const ExperienceSettings = () => {
    return <div className="p-4 text-sm text-gray-500 text-center">Edit directly on canvas</div>;
};

EditableExperience.craft = {
    displayName: COMPONENT_NAMES.EXPERIENCE,
    related: {
        settings: ExperienceSettings
    }
};
