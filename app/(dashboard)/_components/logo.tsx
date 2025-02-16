"use client";

import Image from "next/image";

export const Logo = () => {
    return ( 
        <Image
            height={140}
            width={1400}
            alt="Logo"
            src="/logo.svg"
        />
     );
}