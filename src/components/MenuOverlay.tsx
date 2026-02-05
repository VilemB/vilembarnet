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
import { CustomEase } from "gsap/CustomEase";
import Clock from "./Clock";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(CustomEase);

// Same easing as PageTransition — shared visual language
CustomEase.create("hop",
    "M0,0 C0.29,0 0.348,0.05 0.422,0.134 0.494,0.217 0.484,0.355 0.5,0.5 0.518,0.662 0.515,0.793 0.596,0.876 0.701,0.983 0.72,0.987 1,1"
);

const POLY_HIDDEN_BOTTOM = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const POLY_FULL = "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)";
const POLY_HIDDEN_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

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
    // Cleanup is deferred to the close animation's onComplete to prevent letter-spacing flash
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
    }, [isOpen]);

    // Safety cleanup on unmount
    useEffect(() => {
        return () => {
            rollCleanupsRef.current.forEach(c => c());
            rollCleanupsRef.current = [];
            splitInstancesRef.current.forEach(s => s.revert());
            splitInstancesRef.current = [];
        };
    }, []);

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

            // Reset overlay
            gsap.set(overlayRef.current, {
                clipPath: POLY_HIDDEN_BOTTOM
            });

            // Overlay sweeps up with organic momentum
            tl.to(overlayRef.current, {
                clipPath: POLY_FULL,
                duration: 1,
                ease: "hop",
                onStart: () => {
                    if (window.lenis) window.lenis.stop();
                }
            });

            // SplitText character reveals
            const navLinkEls = navItemsRef.current?.querySelectorAll(".nav-item a");
            if (navLinkEls && navLinkEls.length > 0) {
                splitInstancesRef.current.forEach(s => s.revert());
                splitInstancesRef.current = [];

                navLinkEls.forEach((linkEl) => {
                    const split = new SplitText(linkEl, { type: "chars" });
                    splitInstancesRef.current.push(split);

                    gsap.set(split.chars, { yPercent: 100, opacity: 0 });

                    tl.to(split.chars, {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.02,
                        ease: "power4.out",
                    }, 0.4);
                });
            }

            // Structural lines fade in
            tl.to([lineLeftRef.current, lineRightRef.current], {
                opacity: 0.1,
                duration: 0.4,
                ease: "power2.out",
            }, 0.5);

            // Footer social links slide up
            const socialLinks = footerRef.current?.querySelectorAll(".nav-footer-item a");
            if (socialLinks && socialLinks.length > 0) {
                gsap.set(socialLinks, { opacity: 0, y: 15 });
                tl.to(socialLinks, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: "power4.out",
                }, 0.55);
            }

            // Footer clock fade in
            const footerRight = footerRef.current?.querySelector(".nav-footer-right");
            if (footerRight) {
                gsap.set(footerRight, { opacity: 0 });
                tl.to(footerRight, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                }, 0.65);
            }

        } else {
            // -- CLOSE SEQUENCE --

            // Immediately hide content to prevent flash
            if (navItemsRef.current) gsap.set(navItemsRef.current, { opacity: 0 });
            if (footerRef.current) gsap.set(footerRef.current, { opacity: 0 });
            gsap.set([lineLeftRef.current, lineRightRef.current], { opacity: 0 });

            const tl = gsap.timeline();
            tlRef.current = tl;

            // Overlay collapses upward with the same organic momentum
            tl.to(overlayRef.current, {
                clipPath: POLY_HIDDEN_TOP,
                duration: 0.8,
                ease: "hop",
                onComplete: () => {
                    if (window.lenis) window.lenis.start();

                    // Deferred cleanup to avoid flash
                    rollCleanupsRef.current.forEach(c => c());
                    rollCleanupsRef.current = [];

                    splitInstancesRef.current.forEach(s => s.revert());
                    splitInstancesRef.current = [];

                    // Reset content opacity for next open
                    if (navItemsRef.current) gsap.set(navItemsRef.current, { opacity: 1 });
                    if (footerRef.current) gsap.set(footerRef.current, { opacity: 1 });

                    // Signal Navigation that close animation is done
                    window.dispatchEvent(new CustomEvent("menuCloseComplete"));
                }
            });
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
