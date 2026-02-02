"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef } from "react";
import { initRollAnimation } from "@/lib/animations/roll";

interface ButtonProps {
    href: string;
    children: ReactNode;
    className?: string;
}

export default function Button({ href, children, className = "" }: ButtonProps) {
    const btnRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (btnRef.current) {
            const cleanup = initRollAnimation(btnRef.current);
            return () => cleanup?.();
        }
    }, []);

    return (
        <Link ref={btnRef} href={href} className={`cta-button ${className}`}>
            {children}
        </Link>
    );
}
