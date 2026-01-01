import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db";
import Portfolio from "@/models/Portfolio";

export async function PATCH(req: NextRequest) {
    try {
        const { field, url } = await req.json();

        // Allow updates to personalInfo.image and personalInfo.resume
        const allowedFields = ["personalInfo.image", "personalInfo.resume"];

        if (!allowedFields.includes(field)) {
            return NextResponse.json({ error: "Invalid field" }, { status: 400 });
        }

        await dbConnect();

        // Use $set to update the specific field without overwriting the whole object
        await Portfolio.findOneAndUpdate({}, { $set: { [field]: url } }, { upsert: true, new: true });

        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error("Error updating portfolio asset:", error);
        return NextResponse.json({ error: "Failed update" }, { status: 500 });
    }
}
