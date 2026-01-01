import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getDynamicGridClass(totalItems: number, maxColumns: number = 3): string {
    if (totalItems === 0) return "";

    // If there is only 1 item, force a single column layout across all breakpoints
    // We use md:!grid-cols-1 to override any default md:grid-cols-2/3 classes
    if (totalItems === 1) {
        return "md:!grid-cols-1 lg:!grid-cols-1";
    }

    // If items are fewer than max columns, use the item count
    if (totalItems < maxColumns) {
        return `lg:grid-cols-${totalItems}`;
    }

    // Otherwise use max columns
    return `lg:grid-cols-${maxColumns}`;
}
