"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface PreviewProps {
    value: string;
    limit?: number;
}

export const Preview = ({ value, limit = 300 }: PreviewProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    // If there's no value, show a placeholder
    if (!value) {
        return <div className="text-sm text-slate-500 italic">No content</div>;
    }
    
    // Simple estimation for HTML content length
    const estimatedLength = value.replace(/<[^>]*>/g, '').length;
    const isLongContent = estimatedLength > limit;

    return (
        <div className="prose prose-sm max-w-none">
            {isExpanded || !isLongContent ? (
                <div dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
                <>
                    <div 
                        className="line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: value }} 
                    />
                    <div className="text-sm opacity-80">...</div>
                </>
            )}
            
            {isLongContent && (
                <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="link"
                    className="mt-1 p-0 h-auto text-sm"
                >
                    {isExpanded ? "Show less" : "Show more"}
                </Button>
            )}
        </div>
    );
}