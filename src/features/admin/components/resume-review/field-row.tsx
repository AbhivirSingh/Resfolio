import { Check, Edit2, X } from "lucide-react";

interface FieldRowProps {
    label: string;
    value: string;
    visible: boolean;
    path: string[];
    multiline?: boolean;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    tempValue: string;
    setTempValue: (val: string) => void;
    toggle: (path: string[]) => void;
    update: (path: string[], value: any) => void;
}

export const FieldRow = ({
    label,
    value,
    visible,
    path,
    multiline,
    editingId,
    setEditingId,
    tempValue,
    setTempValue,
    toggle,
    update
}: FieldRowProps) => (
    <div className={`flex items-start gap-4 p-2 rounded hover:bg-gray-50 ${!visible ? 'opacity-50' : ''}`}>
        <input
            type="checkbox"
            checked={!!visible}
            onChange={() => toggle([...path, "visible"])}
            className="mt-1.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
            {editingId === path.join("-") ? (
                <div className="flex gap-2">
                    {multiline ? (
                        <textarea
                            value={tempValue || ""}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                            autoFocus
                        />
                    ) : (
                        <input
                            type="text"
                            value={tempValue || ""}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                    )}
                    <button
                        onClick={() => {
                            update([...path, "value"], tempValue);
                            setEditingId(null);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                        <Check size={16} />
                    </button>
                    <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="group flex items-start justify-between gap-2">
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">{value || ""}</div>
                    <button
                        onClick={() => {
                            setTempValue(value || "");
                            setEditingId(path.join("-"));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition-opacity"
                    >
                        <Edit2 size={14} />
                    </button>
                </div>
            )}
        </div>
    </div>
);
