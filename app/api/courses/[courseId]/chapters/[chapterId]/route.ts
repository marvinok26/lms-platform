import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Mux } from "@mux/mux-node";
import { NextResponse } from "next/server";

// Check for environment variables
if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    console.error("Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET environment variables");
}

// Create Mux instance
const muxClient = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
});

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = await auth();
        const { isPublished, ...values} = await req.json();
        
        // Await params to resolve the Next.js error
        const resolvedParams = await Promise.resolve(params);
        const courseId = resolvedParams.courseId;
        const chapterId = resolvedParams.chapterId;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            });
        
            if (existingMuxData) {
                try {
                    // Try to delete the asset, but don't fail if it doesn't exist
                    await muxClient.video.assets.delete(existingMuxData.assetId);
                } catch (error) {
                    // Just log the error and continue
                    console.log("Error deleting Mux asset:", error);
                    // Asset might not exist, so we can still proceed
                }
                
                // Delete the record from our database regardless
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }
        
            // Create a new Mux asset using the correct API structure
            try {
                const asset = await muxClient.video.assets.create({
                    input: values.videoUrl,
                    playback_policy: ["public"],
                    test: false
                });
        
                await db.muxData.create({
                    data: {
                        chapterId: chapterId,
                        assetId: asset.id,
                        playbackId: asset.playback_ids?.[0]?.id,
                    }
                });
            } catch (muxError) {
                console.error("Error creating Mux asset:", muxError);
                // Return a more specific error
                return new NextResponse("Error creating video asset", { status: 500 });
            }
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}