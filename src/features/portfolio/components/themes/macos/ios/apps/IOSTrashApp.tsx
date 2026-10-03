"use client";

import React from "react";
import { IOSAppSheet } from "../components/IOSAppSheet";
import { Trash2 } from "lucide-react";

export const IOSTrashApp: React.FC = () => {
    return (
        <IOSAppSheet title="Recently Deleted / Bin" icon="/images/trash.png">
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400">
                    <Trash2 size={32} />
                </div>
                <h3 className="font-semibold text-base text-gray-900 dark:text-white">Bin is Clean</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                    No deleted files or stale legacy code in this portfolio. Everything is fresh and optimized!
                </p>
            </div>
        </IOSAppSheet>
    );
};

export default IOSTrashApp;
