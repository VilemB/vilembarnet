"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
    href: string;
    children: ReactNode;
    className?: string;
}

export default function Button({ href, children, className = "" }: ButtonProps) {
    return (
        <Link href={href} className={`cta-button ${className}`}>
            {children}
        </Link>
    );
}
