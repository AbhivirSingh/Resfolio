
"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "@craftjs/core";
import { PortfolioData } from "@/types/portfolio";
import { EditorLayout } from "@/features/admin/components/editor/editor-layout";
import { ChangeLogModal } from "@/features/admin/components/editor/change-log-modal";
import { Container, ContainerSettings } from "@/features/admin/components/editor/wrappers/container";
import { EditableHero } from "@/features/admin/components/editor/wrappers/editable-hero";
import { EditableExperience } from "@/features/admin/components/editor/wrappers/editable-experience";
import { EditableProjects } from "@/features/admin/components/editor/wrappers/editable-projects";
import { EditableSkills } from "@/features/admin/components/editor/wrappers/editable-skills";
import { EditableEducation } from "@/features/admin/components/editor/wrappers/editable-education";
import { EditableCertifications } from "@/features/admin/components/editor/wrappers/editable-certifications";
import { EditablePublications } from "@/features/admin/components/editor/wrappers/editable-publications";
import { EditableExtracurricular } from "@/features/admin/components/editor/wrappers/editable-extracurricular";
import { EditableAchievements } from "@/features/admin/components/editor/wrappers/editable-achievements";
import { EditableCoursework } from "@/features/admin/components/editor/wrappers/editable-coursework";
import { EditableCustomSections } from "@/features/admin/components/editor/wrappers/editable-custom-sections";
import { useRouter } from "next/navigation";

export default function VisualEditorPage() {
    const [initialData, setInitialData] = useState<PortfolioData | null>(null);
    const [newData, setNewData] = useState<PortfolioData | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch current portfolio data
        const fetchData = async () => {
            try {
                const res = await fetch("/api/update-portfolio");
                if (res.ok) {
                    const data = await res.json();
                    setInitialData(data);
                }
            } catch (error) {
                console.error("Failed to load portfolio:", error);
            }
        };
        fetchData();
    }, []);

    const handleReview = (data: PortfolioData) => {
        setNewData(data);
        setIsReviewOpen(true);
    };

    const handleSaveConfirm = async () => {
        if (!newData) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/update-portfolio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });

            if (!res.ok) throw new Error("Update failed");

            // Success
            setIsReviewOpen(false);
            router.refresh();
            // Optional: navigate back or show success toast
            alert("Saved successfully!");
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!initialData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Loading Editor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full">
            <Editor
                resolver={{
                    Container,
                    ContainerSettings,
                    EditableHero,
                    EditableExperience,
                    EditableProjects,
                    EditableSkills,
                    EditableEducation,
                    EditableCertifications,
                    EditablePublications,
                    EditableExtracurricular,
                    EditableAchievements,
                    EditableCoursework,
                    EditableCustomSections
                }}
            >
                <EditorLayout initialData={initialData} onReview={handleReview} />
            </Editor>

            {newData && (
                <ChangeLogModal
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    onConfirm={handleSaveConfirm}
                    initialData={initialData}
                    newData={newData}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}
