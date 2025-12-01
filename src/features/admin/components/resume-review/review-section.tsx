import React from "react";
import { AlertTriangle, Check } from "lucide-react";

interface ReviewSectionProps {
    title: string;
    items: any[];
    sectionKey: string;
    visible: boolean;
    toggle: (path: string[]) => void;
    selectedForMerge: string[];
    setSelectedForMerge: React.Dispatch<React.SetStateAction<string[]>>;
    mergeSection: string | null;
    setMergeSection: React.Dispatch<React.SetStateAction<string | null>>;
    handleManualMerge: (section: string) => void;
    renderFields: (item: any, idx: number) => React.ReactNode;
}

export const ReviewSection = ({
    title,
    items,
    sectionKey,
    visible,
    toggle,
    selectedForMerge,
    setSelectedForMerge,
    mergeSection,
    setMergeSection,
    handleManualMerge,
    renderFields
}: ReviewSectionProps) => {
    // Group items by mergeGroupId
    const groups: { [key: string]: any[] } = {};
    const standaloneItems: any[] = [];

    items.forEach((item, idx) => {
        if (item.mergeGroupId) {
            if (!groups[item.mergeGroupId]) {
                groups[item.mergeGroupId] = [];
            }
            groups[item.mergeGroupId].push({ ...item, originalIdx: idx });
        } else {
            standaloneItems.push({ ...item, originalIdx: idx });
        }
    });

    return (
        <section className="border rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={!!visible}
                        onChange={() => toggle([sectionKey, "visible"])}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                    />
                    <h2 className="font-bold text-gray-900">{title}</h2>
                </div>
            </div>
            {visible && (
                <div className="divide-y">
                    {/* Render Conflict Groups first */}
                    {Object.entries(groups).map(([groupId, groupItems]) => (
                        <div key={`group-${groupId}`} className="p-4 bg-yellow-50/30 border-b-4 border-yellow-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-yellow-800 font-bold">
                                    <AlertTriangle size={18} />
                                    <span>Conflict Resolution Required</span>
                                </div>
                                {selectedForMerge.length === 2 && mergeSection === sectionKey && groupItems.every(i => selectedForMerge.includes(i.id)) && (
                                    <button
                                        onClick={() => handleManualMerge(sectionKey)}
                                        className="px-4 py-1.5 bg-purple-600 text-white text-sm font-bold rounded shadow hover:bg-purple-700 transition-colors flex items-center gap-2"
                                    >
                                        <Check size={16} />
                                        Merge These Items
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {groupItems.map((item, idx) => (
                                    <div key={`group-item-${item.id}`} className={`border rounded-xl overflow-hidden bg-white shadow-sm ${selectedForMerge.includes(item.id) ? 'ring-2 ring-purple-500' : ''}`}>
                                        <div className={`p-3 border-b flex items-center justify-between ${item.status === 'NEW' ? 'bg-green-50' : 'bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedForMerge.includes(item.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            if (selectedForMerge.length < 2) {
                                                                setSelectedForMerge(prev => [...prev, item.id]);
                                                                setMergeSection(sectionKey);
                                                            }
                                                        } else {
                                                            setSelectedForMerge(prev => prev.filter(id => id !== item.id));
                                                            if (selectedForMerge.length === 1) setMergeSection(null);
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                />
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${item.status === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                                    {item.status === 'NEW' ? 'Incoming / New' : 'Current / Old'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 grid gap-3">
                                            {renderFields(item, item.originalIdx)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Render Standalone Items */}
                    {standaloneItems.map((item) => (
                        <div key={`item-${item.id}`} className={`p-4 ${!item.visible ? 'bg-gray-50' : ''}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    checked={!!item.visible}
                                    onChange={() => toggle([sectionKey, "items", item.originalIdx.toString(), "visible"])}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <span className="font-semibold text-gray-700">Item {item.originalIdx + 1}</span>
                                {item.status === "NEW" && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">NEW</span>
                                )}
                            </div>

                            {item.visible && (
                                <div className="pl-7 grid gap-2">
                                    {renderFields(item, item.originalIdx)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
