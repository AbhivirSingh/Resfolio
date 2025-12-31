
import React from 'react';
import { useEditor } from '@craftjs/core';
import { PortfolioData } from '@/types/portfolio';
import { reconstructPortfolioData } from '@/lib/editor-utils';
import { ArrowLeft, Save, Eye, Edit2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopbarProps {
    initialData: PortfolioData;
    onReview: (data: PortfolioData) => void;
}

export const Topbar = ({ initialData, onReview }: TopbarProps) => {
    const { query, actions } = useEditor();
    const router = useRouter();

    const handleSave = () => {
        const serialized = query.serialize();
        const nodes = JSON.parse(serialized);

        // Reconstruct data from nodes
        const newData = reconstructPortfolioData(nodes, initialData);

        onReview(newData);
    };

    return (
        <div className="h-16 border-b bg-white flex items-center justify-between px-6 z-20 relative shadow-sm">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="font-bold text-lg">Visual Editor</h1>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded font-medium border border-blue-100">Draft</span>
            </div>

            <div className="flex items-center gap-3">


                <div className="h-6 w-px bg-gray-300 mx-1" />

                <a
                    href={`/portfolio/${initialData.personalInfo.name.toLowerCase().replace(/\s+/g, '-')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                    <ExternalLink size={16} />
                    View Live
                </a>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <Save size={16} />
                    Publish
                </button>
            </div>
        </div>
    );
};
