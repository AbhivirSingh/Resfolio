
import React, { useMemo } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { COMPONENT_NAMES } from '@/lib/editor-utils';
import { Trash2, Plus, Trophy, ChevronUp, ChevronDown } from 'lucide-react';
import { SortableList } from '../dnd/sortable-list';
import { InlineEdit } from '../ui/inline-edit';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

interface EditableAchievementsProps {
    achievements: string[];
    sectionTitle?: string;
}

export const EditableAchievements = (props: EditableAchievementsProps) => {
    const { connectors: { connect, drag }, actions: { setProp }, id } = useNode();
    const { enabled, actions: editorActions, query } = useEditor((state: any, query) => ({ enabled: state.options.enabled, query }));
    const achievements = props.achievements || [];
    const sectionTitle = props.sectionTitle;
    const handleTitleChange = (newTitle: string) => setProp((props: any) => props.sectionTitle = newTitle);
    const handleDeleteSection = () => { if (confirm('Delete this entire Achievements section? (Your data will be kept and can be re-added from the toolbox)')) editorActions.delete(id); };
    const handleMoveUp = () => { const parent = query.node(id).get().data.parent; if (!parent) return; const parentNode = query.node(parent).get(); const childNodes = parentNode.data.nodes || []; const currentIndex = childNodes.indexOf(id); if (currentIndex > 0) editorActions.move(id, parent, currentIndex - 1); };
    const handleMoveDown = () => { const parent = query.node(id).get().data.parent; if (!parent) return; const parentNode = query.node(parent).get(); const childNodes = parentNode.data.nodes || []; const currentIndex = childNodes.indexOf(id); if (currentIndex < childNodes.length - 1) editorActions.move(id, parent, currentIndex + 2); };  // +2 because node is temporarily removed

    const itemsWithIds = useMemo(() => {
        return achievements.map((item, index) => ({
            id: `ach-${index}-${Date.now()}`,
            text: item
        }));
    }, [achievements]);

    const handleReorder = (newItems: typeof itemsWithIds) => {
        setProp((props: any) => {
            props.achievements = newItems.map(i => i.text);
        });
    };

    const handleUpdate = (index: number, value: string) => {
        setProp((props: any) => {
            props.achievements[index] = value;
        });
    };

    const handleDelete = (index: number) => {
        setProp((props: any) => {
            props.achievements.splice(index, 1);
        });
    };

    const handleAdd = () => {
        setProp((props: any) => {
            if (!props.achievements) props.achievements = [];
            props.achievements.push("New Achievement");
        });
    };

    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative group border border-transparent ${enabled ? 'hover:border-dashed hover:border-blue-500/30' : ''} transition-all`}>
            {enabled && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 z-50 pointer-events-none rounded-br">
                    Achievements Section
                </div>
            )}
            {enabled && (<div className="absolute top-2 right-2 flex gap-2 z-50"><button onClick={handleMoveUp} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title="Move Section Up"><ChevronUp size={16} /></button><button onClick={handleMoveDown} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title="Move Section Down"><ChevronDown size={16} /></button><button onClick={handleDeleteSection} className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded transition-colors" title="Delete Section"><Trash2 size={16} /></button></div>)}

            <section id="achievements" className="py-20 relative bg-[#050505]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gray-700 flex-1" />
                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple"><InlineEdit value={sectionTitle || "Achievements"} onChange={handleTitleChange} placeholder="Section Title" className="text-center" /></h2>
                        <div className="h-px bg-gray-700 flex-1" />
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <SortableList
                            items={itemsWithIds}
                            onChange={handleReorder}
                            strategy={verticalListSortingStrategy}
                            className="space-y-4"
                            disabled={!enabled}
                            renderItem={(item, index, isOverlay) => (
                                <div className={`relative p-4 rounded-xl bg-white/5 border border-white/10 ${enabled ? 'hover:border-neon-blue/30' : ''} transition-all group/card flex items-start gap-3 ${isOverlay ? 'shadow-2xl bg-gray-900 z-50' : ''}`}>

                                    {/* Delete Button */}
                                    {!isOverlay && enabled && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                                            className="absolute top-2 right-2 text-red-500/0 group-hover/card:text-red-500/100 transition-all p-1 hover:bg-red-500/10 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}

                                    <Trophy size={20} className="text-neon-blue mt-1 shrink-0" />
                                    <div className="flex-1 text-gray-300">
                                        <InlineEdit
                                            value={item.text}
                                            onChange={(v) => handleUpdate(index, v)}
                                            multiline
                                        />
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
                                    <Plus size={18} /> Add Achievement
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const AchievementsSettings = () => <div className="p-4 text-center text-gray-500">Edit on canvas</div>;

EditableAchievements.craft = {
    displayName: COMPONENT_NAMES.ACHIEVEMENTS,
    related: { settings: AchievementsSettings }
};
