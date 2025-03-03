// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

console.log("Initializing UploadThing router");

export const ourFileRouter = {
    courseImage: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
    .middleware(() => {
        console.log("Upload middleware running for course image");
        return {};
    })
    .onUploadComplete((data) => {
        console.log("Course image upload completed:", data);
        return { url: data.file.url };
    }),
    
    // Add new endpoint for course attachments
    courseAttachment: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
        pdf: { maxFileSize: "16MB", maxFileCount: 1 },
        text: { maxFileSize: "4MB", maxFileCount: 1 },
        audio: { maxFileSize: "8MB", maxFileCount: 1 },
        video: { maxFileSize: "16MB", maxFileCount: 1 },
    })
    .middleware(() => {
        console.log("Upload middleware running for course attachment");
        return {};
    })
    .onUploadComplete((data) => {
        console.log("Course attachment upload completed:", data);
        return { url: data.file.url };
    }),
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;