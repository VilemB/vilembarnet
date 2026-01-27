"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { textHoverAnimation } from "@/utils/gsapAnimations";

const Navbar = () => {
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        linksRef.current.forEach((link) => {
            if (link) {
                textHoverAnimation(link);
            }
        });
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="navbar-logo">
                    <Image
                        src="/logos/logo.svg"
                        alt="Logo"
                        width={50}
                        height={50}
                        priority
                    />
                </Link>
                <div className="navbar-links">
                    <Link href="/work" ref={(el) => { linksRef.current[0] = el; }}>
                        work
                    </Link>
                    <Link href="/about" ref={(el) => { linksRef.current[1] = el; }}>
                        about
                    </Link>
                    <Link href="/blog" ref={(el) => { linksRef.current[2] = el; }}>
                        blog
                    </Link>
                    <Link href="mailto:barnetv7@gmail.com" ref={(el) => { linksRef.current[3] = el; }}>
                        contact
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
