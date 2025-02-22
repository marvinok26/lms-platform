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
        console.log("Upload middleware running");
        return {};
    })
    .onUploadComplete((data) => {
        console.log("Upload completed:", data);
        return { url: data.file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;