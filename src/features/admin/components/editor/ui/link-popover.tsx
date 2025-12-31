
import React, { useState, useEffect, useRef } from 'react';
import { Link2, Check, X, ExternalLink } from 'lucide-react';
import { useEditor } from '@craftjs/core';

interface LinkPopoverProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    children: React.ReactNode;
    className?: string;
}

export const LinkPopover = ({ value = "", onChange, placeholder = "https://...", children, className }: LinkPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setTempValue(value); // Reset on cancel/outside click
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, value]);

    const handleSave = () => {
        onChange(tempValue);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setTempValue(value);
        }
    };

    const { enabled } = useEditor((state: any) => ({ enabled: state.options.enabled }));

    if (!enabled) {
        return (
            <div className={className}>
                {children}
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`}>
            <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="cursor-pointer">
                {children}
            </div>

            {isOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center gap-2">
                        <Link2 size={14} className="text-black shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-500 min-w-0"
                        />
                        <button
                            onClick={handleSave}
                            className="p-1 hover:bg-green-50 text-green-600 rounded transition-colors"
                        >
                            <Check size={14} />
                        </button>
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white" />
                </div>
            )}
        </div>
    );
};
