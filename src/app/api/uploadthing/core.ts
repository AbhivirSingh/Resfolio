import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Profile Image upload (avatar)
    profileImage: f({ image: { maxFileSize: "4MB" } })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for profileImage:", file.url);
            return { uploadedBy: "user" };
        }),

    // Resume PDF upload
    resumePdf: f({ pdf: { maxFileSize: "8MB" } })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for resumePdf:", file.url);
            return { uploadedBy: "user" };
        }),

    // Gallery Images upload (multiple allowed)
    galleryImage: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete for galleryImage:", file.url);
            return { uploadedBy: "user" };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
