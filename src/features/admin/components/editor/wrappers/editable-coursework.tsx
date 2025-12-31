
import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { PortfolioData } from '@/types/portfolio';
import { COMPONENT_NAMES } from '@/lib/editor-utils';
import { Trash2, Plus, BookOpen, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { InlineEdit } from '../ui/inline-edit';

interface EditableCourseworkProps {
    coursework: PortfolioData['coursework'];
    sectionTitle?: string;
    hidden?: boolean;
}

export const EditableCoursework = (props: EditableCourseworkProps) => {
    const { connectors: { connect, drag }, actions: { setProp }, id } = useNode();
    const { enabled, actions: editorActions, query } = useEditor((state: any, query) => ({ enabled: state.options.enabled, query }));
    const coursework = props.coursework || [];
    const sectionTitle = props.sectionTitle;
    const isHidden = props.hidden;

    const toggleSectionVisibility = () => {
        setProp((props: any) => {
            props.hidden = !props.hidden;
        });
    };
    const handleTitleChange = (newTitle: string) => setProp((props: any) => props.sectionTitle = newTitle);
    const handleDeleteSection = () => { if (confirm('Delete this entire Coursework section? (Your data will be kept and can be re-added from the toolbox)')) editorActions.delete(id); };
    const handleMoveUp = () => { const parent = query.node(id).get().data.parent; if (!parent) return; const parentNode = query.node(parent).get(); const childNodes = parentNode.data.nodes || []; const currentIndex = childNodes.indexOf(id); if (currentIndex > 0) editorActions.move(id, parent, currentIndex - 1); };
    const handleMoveDown = () => { const parent = query.node(id).get().data.parent; if (!parent) return; const parentNode = query.node(parent).get(); const childNodes = parentNode.data.nodes || []; const currentIndex = childNodes.indexOf(id); if (currentIndex < childNodes.length - 1) editorActions.move(id, parent, currentIndex + 2); };  // +2 because node is temporarily removed

    const handleUpdate = (index: number, value: string) => {
        setProp((props: any) => {
            props.coursework[index] = value;
        });
    };

    const handleDelete = (index: number) => {
        setProp((props: any) => {
            props.coursework.splice(index, 1);
        });
    };

    const handleAdd = () => {
        setProp((props: any) => {
            if (!props.coursework) props.coursework = [];
            props.coursework.push("New Course");
        });
    };

    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative group border border-transparent ${enabled ? 'hover:border-dashed hover:border-blue-500/30' : ''} transition-all`}>
            {enabled && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 z-50 pointer-events-none rounded-br">
                    Coursework
                </div>
            )}
            {enabled && (<div className="absolute top-2 right-2 flex gap-2 z-50"><button onClick={handleMoveUp} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title="Move Section Up"><ChevronUp size={16} /></button><button onClick={handleMoveDown} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title="Move Section Down"><ChevronDown size={16} /></button><button onClick={toggleSectionVisibility} className="bg-blue-500/80 hover:bg-blue-500 text-white p-2 rounded transition-colors" title={isHidden ? "Show Section" : "Hide Section"}>
                {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button><button onClick={handleDeleteSection} className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded transition-colors" title="Delete Section"><Trash2 size={16} /></button></div>)}

            <section id="coursework" className="py-20 relative bg-black/30">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-gray-700 flex-1" />
                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-gray-200 flex items-center justify-center gap-4">
                            <InlineEdit value={sectionTitle || "Relevant Coursework"} onChange={handleTitleChange} placeholder="Section Title" className="text-center" />
                            {isHidden && <span className="text-sm bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">Hidden from Public</span>}
                        </h2>
                        <div className="h-px bg-gray-700 flex-1" />
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="p-8 md:p-12 text-center bg-white/5 border border-white/10 rounded-xl">
                            <div className="flex flex-wrap justify-center gap-4">
                                {coursework.map((course, index) => (
                                    <div
                                        key={index}
                                        className="group/course flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-neon-blue hover:border-neon-blue/50 hover:bg-neon-blue/5 transition-all duration-300 relative"
                                    >
                                        <BookOpen size={16} className="text-neon-blue/70" />
                                        <InlineEdit
                                            value={course}
                                            onChange={(v) => handleUpdate(index, v)}
                                            placeholder="Course name"
                                            className="font-medium"
                                        />
                                        {enabled && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                                                className="opacity-0 group-hover/course:opacity-100 text-red-400 hover:bg-red-500/10 p-1 rounded transition-all ml-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {enabled && (
                                    <button
                                        onClick={handleAdd}
                                        className="flex items-center gap-2 px-5 py-3 rounded-full border border-dashed border-neon-blue/50 text-neon-blue/70 hover:text-neon-blue hover:bg-neon-blue/5 transition-all"
                                    >
                                        <Plus size={16} />
                                        Add Course
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const CourseworkSettings = () => {
    return <div className="p-4 text-sm text-gray-500 text-center">Edit directly on canvas</div>;
};

EditableCoursework.craft = {
    displayName: COMPONENT_NAMES.COURSEWORK,
    related: {
        settings: CourseworkSettings
    }
};
