
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useEditor } from '@craftjs/core';

interface InlineEditProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    autoFocus?: boolean;
}

export const InlineEdit = ({
    value,
    onChange,
    className,
    placeholder = "Click to edit",
    multiline = false,
    autoFocus = false,
}: InlineEditProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (editValue !== value) {
            onChange(editValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setEditValue(value);
            setIsEditing(false);
        }
    };


    const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

    if (!enabled) {
        return <span className={className}>{value || placeholder}</span>;
    }

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "w-full bg-transparent border-b-2 border-primary outline-none resize-none overflow-hidden min-h-[1.5em]",
                        className
                    )}
                    rows={1}
                    style={{ height: 'auto', minHeight: '1.5em' }}
                // Auto-resize logic can be added here if needed
                />
            );
        }
        return (
            <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-full bg-transparent border-b-2 border-primary outline-none min-w-[50px]",
                    className
                )}
            />
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            className={cn(
                "cursor-text hover:bg-white/10 rounded px-1 -mx-1 border border-transparent hover:border-white/20 transition-colors min-h-[1.5em]",
                !value && "text-gray-500 italic",
                className
            )}
        >
            {value || placeholder}
        </span>
    );
};
