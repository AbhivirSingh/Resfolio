import { PortfolioData } from "@/types/portfolio";

export function mergePortfolioData(existing: PortfolioData, incoming: PortfolioData): PortfolioData {
    const merged: PortfolioData = {
        ...existing,
        // Explicitly preserve theme from existing data
        theme: existing.theme || "modern"
    };

    // Helper to merge arrays of objects with unique keys
    const mergeObjectArray = <T extends { status?: "NEW" | "OLD"; mergeGroupId?: string }>(
        existingItems: T[] | undefined,
        incomingItems: T[] | undefined,
        keyFn: (item: T) => string
    ): T[] => {
        const existingList = existingItems || [];
        const incomingList = incomingItems || [];
        const result: T[] = [];
        const existingMap = new Map<string, T>();

        // Index existing items
        existingList.forEach(item => {
            const key = keyFn(item);
            existingMap.set(key, item);
            // Default existing items to no status if not present, or keep existing
            result.push(item);
        });

        incomingList.forEach(newItem => {
            const key = keyFn(newItem);
            const existingItem = existingMap.get(key);

            if (existingItem) {
                // Conflict: Item exists.
                // Check if content is different.

                // We compare stringified versions to detect changes
                // Remove status and mergeGroupId fields before comparison
                const { status: _s1, mergeGroupId: _m1, ...existingProps } = existingItem as any;
                const { status: _s2, mergeGroupId: _m2, ...newProps } = newItem as any;

                if (JSON.stringify(existingProps) !== JSON.stringify(newProps)) {
                    // Content changed. 
                    // Generate a unique mergeGroupId
                    const mergeGroupId = Math.random().toString(36).substring(2, 15);

                    // Assign mergeGroupId to EXISTING item (which is already in result)
                    // We need to find it in result and update it
                    const existingInResult = result.find(i => keyFn(i) === key);
                    if (existingInResult) {
                        existingInResult.mergeGroupId = mergeGroupId;
                    }

                    // Add NEW item with status NEW and same mergeGroupId
                    result.push({ ...newItem, status: "NEW", mergeGroupId });
                } else {
                    // Content same. Do nothing (existing already added).
                }
            } else {
                // New item. Add with status NEW.
                result.push({ ...newItem, status: "NEW" });
            }
        });

        return result;
    };

    // Helper to merge string arrays (union)
    const mergeStringArray = (existingItems: string[] | undefined, incomingItems: string[] | undefined): string[] => {
        const set = new Set(existingItems || []);
        (incomingItems || []).forEach(item => set.add(item));
        return Array.from(set);
    };

    // Merge Personal Info
    merged.personalInfo = { ...existing.personalInfo, ...incoming.personalInfo };

    // Merge Skills (String arrays)
    const mergedSkills = [...(existing.skills || [])];
    (incoming.skills || []).forEach(newCat => {
        const existingCatIndex = mergedSkills.findIndex(c => c.category === newCat.category);
        if (existingCatIndex >= 0) {
            // Merge items within category
            mergedSkills[existingCatIndex].items = mergeStringArray(mergedSkills[existingCatIndex].items, newCat.items);
        } else {
            // New category
            mergedSkills.push(newCat);
        }
    });
    merged.skills = mergedSkills;

    // Merge Experience
    // For experience, we can be smarter. Match by Company AND Role.
    merged.experience = mergeObjectArray(
        existing.experience,
        incoming.experience,
        (item) => `${item.company.trim().toLowerCase()}-${item.role.trim().toLowerCase()}`
    );

    // Merge Projects
    // Match by Title
    merged.projects = mergeObjectArray(
        existing.projects,
        incoming.projects,
        (item) => item.title.trim().toLowerCase()
    );

    // Merge Education
    merged.education = mergeObjectArray(
        existing.education,
        incoming.education,
        (item) => `${item.institute.trim().toLowerCase()}-${item.degree.trim().toLowerCase()}`
    );

    // Merge Certifications
    merged.certifications = mergeObjectArray(
        existing.certifications,
        incoming.certifications,
        (item) => item.name.trim().toLowerCase()
    );

    // Merge Publications
    merged.publications = mergeObjectArray(
        existing.publications,
        incoming.publications,
        (item) => item.title.trim().toLowerCase()
    );

    // Merge Extracurricular
    merged.extracurricular = mergeObjectArray(
        existing.extracurricular,
        incoming.extracurricular,
        (item) => `${item.organization.trim().toLowerCase()}-${item.role.trim().toLowerCase()}`
    );

    // Merge Achievements (String array)
    merged.achievements = mergeStringArray(existing.achievements, incoming.achievements);

    // Merge Coursework (String array)
    merged.coursework = mergeStringArray(existing.coursework, incoming.coursework);

    // Merge Custom Sections
    const mergedCustom = [...(existing.customSections || [])];
    (incoming.customSections || []).forEach(newSec => {
        const existingSecIndex = mergedCustom.findIndex(s => s.title === newSec.title);
        if (existingSecIndex >= 0) {
            mergedCustom[existingSecIndex].items = mergeStringArray(mergedCustom[existingSecIndex].items, newSec.items);
        } else {
            mergedCustom.push(newSec);
        }
    });
    merged.customSections = mergedCustom;

    return merged;
}
