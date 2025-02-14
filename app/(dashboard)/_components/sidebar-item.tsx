"use client";

import { LucideIcon } from "lucide-react";
import { iconNames } from "lucide-react/dynamic";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
};

export const SidebarItem = ( {
    icon: Icon,
    label,
    href,
}: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = 
        (pathname === "/" && href === "/") ||
        pathname === href || 
        pathname?.startsWith(`${href}/`);


    return ( 
        <div>
            Sidebar Item
        </div>
     );
}