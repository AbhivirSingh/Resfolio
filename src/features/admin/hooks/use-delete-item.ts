import { useState } from 'react';
import { useEditor } from '@craftjs/core';

export const useDeleteItem = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { actions } = useEditor();

    const deleteItem = async (section: string, itemId?: string, nodeId?: string) => {
        if (!confirm(itemId ? "Are you sure you want to permanently delete this item?" : "Are you sure you want to permanently delete this section?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch('/api/delete-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ section, itemId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            // If we have a nodeId (Craft.js node ID), remove it from the editor
            if (nodeId) {
                actions.delete(nodeId);
            }

            return true;
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteItem, isDeleting };
};
