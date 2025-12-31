import mongoose, { Schema, Document, Model } from "mongoose";
import { PortfolioData } from "@/types/portfolio";

// Define interface for the Mongoose document, extending PortfolioData
// We omit 'id' from sub-documents in the interface if we want Mongoose to handle _id,
// but for now we'll keep the structure consistent with PortfolioData.
export interface IPortfolio extends PortfolioData, Document { }

const PortfolioSchema: Schema = new Schema({
    personalInfo: {
        name: { type: String, required: true },
        title: { type: String, required: true },
        bio: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        image: { type: String },
        resume: { type: String },
    },
    socialProfiles: {
        github: String,
        linkedin: String,
        leetcode: String,
        hackerrank: String,
        geeksforgeeks: String,
        codeforces: String,
        codechef: String,
        kaggle: String,
    },
    skills: [{
        category: { type: String, required: true },
        items: [{ type: String }],
        hidden: Boolean,
    }],
    experience: [{
        id: String,
        company: String,
        role: String,
        date: String,
        description: String,
        location: String,
        status: String,
        mergeGroupId: String,
        hidden: Boolean,
    }],
    projects: [{
        id: String,
        title: String,
        techStack: [String],
        githubUrl: String,
        liveUrl: String,
        bullets: [String],
        status: String,
        mergeGroupId: String,
        hidden: Boolean,
    }],
    education: [{
        id: String,
        degree: String,
        institute: String,
        year: String,
        score: String,
        status: String,
        mergeGroupId: String,
        hidden: Boolean,
    }],
    certifications: [{
        id: String,
        name: String,
        issuer: String,
        link: String,
        status: String,
        mergeGroupId: String,
        hidden: Boolean,
    }],
    publications: [{
        id: String,
        title: String,
        summary: String,
        link: String,
        status: String,
        mergeGroupId: String,
        hidden: Boolean,
    }],
    extracurricular: [{
        id: String,
        role: String,
        organization: String,
        status: String,
        mergeGroupId: String,
        hidden: Boolean,
    }],
    achievements: [String],
    coursework: [String],
    customSections: [{
        id: String,
        title: String,
        items: [String],
        hidden: Boolean,
    }],
    sectionTitles: {
        skills: String,
        experience: String,
        projects: String,
        education: String,
        certifications: String,
        publications: String,
        extracurricular: String,
        achievements: String,
        coursework: String,
        customSections: String,
    },
    sectionVisibility: { type: Map, of: Boolean },
    sectionOrder: [String],
    theme: { type: String, default: "modern" },
}, { timestamps: true });

// Prevent model recompilation error in development
// Prevent model recompilation error in development
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.Portfolio;
}
const Portfolio: Model<IPortfolio> = mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;
