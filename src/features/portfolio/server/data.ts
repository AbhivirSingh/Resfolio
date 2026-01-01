import "server-only";
import dbConnect from "@/core/db";
import Portfolio from "@/models/Portfolio";
import { PortfolioData } from "@/types/portfolio";

const defaultPortfolioData: PortfolioData = {
    personalInfo: {
        name: "Your Name",
        title: "Your Title",
        bio: "Your Bio",
        email: "email@example.com",
        phone: "",
        location: "",
    },
    socialProfiles: {},
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    publications: [],
    extracurricular: [],
    achievements: [],
    coursework: [],
    customSections: [],
    sectionTitles: {},
    sectionOrder: [
        "hero",
        "experience",
        "skills",
        "projects",
        "publications",
        "achievements",
        "certifications",
        "education",
        "coursework",
        "extracurricular",
        "customSections"
    ],
    theme: "modern"
};

export async function getPortfolioData(): Promise<PortfolioData> {
    try {
        await dbConnect();

        // Find the most recent portfolio document
        // We use lean() to get a plain JavaScript object
        const data = await Portfolio.findOne().sort({ createdAt: -1 }).lean();

        if (data) {
            // Serialize the data to ensure it's plain JSON
            // This handles _id (ObjectId) and other non-serializable fields
            return JSON.parse(JSON.stringify(data)) as PortfolioData;
        }

        console.warn("No portfolio data found in MongoDB, returning default data");
        return defaultPortfolioData;
    } catch (error) {
        console.error("Error fetching portfolio data from MongoDB:", error);
        // Return default structure to prevent crash
        return defaultPortfolioData;
    }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
    await dbConnect();

    try {
        // Upsert: Update the existing document or create a new one if it doesn't exist
        // We assume a single portfolio document for this app.
        // Using findOneAndUpdate with upsert: true
        await Portfolio.findOneAndUpdate({}, data, { upsert: true, new: true });
        console.log("Portfolio data saved to MongoDB");
    } catch (error) {
        console.error("Error saving portfolio data to MongoDB:", error);
        throw error;
    }
}
