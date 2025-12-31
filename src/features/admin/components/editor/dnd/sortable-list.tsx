
import React, { useMemo, useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    SortingStrategy,
    horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";

// --- SortableItem ---

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    handle?: boolean;
}

export function SortableItem({ id, children, className, handle = false }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : "auto",
        position: "relative" as const,
        touchAction: "none" // Prevents scrolling on mobile while dragging
    };

    if (handle) {
        return (
            <div ref={setNodeRef} style={style} className={className}>
                {/* Pass attributes and listeners to a specific handle element if you want specific drag handle */}
                {/* leveraging React.cloneElement or similar to inject handle props is complex. 
                 For simplicity, we assume the child will handle the drag handle or the whole item is draggable if handle prop is false
              */}
                {/* Actually, if handle is true, we expect the child to render a handle and we pass attributes/listeners to it? 
                  No, standard simpler way: */ }
                <div {...attributes} {...listeners} className="cursor-move h-full w-full">
                    {children}
                </div>
            </div>
        )
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={className}>
            {children}
        </div>
    );
}


// --- SortableList ---

interface BaseItem {
    id: string;
    [key: string]: any;
}

interface SortableListProps<T extends BaseItem> {
    items: T[];
    onChange: (items: T[]) => void;
    renderItem: (item: T, index: number, isOverlay?: boolean) => React.ReactNode;
    strategy?: SortingStrategy;
    className?: string;
    disabled?: boolean;
}

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
};

export function SortableList<T extends BaseItem>({
    items,
    onChange,
    renderItem,
    strategy = verticalListSortingStrategy,
    className,
    disabled = false
}: SortableListProps<T>) {
    const [activeId, setActiveId] = useState<string | null>(null);


    // Disabling sensors if disabled prop is true
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            },
            disabled: disabled
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
            disabled: disabled
        })
    );

    const activeItem = useMemo(() => items.find((item) => item.id === activeId), [activeId, items]);
    const itemIds = useMemo(() => items.map((item) => item.id), [items]);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);
            onChange(arrayMove(items, oldIndex, newIndex));
        }

        setActiveId(null);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={itemIds} strategy={strategy}>
                <div className={className}>
                    {items.map((item, index) => (
                        <SortableItem key={item.id} id={item.id}>
                            {renderItem(item, index)}
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
            {createPortal(
                <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeItem ? renderItem(activeItem, -1, true) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
