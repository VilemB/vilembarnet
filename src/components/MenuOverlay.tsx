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
    const lineLeftRef = useRef<HTMLDivElement>(null);
    const lineRightRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const splitInstancesRef = useRef<SplitText[]>([]);
    const rollCleanupsRef = useRef<(() => void)[]>([]);

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

    // ESC key to close
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    // Roll animation on nav links and social links
    useEffect(() => {
        if (!isOpen) return;

        const cleanups: (() => void)[] = [];

        const navLinkEls = navItemsRef.current?.querySelectorAll(".nav-item a");
        navLinkEls?.forEach((link: any) => {
            const cleanup = initRollAnimation(link);
            if (cleanup) cleanups.push(cleanup);
        });

        const socialLinkEls = footerRef.current?.querySelectorAll(".nav-footer-item a");
        socialLinkEls?.forEach((link: any) => {
            const cleanup = initRollAnimation(link);
            if (cleanup) cleanups.push(cleanup);
        });

        rollCleanupsRef.current = cleanups;

        return () => {
            cleanups.forEach(c => c());
            rollCleanupsRef.current = [];
        };
    }, [isOpen]);

    // Main animation
    useEffect(() => {
        if (!overlayRef.current) return;

        // Kill any running timeline
        if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
        }

        if (isOpen) {
            // -- OPEN SEQUENCE --
            const tl = gsap.timeline();
            tlRef.current = tl;

            // Reset overlay state
            gsap.set(overlayRef.current, {
                clipPath: "inset(100% 0 0 0)"
            });

            // Wipe overlay in (reveal from bottom to top)
            tl.to(overlayRef.current, {
                clipPath: "inset(0% 0 0 0)",
                duration: 0.8,
                ease: "power4.inOut",
                onStart: () => {
                    if (window.lenis) window.lenis.stop();
                }
            });

            // SplitText character reveals for nav items
            const navLinkEls = navItemsRef.current?.querySelectorAll(".nav-item a");
            if (navLinkEls && navLinkEls.length > 0) {
                // Clean up previous splits
                splitInstancesRef.current.forEach(s => s.revert());
                splitInstancesRef.current = [];

                navLinkEls.forEach((linkEl) => {
                    const split = new SplitText(linkEl, { type: "chars" });
                    splitInstancesRef.current.push(split);

                    // Set initial state
                    gsap.set(split.chars, { yPercent: 100, opacity: 0 });

                    // Animate chars in
                    tl.to(split.chars, {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.02,
                        ease: "power4.out",
                    }, 0.35);
                });
            }

            // Structural lines fade in
            tl.to([lineLeftRef.current, lineRightRef.current], {
                opacity: 0.1,
                duration: 0.4,
                ease: "power2.out",
            }, 0.5);

            // Footer social links fade + slide in
            const socialLinks = footerRef.current?.querySelectorAll(".nav-footer-item a");
            if (socialLinks && socialLinks.length > 0) {
                gsap.set(socialLinks, { opacity: 0, y: 15 });
                tl.to(socialLinks, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power4.out",
                }, 0.5);
            }

            // Footer clock fade in
            const footerRight = footerRef.current?.querySelector(".nav-footer-right");
            if (footerRight) {
                gsap.set(footerRight, { opacity: 0 });
                tl.to(footerRight, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                }, 0.6);
            }

        } else {
            // -- CLOSE SEQUENCE --
            const tl = gsap.timeline();
            tlRef.current = tl;

            // Fade out all content quickly
            const allContent = [
                ...(navItemsRef.current ? [navItemsRef.current] : []),
                ...(footerRef.current ? [footerRef.current] : []),
            ];

            if (allContent.length > 0) {
                tl.to(allContent, {
                    opacity: 0,
                    duration: 0.25,
                    ease: "power2.in",
                });
            }

            // Fade out structural lines
            tl.to([lineLeftRef.current, lineRightRef.current], {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
            }, 0);

            // Wipe overlay out (hide from bottom to top)
            tl.to(overlayRef.current, {
                clipPath: "inset(0 0 100% 0)",
                duration: 0.6,
                ease: "power4.inOut",
                onComplete: () => {
                    if (window.lenis) window.lenis.start();

                    // Reset content opacity for next open
                    if (navItemsRef.current) gsap.set(navItemsRef.current, { opacity: 1 });
                    if (footerRef.current) gsap.set(footerRef.current, { opacity: 1 });

                    // Clean up SplitText
                    splitInstancesRef.current.forEach(s => s.revert());
                    splitInstancesRef.current = [];

                    // Signal Navigation that close animation is done
                    window.dispatchEvent(new CustomEvent("menuCloseComplete"));
                }
            }, 0.15);
        }
    }, [isOpen]);

    return (
        <div
            ref={overlayRef}
            className="nav-overlay"
            style={{ pointerEvents: isOpen ? "all" : "none", padding: "8rem 0 2rem 0" }}
        >
            {/* Structural framing lines */}
            <div ref={lineLeftRef} className="nav-overlay-line-left" />
            <div ref={lineRightRef} className="nav-overlay-line-right" />

            {/* Close button */}
            <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
                <div className="top-nav-content">
                    <div className="top-nav-left opacity-0"></div>
                    <div className="top-nav-right">
                        <button
                            onClick={onClose}
                            className="menu-close-button"
                            aria-label="Close Menu"
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 33 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="menu-icon-svg"
                            >
                                <path d="M31.5 21L11 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M31.5 1L11 0.999998" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M21.5 11L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
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
