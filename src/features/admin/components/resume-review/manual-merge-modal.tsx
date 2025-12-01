import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ManualMergeModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionName: string | null;
    items: any[];
    selectedIds: string[];
    onConfirm: (mergedItem: any) => void;
}

export const ManualMergeModal = ({ isOpen, onClose, sectionName, items, selectedIds, onConfirm }: ManualMergeModalProps) => {
    const [mergedItem, setMergedItem] = useState<any>(null);
    const [item1, setItem1] = useState<any>(null);
    const [item2, setItem2] = useState<any>(null);

    useEffect(() => {
        if (isOpen && items && selectedIds.length === 2) {
            const i1 = items.find((i: any) => i.id === selectedIds[0]);
            const i2 = items.find((i: any) => i.id === selectedIds[1]);
            setItem1(i1);
            setItem2(i2);

            if (i1 && i2) {
                const initialMerge: any = {};
                Object.keys(i2).forEach(key => {
                    if (key !== 'id' && key !== '_id' && key !== 'visible' && key !== 'status' && key !== 'mergeGroupId' && key !== 'originalIdx') {
                        // Extract raw value from ReviewField or Array of ReviewFields
                        const val = i2[key];
                        if (Array.isArray(val)) {
                            initialMerge[key] = val.map((v: any) => v.value);
                        } else if (val && typeof val === 'object' && 'value' in val) {
                            initialMerge[key] = val.value;
                        } else {
                            initialMerge[key] = val;
                        }
                    }
                });
                setMergedItem(initialMerge);
            }
        }
    }, [isOpen, items, selectedIds]);

    if (!isOpen || !item1 || !item2 || !mergedItem) return null;

    const fields = Object.keys(mergedItem);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-gray-900">Merge Conflict Resolution</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-4 mb-4 font-bold text-sm text-gray-500 uppercase tracking-wide">
                        <div>Field</div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">OLD</span>
                            Version 1
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">NEW</span>
                            Version 2
                        </div>
                    </div>

                    <div className="space-y-6">
                        {fields.map(field => (
                            <div key={field} className="grid grid-cols-3 gap-4 items-start border-b pb-4 last:border-0">
                                <div className="font-medium text-gray-700 capitalize pt-2">{field}</div>

                                {/* Item 1 Value */}
                                <div
                                    className={`p-3 rounded border cursor-pointer transition-all ${JSON.stringify(mergedItem[field]) === JSON.stringify(Array.isArray(item1[field]) ? item1[field].map((v: any) => v.value) : item1[field]?.value) ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                                    onClick={() => setMergedItem({ ...mergedItem, [field]: Array.isArray(item1[field]) ? item1[field].map((v: any) => v.value) : item1[field]?.value })}
                                >
                                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {Array.isArray(item1[field])
                                            ? item1[field].map((v: any) => v.value).join(', ')
                                            : String(item1[field]?.value || '')}
                                    </div>
                                </div>

                                {/* Item 2 Value */}
                                <div
                                    className={`p-3 rounded border cursor-pointer transition-all ${JSON.stringify(mergedItem[field]) === JSON.stringify(Array.isArray(item2[field]) ? item2[field].map((v: any) => v.value) : item2[field]?.value) ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-green-300'}`}
                                    onClick={() => setMergedItem({ ...mergedItem, [field]: Array.isArray(item2[field]) ? item2[field].map((v: any) => v.value) : item2[field]?.value })}
                                >
                                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {Array.isArray(item2[field])
                                            ? item2[field].map((v: any) => v.value).join(', ')
                                            : String(item2[field]?.value || '')}
                                    </div>
                                </div>

                                {/* Editable Result */}
                                <div className="col-span-3 mt-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Merged Result (Editable)</label>
                                    {Array.isArray(mergedItem[field]) ? (
                                        <textarea
                                            value={mergedItem[field].join('\n')}
                                            onChange={(e) => setMergedItem({ ...mergedItem, [field]: e.target.value.split('\n') })}
                                            className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                                            rows={4}
                                            placeholder="Enter items separated by new lines"
                                        />
                                    ) : (
                                        <textarea
                                            value={(mergedItem[field] as string) || ""}
                                            onChange={(e) => setMergedItem({ ...mergedItem, [field]: e.target.value })}
                                            className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                            rows={2}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(mergedItem)}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                    >
                        Confirm Merge
                    </button>
                </div>
            </div>
        </div>
    );
};
