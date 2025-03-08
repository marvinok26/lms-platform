import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title } = await req.json();

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json(course);
    
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}