
import React, { useMemo } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { PortfolioData } from '@/types/portfolio';
import { COMPONENT_NAMES } from '@/lib/editor-utils';
import { Trash2, Plus, BookOpen, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { SortableList } from '../dnd/sortable-list';
import { InlineEdit } from '../ui/inline-edit';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

interface EditablePublicationsProps {
    publications: PortfolioData['publications'];
    sectionTitle?: string;
    hidden?: boolean;
}

export const EditablePublications = (props: EditablePublicationsProps) => {
    const { connectors: { connect, drag }, actions: { setProp }, id } = useNode();
    const { enabled, actions: editorActions, query } = useEditor((state: any, query) => ({ enabled: state.options.enabled, query }));
    const publications = props.publications || [];
    const sectionTitle = props.sectionTitle;
    const isHidden = props.hidden;

    const toggleSectionVisibility = () => {
        setProp((props: any) => {
            props.hidden = !props.hidden;
        });
    };

    const toggleHide = (index: number) => {
        setProp((props: any) => {
            props.publications[index].hidden = !props.publications[index].hidden;
        });
    };
    const handleTitleChange = (newTitle: string) => setProp((props: any) => props.sectionTitle = newTitle);
    const handleDeleteSection = () => { if (confirm('Delete this entire Publications section? (Your data will be kept and can be re-added from the toolbox)')) editorActions.delete(id); };
    const handleMoveUp = () => { const parent = query.node(id).get().data.parent; if (!parent) return; const parentNode = query.node(parent).get(); const childNodes = parentNode.data.nodes || []; const currentIndex = childNodes.indexOf(id); if (currentIndex > 0) editorActions.move(id, parent, currentIndex - 1); };
    const handleMoveDown = () => { const parent = query.node(id).get().data.parent; if (!parent) return; const parentNode = query.node(parent).get(); const childNodes = parentNode.data.nodes || []; const currentIndex = childNodes.indexOf(id); if (currentIndex < childNodes.length - 1) editorActions.move(id, parent, currentIndex + 2); };  // +2 because node is temporarily removed

    const itemsWithIds = useMemo(() => {
        return publications.map((item, index) => ({
            ...item,
            id: item.id || `pub-${index}-${Date.now()}`
        }));
    }, [publications]);

    const handleReorder = (newItems: typeof itemsWithIds) => {
        setProp((props: any) => {
            props.publications = newItems;
        });
    };

    const handleUpdate = (index: number, field: string, value: string) => {
        setProp((props: any) => {
            props.publications[index][field] = value;
        });
    };

    const handleDelete = (index: number) => {
        setProp((props: any) => {
            props.publications.splice(index, 1);
        });
    };

    const handleAdd = () => {
        setProp((props: any) => {
            if (!props.publications) props.publications = [];
            props.publications.push({
                id: Date.now().toString(),
                title: "New Publication",
                summary: "Brief summary of the paper...",
                link: "",
                status: "NEW"
            });
        });
    };

    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative group border border-transparent ${enabled ? 'hover:border-dashed hover:border-blue-500/30' : ''} transition-all`}>
            {enabled && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 z-50 pointer-events-none rounded-br">
                    Publications Section
                </div>
            )}
            {enabled && (<div className="absolute top-2 right-2 flex gap-2 z-50"><button onClick={handleMoveUp} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title="Move Section Up"><ChevronUp size={16} /></button><button onClick={handleMoveDown} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title="Move Section Down"><ChevronDown size={16} /></button><button onClick={toggleSectionVisibility} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title={isHidden ? "Show Section" : "Hide Section"}>
                {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button><button onClick={handleDeleteSection} className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded transition-colors" title="Delete Section"><Trash2 size={16} /></button></div>)}

            <section id="publications" className="py-20 relative bg-[#050505]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gray-700 flex-1" />
                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center gap-4">
                            <InlineEdit value={sectionTitle || "Publications"} onChange={handleTitleChange} placeholder="Section Title" className="text-center" />
                            {isHidden && <span className="text-sm bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">Hidden from Public</span>}
                        </h2>
                        <div className="h-px bg-gray-700 flex-1" />
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <SortableList
                            items={itemsWithIds}
                            onChange={handleReorder}
                            strategy={verticalListSortingStrategy}
                            className="space-y-6"
                            disabled={!enabled}
                            renderItem={(pub, index, isOverlay) => (
                                <div className={`relative p-6 rounded-xl bg-white/5 border border-white/10 ${enabled ? 'hover:border-neon-blue/30' : ''} transition-all group/card ${isOverlay ? 'shadow-2xl bg-gray-900 z-50' : ''} ${pub.hidden ? 'opacity-50 grayscale' : ''}`}>

                                    {/* Action Buttons */}
                                    {!isOverlay && enabled && (
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleHide(index); }}
                                                className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                                                title={pub.hidden ? "Show Item" : "Hide Item"}
                                            >
                                                {pub.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                                                className="text-red-500/50 group-hover/card:text-red-500/100 transition-all p-1 hover:bg-red-500/10 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-4 items-start">
                                        <BookOpen size={24} className="text-neon-blue mt-1 shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <InlineEdit
                                                    value={pub.title}
                                                    onChange={(v) => handleUpdate(index, 'title', v)}
                                                    placeholder="Publication Title"
                                                />
                                                {pub.hidden && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">HIDDEN</span>}
                                            </h3>
                                            <div className="text-gray-400 text-sm leading-relaxed">
                                                <InlineEdit
                                                    value={pub.summary}
                                                    onChange={(v) => handleUpdate(index, 'summary', v)}
                                                    multiline
                                                    placeholder="Summary..."
                                                />
                                            </div>
                                            <div className="text-xs text-blue-400 break-all">
                                                <InlineEdit
                                                    value={pub.link || ""}
                                                    onChange={(v) => handleUpdate(index, 'link', v)}
                                                    placeholder="Link (Optional)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />

                        {enabled && (
                            <div className="mt-8 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={handleAdd}
                                    className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50 px-6 py-2.5 rounded-full flex items-center gap-2 mx-auto transition-all"
                                >
                                    <Plus size={18} /> Add Publication
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const PublicationsSettings = () => <div className="p-4 text-center text-gray-500">Edit on canvas</div>;

EditablePublications.craft = {
    displayName: COMPONENT_NAMES.PUBLICATIONS,
    related: { settings: PublicationsSettings }
};
