"use client";

import ReactConfetti from "react-confetti";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useEffect, useState } from "react";

export const ConfettiProvider = () => {
    const confetti = useConfettiStore();
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    });

    useEffect(() => {
        // Set dimensions when component mounts
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });

        // Update dimensions on window resize
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!confetti.isOpen) return null;

    return (
        <ReactConfetti 
            className="pointer-events-none z-[100]"
            numberOfPieces={500}
            recycle={false}
            width={dimensions.width}
            height={dimensions.height}
            onConfettiComplete={() => confetti.onClose()}
        />
    );
}