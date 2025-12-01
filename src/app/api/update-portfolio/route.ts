import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { savePortfolioData } from "@/lib/data";
import { PortfolioData } from "@/types/portfolio";

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        console.log("=== Update portfolio API called ===");

        const portfolioData: PortfolioData = await req.json();

        // Validate the data structure
        if (!portfolioData.personalInfo || !portfolioData.skills || !portfolioData.experience || !portfolioData.projects) {
            return NextResponse.json({
                error: "Invalid portfolio data structure"
            }, { status: 400 });
        }

        // Save the portfolio data
        await savePortfolioData(portfolioData);
        console.log("Portfolio data saved successfully");

        // Revalidate the home page cache
        revalidatePath("/");
        console.log("Path revalidated");

        return NextResponse.json({
            success: true,
            message: "Portfolio updated successfully"
        });
    } catch (error) {
        console.error("=== Error updating portfolio ===");
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update portfolio" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { getPortfolioData } = await import("@/lib/data");
        const data = await getPortfolioData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        return NextResponse.json(
            { error: "Failed to fetch portfolio data" },
            { status: 500 }
        );
    }
}
