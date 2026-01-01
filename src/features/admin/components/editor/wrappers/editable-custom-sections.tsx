
import React, { useMemo } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { PortfolioData } from '@/types/portfolio';
import { COMPONENT_NAMES } from '@/features/admin/utils/helpers';
import { Trash2, Plus, Layout, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { SortableList } from '../dnd/sortable-list';
import { InlineEdit } from '../ui/inline-edit';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

interface EditableCustomSectionsProps {
    customSections: PortfolioData['customSections'];
    sectionTitle?: string;
    hidden?: boolean;
}

export const EditableCustomSections = (props: EditableCustomSectionsProps) => {
    const { connectors: { connect, drag }, actions: { setProp }, id } = useNode();
    const { enabled, actions: editorActions, query } = useEditor((state: any, query) => ({ enabled: state.options.enabled, query }));
    const customSections = props.customSections || [];
    const sectionTitle = props.sectionTitle;
    const isHidden = props.hidden;

    const toggleGroupVisibility = () => {
        setProp((props: any) => {
            props.hidden = !props.hidden;
        });
    };

    const toggleSectionVisibility = (index: number) => {
        setProp((props: any) => {
            props.customSections[index].hidden = !props.customSections[index].hidden;
        });
    };

    const handleTitleChange = (newTitle: string) => setProp((props: any) => props.sectionTitle = newTitle);
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
            editorActions.move(id, parent, currentIndex + 2); // +2 because craftjs move calculation for down requires it
        }
    };

    const itemsWithIds = useMemo(() => {
        return customSections.map((section, index) => ({
            ...section,
            id: section.id || `section-${index}-${Date.now()}`
        }));
    }, [customSections]);

    const handleReorder = (newItems: typeof itemsWithIds) => {
        setProp((props: any) => {
            props.customSections = newItems;
        });
    };

    const handleSectionUpdate = (sectionIndex: number, field: string, value: string) => {
        setProp((props: any) => {
            props.customSections[sectionIndex][field] = value;
        });
    };

    const handleItemUpdate = (sectionIndex: number, itemIndex: number, value: string) => {
        setProp((props: any) => {
            props.customSections[sectionIndex].items[itemIndex] = value;
        });
    };

    const handleItemDelete = (sectionIndex: number, itemIndex: number) => {
        setProp((props: any) => {
            props.customSections[sectionIndex].items.splice(itemIndex, 1);
        });
    };

    const handleItemAdd = (sectionIndex: number) => {
        setProp((props: any) => {
            props.customSections[sectionIndex].items.push("New Item");
        });
    };

    const handleSectionDelete = (sectionIndex: number) => {
        setProp((props: any) => {
            props.customSections.splice(sectionIndex, 1);
        });
    };

    const handleSectionAdd = () => {
        setProp((props: any) => {
            if (!props.customSections) props.customSections = [];
            props.customSections.push({
                id: Date.now().toString(),
                title: "New Section",
                items: ["Item 1"]
            });
        });
    };

    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative group border border-transparent ${enabled ? 'hover:border-dashed hover:border-blue-500/30' : ''} transition-all`}>
            {enabled && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 z-50 pointer-events-none rounded-br">
                    Custom Sections
                </div>
            )}
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
                        onClick={handleDeleteSection}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded transition-colors"
                        title="Delete Section"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button onClick={toggleGroupVisibility} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title={isHidden ? "Show Group" : "Hide Group"}>
                        {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            )}

            <div className="py-20 relative bg-[#050505]">
                <div className="container mx-auto px-4 text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple inline-block">
                        <InlineEdit
                            value={sectionTitle || "Custom Sections"}
                            onChange={handleTitleChange}
                            placeholder="Group Title"
                        />
                        {isHidden && <span className="text-sm bg-gray-800 text-gray-400 px-2 py-1 ml-4 rounded border border-gray-700 align-middle">Hidden from Public</span>}
                    </h2>
                </div>
                <div className="container mx-auto px-4">
                    <SortableList
                        items={itemsWithIds}
                        onChange={handleReorder}
                        strategy={verticalListSortingStrategy}
                        className="space-y-16 max-w-5xl mx-auto"
                        disabled={!enabled}
                        renderItem={(section, sectionIndex, isOverlay) => (
                            <section key={section.id} className={`relative ${isOverlay ? 'shadow-2xl bg-gray-900 z-50 p-4 rounded-xl' : ''} ${section.hidden ? 'opacity-50 grayscale' : ''}`}>
                                <div className="flex items-center gap-4 mb-12 group/section">
                                    <div className="h-px bg-gray-700 flex-1" />
                                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple relative">
                                        <InlineEdit
                                            value={section.title}
                                            onChange={(v) => handleSectionUpdate(sectionIndex, 'title', v)}
                                            placeholder="Section Title"
                                        />
                                        {!isOverlay && enabled && (
                                            <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(sectionIndex); }}
                                                    className="opacity-0 group-hover/section:opacity-100 text-gray-400 hover:text-white p-1 rounded transition-all"
                                                    title={section.hidden ? "Show Section" : "Hide Section"}
                                                >
                                                    {section.hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleSectionDelete(sectionIndex); }}
                                                    className="opacity-0 group-hover/section:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </h2>
                                    <div className="h-px bg-gray-700 flex-1" />
                                </div>

                                <div className="space-y-4">
                                    {section.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="group/item flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/30 transition-all relative">
                                            <span className="text-neon-purple mt-1.5">•</span>
                                            <div className="flex-1 text-gray-300">
                                                <InlineEdit
                                                    value={item}
                                                    onChange={(v) => handleItemUpdate(sectionIndex, itemIndex, v)}
                                                    placeholder="Item text..."
                                                    multiline
                                                />
                                            </div>
                                            {enabled && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleItemDelete(sectionIndex, itemIndex); }}
                                                    className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:bg-red-500/10 p-1 rounded transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {enabled && (
                                        <button
                                            onClick={() => handleItemAdd(sectionIndex)}
                                            className="flex items-center gap-2 text-sm text-neon-blue/70 hover:text-neon-blue ml-6"
                                        >
                                            <Plus size={14} /> Add Item
                                        </button>
                                    )}
                                </div>
                            </section>
                        )}
                    />

                    {enabled && (
                        <div className="mt-16 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={handleSectionAdd}
                                className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50 px-6 py-2.5 rounded-full flex items-center gap-2 mx-auto transition-all"
                            >
                                <Plus size={18} /> Add Custom Section
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CustomSectionsSettings = () => {
    return <div className="p-4 text-sm text-gray-500 text-center">Edit directly on canvas</div>;
};

EditableCustomSections.craft = {
    displayName: COMPONENT_NAMES.CUSTOM_SECTIONS,
    related: {
        settings: CustomSectionsSettings
    }
};
