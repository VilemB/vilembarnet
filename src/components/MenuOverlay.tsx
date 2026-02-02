"use client";

declare global {
    interface Window {
        lenis: any;
    }
}

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { initRollAnimation } from "@/lib/animations/roll";
import { SplitText } from "gsap/SplitText";
import Clock from "./Clock";

gsap.registerPlugin(SplitText);

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const navItemsRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const scrambleInstances = useRef<any[]>([]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Work", href: "/work" },
        { name: "Contact", href: "mailto:barnetv7@gmail.com" },
    ];

    const socials = [
        { name: "X (Twitter)", href: "https://x.com/barnetvilem" },
        { name: "LinkedIn", href: "https://www.linkedin.com/in/vilém-barnet-497003365/" },
        { name: "Instagram", href: "https://instagram.com/barnetvilem" },
        { name: "Github", href: "https://github.com/vilemb" },
    ];

    useEffect(() => {
        if (!isOpen) return;

        const links = navItemsRef.current?.querySelectorAll(".nav-item a");
        const cleanups: (() => void)[] = [];

        links?.forEach((link: any) => {
            const cleanup = initRollAnimation(link);
            if (cleanup) cleanups.push(cleanup);
        });

        return () => {
            cleanups.forEach(c => c());
        };
    }, [isOpen]);

    useEffect(() => {
        if (!overlayRef.current) return;

        if (isOpen) {
            gsap.to(overlayRef.current, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.8,
                ease: "power4.inOut",
                onStart: () => {
                    if (window.lenis) window.lenis.stop();
                }
            });

            const items = navItemsRef.current?.querySelectorAll(".nav-item");
            if (items && items.length > 0) {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power4.out",
                    delay: 0.4
                });
            }

        } else {
            gsap.to(overlayRef.current, {
                clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => {
                    if (window.lenis) window.lenis.start();
                }
            });

            const items = navItemsRef.current?.querySelectorAll(".nav-item");
            if (items && items.length > 0) {
                gsap.to(items, {
                    opacity: 0,
                    y: 20,
                    duration: 0.4,
                    ease: "power2.in"
                });
            }
        }
    }, [isOpen]);

    return (
        <div
            ref={overlayRef}
            className="nav-overlay"
            style={{
                pointerEvents: isOpen ? "all" : "none",
                padding: "8rem 0 2rem 0"
            }}
        >
            <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
                <div className="top-nav-content">
                    <div className="top-nav-left opacity-0"></div> {/* Spacer to match layout */}
                    <div className="top-nav-right">
                        <button
                            onClick={onClose}
                            className="top-nav-menu-button pointer-events-auto"
                            aria-label="Close Menu"
                        >
                            <img
                                src="/icons/menu.svg"
                                alt="Close Menu"
                                style={{ filter: "invert(1)" }}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="nav-background-clock">
                <Clock />
            </div>

            <div ref={navItemsRef} className="nav-items">
                {navLinks.map((link) => (
                    <div key={link.name} className="nav-item">
                        <Link href={link.href} onClick={onClose}>
                            {link.name.toUpperCase()}
                        </Link>
                    </div>
                ))}
            </div>

            <div ref={footerRef} className="nav-footer">
                <div className="nav-footer-item socials">
                    {socials.map((social) => (
                        <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
                            {social.name.toUpperCase()}
                        </a>
                    ))}
                </div>

                <div className="nav-footer-right">
                    <Clock />
                </div>
            </div>
        </div>
    );
}
