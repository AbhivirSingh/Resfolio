import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPortfolioData, savePortfolioData } from "@/features/portfolio/server/data";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { theme } = await req.json();

        if (!theme || !["minimalist", "creative", "professional", "modern"].includes(theme)) {
            return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
        }

        const currentData = await getPortfolioData();
        const updatedData = { ...currentData, theme };

        await savePortfolioData(updatedData);

        revalidatePath("/");

        return NextResponse.json({ success: true, theme });
    } catch (error) {
        console.error("Error updating theme:", error);
        return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
    }
}
