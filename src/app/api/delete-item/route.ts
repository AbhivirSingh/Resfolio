import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Portfolio from "@/models/Portfolio";

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { section, itemId } = await req.json();

        if (!section) {
            return NextResponse.json(
                { error: "Section name is required" },
                { status: 400 }
            );
        }

        console.log(`Deleting from section: ${section}, itemId: ${itemId}`);

        let updateOperation = {};

        if (itemId) {
            // Delete specific item from array
            // Assuming section matches the field name in schema (e.g., 'experience', 'projects')
            updateOperation = {
                $pull: { [section]: { id: itemId } }
            };
        } else {
            // Delete entire section content
            // We'll set the section array to empty, BUT we also need to remove it from sectionOrder
            updateOperation = {
                $set: { [section]: [] },
                $pull: { sectionOrder: section }
            };
        }

        const result = await Portfolio.findOneAndUpdate(
            {}, // Filter (find any/first portfolio)
            updateOperation,
            { new: true }
        );

        if (!result) {
            return NextResponse.json(
                { error: "Portfolio not found" },
                { status: 404 }
            );
        }

        revalidatePath("/");

        return NextResponse.json({
            success: true,
            message: itemId ? "Item deleted successfully" : "Section deleted successfully",
            data: result
        });

    } catch (error) {
        console.error("Error deleting item:", error);
        return NextResponse.json(
            { error: "Failed to delete item" },
            { status: 500 }
        );
    }
}
