
import React from 'react';
import { useEditor } from '@craftjs/core';

export const SettingsPanel = () => {
    const { selected, actions } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        let selected;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.displayName,
                settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
                isDeletable: query.node(currentNodeId).isDeletable()
            };
        }

        return {
            selected
        };
    });

    return (
        <div className="w-80 bg-white border-l h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-lg">Settings</h2>
                {selected && selected.isDeletable ? (
                    <button
                        onClick={() => {
                            actions.delete(selected.id);
                        }}
                        className="text-red-500 text-xs px-2 py-1 bg-red-50 rounded hover:bg-red-100 font-bold"
                    >
                        Delete
                    </button>
                ) : null}
            </div>

            <div className="flex-1 overflow-y-auto">
                {selected ? (
                    <div className="p-0">
                        <div className="bg-gray-100 px-4 py-2 border-b">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{selected.name}</span>
                        </div>
                        {selected.settings && React.createElement(selected.settings)}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-400">
                        <p>Click on a component to edit its settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
