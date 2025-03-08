"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
    items: Chapter[];
    onReorder: (updatedData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
}

export const ChaptersList = ({
    items,
    onReorder,
    onEdit
}: ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    if (!isMounted) {
        return null;
    }

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedItemId(id);
        // Set ghost drag image
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        
        if (!draggedItemId || draggedItemId === targetId) return;
        
        const sourceIndex = chapters.findIndex(chapter => chapter.id === draggedItemId);
        const targetIndex = chapters.findIndex(chapter => chapter.id === targetId);
        
        if (sourceIndex === -1 || targetIndex === -1) return;
        
        // Create a new array with the item moved to the new position
        const updatedChapters = [...chapters];
        const [reorderedItem] = updatedChapters.splice(sourceIndex, 1);
        updatedChapters.splice(targetIndex, 0, reorderedItem);
        
        // Calculate startIndex and endIndex for the bulk update
        const startIndex = Math.min(sourceIndex, targetIndex);
        const endIndex = Math.max(sourceIndex, targetIndex);
        
        // Get only the chapters that changed
        const changedChapters = updatedChapters.slice(startIndex, endIndex + 1);
        
        // Create bulk update data
        const bulkUpdateData = changedChapters.map((chapter) => ({
            id: chapter.id,
            position: updatedChapters.findIndex((item) => item.id === chapter.id),
        }));
        
        setChapters(updatedChapters);
        onReorder(bulkUpdateData);
        setDraggedItemId(null);
    };

    const handleDragEnd = () => {
        setDraggedItemId(null);
    };

    return (
        <div>
            {chapters.map((chapter, index) => (
                <div 
                    key={chapter.id}
                    className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm", 
                        chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700",
                        draggedItemId === chapter.id && "opacity-50"
                    )}
                    draggable
                    onDragStart={(e) => handleDragStart(e, chapter.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, chapter.id)}
                    onDragEnd={handleDragEnd}
                >
                    <div 
                        className={cn(
                            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition cursor-move", 
                            chapter.isPublished && "hover:bg-sky-200 border-r-sky-200"
                        )}
                    >
                        <Grip className="h-5 w-5"/>
                    </div>
                    <div className="px-2">{chapter.title}</div>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {chapter.isFree && (
                            <Badge variant="outline">
                                Free
                            </Badge>
                        )}
                        <Badge variant="outline" className={cn("bg-slate-500", chapter.isPublished && "bg-sky-700")}>
                            {chapter.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil 
                            onClick={() => onEdit(chapter.id)}
                            className="w-4 h-4 hover:opacity-75 cursor-pointer transition"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};