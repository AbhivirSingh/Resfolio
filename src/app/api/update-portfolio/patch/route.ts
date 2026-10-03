import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db";
import Portfolio from "@/models/Portfolio";

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { field, url, action, item, items } = body;

        const allowedFields = ["personalInfo.image", "personalInfo.resume", "gallery"];

        if (!allowedFields.includes(field)) {
            return NextResponse.json({ error: "Invalid field" }, { status: 400 });
        }

        await dbConnect();

        if (field === "gallery") {
            if (action === "add" && (url || item)) {
                const newGalleryItem = item || {
                    id: Date.now(),
                    img: url,
                    title: "Gallery Photo",
                };
                await Portfolio.findOneAndUpdate(
                    {},
                    { $push: { gallery: newGalleryItem } },
                    { upsert: true, new: true }
                );
                return NextResponse.json({ success: true, item: newGalleryItem });
            } else if (action === "delete" && body.id) {
                await Portfolio.findOneAndUpdate(
                    {},
                    { $pull: { gallery: { id: body.id } } },
                    { new: true }
                );
                return NextResponse.json({ success: true, deletedId: body.id });
            } else if (items) {
                await Portfolio.findOneAndUpdate(
                    {},
                    { $set: { gallery: items } },
                    { upsert: true, new: true }
                );
                return NextResponse.json({ success: true, items });
            }
        }

        // Use $set for single fields like personalInfo.image or personalInfo.resume
        await Portfolio.findOneAndUpdate({}, { $set: { [field]: url } }, { upsert: true, new: true });

        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error("Error updating portfolio asset:", error);
        return NextResponse.json({ error: "Failed update" }, { status: 500 });
    }
}
