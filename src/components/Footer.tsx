"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { initRollAnimation } from "@/lib/animations/roll";

interface SocialLinkProps {
    href: string;
    label: string;
}

function SocialLink({ href, label }: SocialLinkProps) {
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (linkRef.current) {
            const cleanup = initRollAnimation(linkRef.current);
            return cleanup;
        }
    }, []);

    return (
        <Link
            href={href}
            ref={linkRef}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
        >
            {label.toUpperCase()}
        </Link>
    );
}

export default function Footer() {
    return (
        <footer className="footer min-h-screen">
            <div className="footer-container h-full flex flex-col">
                <div className="footer-line-top" />

                <div className="footer-inner flex-grow flex flex-col">
                    <div className="flex-grow flex flex-col items-center justify-center">
                        <div className="footer-collab">
                            <p className="footer-collab-text">WANT TO COLLAB?</p>
                            <Link href="mailto:barnetv7@gmail.com" className="footer-email">
                                barnetv7@gmail.com
                            </Link>
                        </div>
                    </div>

                    <div className="footer-bottom-section">
                        <div className="footer-main-row">
                            <div className="footer-socials-left">
                                <SocialLink href="https://x.com/barnetvilem" label="X (Twitter)" />
                                <SocialLink href="https://www.linkedin.com/in/vilém-barnet-497003365/" label="LinkedIn" />
                            </div>

                            <Link href="/" className="footer-logo">
                                <Image
                                    className=""
                                    src="/logos/logo.svg"
                                    alt="VB Logo"
                                    width={80}
                                    height={80}
                                    priority
                                />
                            </Link>

                            <div className="footer-socials-right">
                                <SocialLink href="https://instagram.com/barnetvilem" label="Instagram" />
                                <SocialLink href="https://github.com/vilemb" label="Github" />
                            </div>
                        </div>

                        <div className="footer-copyright">
                            <p>© 2026 Vilém Barnet</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}