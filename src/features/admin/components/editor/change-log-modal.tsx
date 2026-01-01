
import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { generateChangeLog } from '@/features/admin/utils/helpers';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ChangeLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    initialData: PortfolioData;
    newData: PortfolioData;
    isSaving: boolean;
}

export const ChangeLogModal = ({ isOpen, onClose, onConfirm, initialData, newData, isSaving }: ChangeLogModalProps) => {
    if (!isOpen) return null;

    const changes = generateChangeLog(initialData, newData);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <AlertTriangle className="text-yellow-500" />
                        Review Changes
                    </h2>
                    <p className="text-gray-500 mt-1">Please confirm the changes before saving.</p>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {changes.length === 0 ? (
                        <p className="text-gray-500 italic">No changes detected.</p>
                    ) : (
                        <ul className="space-y-3">
                            {changes.map((change, index) => (
                                <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{change}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-6 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg">
                        <p className="font-bold mb-1">Note:</p>
                        This will update your live portfolio immediately.
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 font-bold hover:bg-gray-100 transition-colors"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 rounded-lg bg-black text-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                        disabled={isSaving || changes.length === 0}
                    >
                        {isSaving ? "Saving..." : "I Agree & Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};
