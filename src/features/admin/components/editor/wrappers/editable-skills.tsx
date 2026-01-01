
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { PortfolioData } from '@/types/portfolio';
import { COMPONENT_NAMES } from '@/features/admin/utils/helpers';
import { Plus, X, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { SortableList } from '../dnd/sortable-list';
import { InlineEdit } from '../ui/inline-edit';
import { rectSortingStrategy } from '@dnd-kit/sortable';
import { getDynamicGridClass } from '@/core/utils';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';

// --- Utils for ID generation ---
const generateId = () => Math.random().toString(36).substr(2, 9);

interface EditableSkillsProps {
    skills: PortfolioData['skills'];
    sectionTitle?: string;
    hidden?: boolean;
}

export const EditableSkills = (props: EditableSkillsProps) => {
    const { connectors: { connect, drag }, actions: { setProp }, id } = useNode();
    const { enabled, actions: editorActions, query } = useEditor((state: any, query) => ({
        enabled: state.options.enabled,
        query
    }));
    const skills = props.skills || [];
    const sectionTitle = props.sectionTitle;
    const isHidden = props.hidden;

    const toggleSectionVisibility = () => {
        setProp((props: any) => {
            props.hidden = !props.hidden;
        });
    };

    const toggleCategoryVisibility = (index: number) => {
        setProp((props: any) => {
            props.skills[index].hidden = !props.skills[index].hidden;
        });
    };

    const handleTitleChange = (newTitle: string) => {
        setProp((props: any) => {
            props.sectionTitle = newTitle;
        });
    };

    const handleDeleteSection = () => {
        editorActions.delete(id);
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
            // Craft.js requires currentIndex + 2 for moveDown because the node is temporarily removed
            editorActions.move(id, parent, currentIndex + 2);
        }
    };

    // We need to maintain stable IDs for dnd-kit.
    // We use a ref to store a mapping of Item Reference -> ID.
    // This allows us to persist IDs even when data is mutated via setProp (as long as object refs or content signatures are tracked).
    // Since setProp creates new object references, we might need a signature based (category name + index?) approach or just rely on local state wrapping.

    // Approach: wrapper state component that syncs with props.
    // However, syncing complex nested state is hard. 
    // Simplified User Experience: We rely on the fact that changing `skills` prop re-renders this. 
    // We will generate stable IDs based on (Category Name + Index) which is semi-stable. 
    // If user renames category, ID changes -> small flash, acceptable for now.
    // actually, simpler: Just use a completely local state for the Drag operation, and commit to setProp on DragEnd.

    // Better: We wrap the data in a `SortableList` compatible format just for rendering.
    // We create a map of IDs.

    const [categoryIds, setCategoryIds] = useState<string[]>([]);

    // Sync IDs when skills length changes
    useEffect(() => {
        setCategoryIds(prev => {
            if (skills.length === prev.length) return prev;
            return skills.map(() => generateId());
        });
    }, [skills.length]);

    // Derived state with IDs
    const categoriesWithIds = useMemo(() => {
        return skills.map((cat, i) => ({
            ...cat,
            id: categoryIds[i] || generateId() // Fallback if sync hasn't happened yet
        }));
    }, [skills, categoryIds]);


    const handleCategoriesChange = (newItems: typeof categoriesWithIds) => {
        // newItems has the new order.
        // We need to map this back to the clean `skills` array (without IDs) and call setProp.
        setProp((props: any) => {
            props.skills = newItems.map(({ id, ...rest }) => rest);
        });

        // Also update local IDs to match new order to prevent flash
        setCategoryIds(newItems.map(i => i.id));
    };

    const handleUpdateCategory = (index: number, newCategory: string) => {
        setProp((props: any) => {
            props.skills[index].category = newCategory;
        });
    };

    const handleDeleteCategory = (index: number) => {
        setProp((props: any) => {
            props.skills.splice(index, 1);
        });
        setCategoryIds(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddCategory = () => {
        setProp((props: any) => {
            if (!props.skills) props.skills = [];
            props.skills.push({
                category: "New Category",
                items: ["Skill 1", "Skill 2"]
            });
        });
        setCategoryIds(prev => [...prev, generateId()]);
    };

    // --- Skills (Inner List) Handlers ---

    // Inner lists need their own IDs too. 
    // Since skills are just strings ["React", "Node"], we can't attach IDs easily.
    // We will wrap them into objects { id, value } for the SortableList, then unwrap.

    const renderSkillsList = (categoryIndex: number, items: string[]) => {
        // Generate stable-ish IDs for strings: use index? 
        // Problem (Index as ID): Moving item 0 to 1 makes item 0 take item 1's ID. 
        // Dnd-kit handles this if we use `SortableContext` strategy correctly? 
        // Actually, for strings, wrapping them in objects {id, text} is best.
        // We'll generate IDs based on the string content + index (to handle duplicates).

        const skillItems = items.map((skill, i) => ({
            id: `skill-${categoryIndex}-${i}-${skill}`, // Semi-stable
            text: skill
        }));

        const handleSkillsReorder = (newSkillItems: typeof skillItems) => {
            setProp((props: any) => {
                props.skills[categoryIndex].items = newSkillItems.map(i => i.text);
            });
        };

        const handleUpdateSkill = (skillIndex: number, newVal: string) => {
            setProp((props: any) => {
                props.skills[categoryIndex].items[skillIndex] = newVal;
            });
        };

        const handleDeleteSkill = (skillIndex: number) => {
            setProp((props: any) => {
                props.skills[categoryIndex].items.splice(skillIndex, 1);
            });
        };

        const handleAddSkill = () => {
            setProp((props: any) => {
                props.skills[categoryIndex].items.push("New Skill");
            });
        };

        return (
            <div className="mt-4">
                <SortableList
                    items={skillItems}
                    onChange={handleSkillsReorder}
                    strategy={rectSortingStrategy} // Use rect strategy for flex-wrap
                    className="flex flex-wrap gap-2"
                    disabled={!enabled}
                    renderItem={(item, index, isOverlay) => (
                        <div className="group/skill relative">
                            <div className={`px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-2 ${isOverlay ? 'shadow-lg bg-gray-800' : ''}`}>
                                {/* Drag Handle (invisible or whole item) */}
                                <InlineEdit
                                    value={item.text}
                                    onChange={(val) => handleUpdateSkill(index, val)}
                                    className="min-w-[40px] text-center"
                                />
                                {!isOverlay && enabled && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteSkill(index); }}
                                        className="opacity-0 group-hover/skill:opacity-100 text-red-400 hover:text-red-500 transition-opacity ml-1"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                />
                {enabled && (
                    <button
                        onClick={handleAddSkill}
                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <Plus size={12} /> Add Skill
                    </button>
                )}
            </div>
        );
    };


    return (
        <div
            ref={(ref) => { if (ref) connect(drag(ref)); }}
            className={`relative group min-h-[100px] border border-transparent ${enabled ? 'hover:border-dashed hover:border-blue-500/30' : ''} transition-all`}
        >
            {/* Component Label */}
            {enabled && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 z-50 pointer-events-none rounded-br">
                    Skills Section (Editable)
                </div>
            )}

            {/* Section Controls */}
            {enabled && (
                <div className="absolute top-2 right-2 flex gap-2 z-50">
                    {/* Reorder Arrows */}
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
                    {/* Delete Button */}
                    <button
                        onClick={handleDeleteSection}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded transition-colors"
                        title="Delete Section"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button onClick={toggleSectionVisibility} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title={isHidden ? "Show Section" : "Hide Section"}>
                        {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            )}

            <section id="skills" className="py-20 relative bg-[#050505]"> {/* Dark background to match theme */}
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gray-700 flex-1" />
                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green flex items-center justify-center gap-4">
                            <InlineEdit
                                value={sectionTitle || "Technical Skills"}
                                onChange={handleTitleChange}
                                placeholder="Section Title"
                                className="text-center"
                            />
                            {isHidden && <span className="text-sm bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">Hidden from Public</span>}
                        </h2>
                        <div className="h-px bg-gray-700 flex-1" />
                    </div>

                    <SortableList
                        items={categoriesWithIds}
                        onChange={handleCategoriesChange}
                        strategy={rectSortingStrategy}
                        className={`grid grid-cols-1 md:grid-cols-2 ${getDynamicGridClass(categoriesWithIds.length, 2)} gap-6 max-w-5xl mx-auto`}
                        disabled={!enabled}
                        renderItem={(cat, index, isOverlay) => (
                            <div className={`h-full p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 ${isOverlay ? 'shadow-2xl scale-105 bg-gray-900 z-50' : (enabled ? 'hover:border-neon-blue/30 transition-colors' : '')} ${cat.hidden ? 'opacity-50 grayscale' : ''}`}>
                                <div className="flex justify-between items-start mb-4 group/cat-header">
                                    <h3 className="text-xl font-bold text-neon-blue flex-1 flex items-center gap-2">
                                        <InlineEdit
                                            value={cat.category}
                                            onChange={(val) => handleUpdateCategory(index, val)}
                                            className="font-bold"
                                        />
                                        {cat.hidden && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">HIDDEN</span>}
                                    </h3>
                                    {!isOverlay && enabled && (
                                        <div className="flex items-center">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleCategoryVisibility(index); }}
                                                className="ml-2 text-gray-400 hover:text-white opacity-0 group-hover/cat-header:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
                                                title={cat.hidden ? "Show Category" : "Hide Category"}
                                            >
                                                {cat.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(index); }}
                                                className="ml-2 text-red-500/50 hover:text-red-500 opacity-0 group-hover/cat-header:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {renderSkillsList(index, cat.items)}
                            </div>
                        )}
                    />

                    {enabled && (
                        <div className="mt-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={handleAddCategory}
                                className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50 px-4 py-2 rounded-full flex items-center gap-2 mx-auto transition-all"
                            >
                                <Plus size={16} /> Add Category
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div >
    );
};

// Simplified Settings Panel
const SkillsSettings = () => {
    return (
        <div className="p-4 text-sm text-gray-500 text-center">
            Edit skills directly on the canvas.
            <br />Drag items to reorder.
        </div>
    );
};

EditableSkills.craft = {
    displayName: COMPONENT_NAMES.SKILLS,
    related: {
        settings: SkillsSettings
    }
};
