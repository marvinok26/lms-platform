import { Mux } from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Check for environment variables
if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    console.error("Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET environment variables");
}

// Create Mux instance properly
const muxClient = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
});

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        
        // Await params to resolve the Next.js error
        const resolvedParams = await Promise.resolve(params);
        const courseId = resolvedParams.courseId;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if(!course) {
            return new NextResponse("Unauthorized", { status: 404 });
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                try {
                    // Use the correct method from muxClient
                    await muxClient.video.assets.delete(chapter.muxData.assetId);
                } catch (error) {
                    console.log(`Error deleting Mux asset for chapter ${chapter.id}:`, error);
                    // Continue with the next chapter even if this one fails
                }
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: courseId,
            }
        });

        return NextResponse.json(deletedCourse);
        
    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        
        // Await params to resolve the Next.js error
        const resolvedParams = await Promise.resolve(params);
        const courseId = resolvedParams.courseId;
        
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}