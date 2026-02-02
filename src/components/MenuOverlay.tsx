"use client";

declare global {
    interface Window {
        lenis: any;
    }
}

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { scrambleIn, scrambleOut, scrambleVisible } from "@/lib/animations/scramble";
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
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    const socials = [
        { name: "X (Twitter)", href: "https://x.com/barnetvilem" },
        { name: "LinkedIn", href: "https://www.linkedin.com/in/vilém-barnet-497003365/" },
        { name: "Instagram", href: "https://instagram.com/barnetvilem" },
        { name: "Github", href: "https://github.com/vilemb" },
    ];

    const cleanupScrambleInstances = () => {
        scrambleInstances.current.forEach((instance) => {
            if (instance && instance.wordSplit) {
                instance.wordSplit.revert();
            }
        });
        scrambleInstances.current = [];
    };

    const resetAllTextToOriginal = () => {
        const allLinks = overlayRef.current?.querySelectorAll("a");
        allLinks?.forEach((link: any) => {
            link.style.color = "";
            const originalText = link.dataset.originalText || link.textContent;
            if (link.querySelector(".char")) {
                link.innerHTML = originalText;
            }
        });
    };

    useEffect(() => {
        if (!overlayRef.current) return;

        if (isOpen) {
            // Open Menu
            gsap.to(overlayRef.current, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.8,
                ease: "power4.inOut",
                onStart: () => {
                    if (window.lenis) window.lenis.stop();
                }
            });

            cleanupScrambleInstances();
            resetAllTextToOriginal();

            // Animate nav items
            const items = navItemsRef.current?.querySelectorAll(".nav-item");
            items?.forEach((item: any, index: number) => {
                const link = item.querySelector("a");
                if (link) {
                    gsap.set(item, { opacity: 1, transform: "translateY(0%)" });
                    const instance = scrambleIn(link, 0.4 + index * 0.1, {
                        duration: 0.2,
                        charDelay: 40,
                        stagger: 20,
                        maxIterations: 8,
                    });
                    scrambleInstances.current.push(instance);
                }
            });

            // Animate footer links
            const footerLinks = footerRef.current?.querySelectorAll("a");
            footerLinks?.forEach((link: any, index: number) => {
                const instance = scrambleIn(link, 0.8 + index * 0.05, {
                    duration: 0.15,
                    charDelay: 30,
                    stagger: 15,
                    maxIterations: 5,
                });
                scrambleInstances.current.push(instance);
            });

        } else {
            // Close Menu
            gsap.to(overlayRef.current, {
                clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => {
                    if (window.lenis) window.lenis.start();
                }
            });

            // Scramble out
            const items = navItemsRef.current?.querySelectorAll(".nav-item a");
            items?.forEach((link: any, index: number) => {
                scrambleOut(link, index * 0.05);
            });
        }
    }, [isOpen]);

    // Hover effects
    useEffect(() => {
        if (!isOpen) return;

        const allLinks = overlayRef.current?.querySelectorAll("a");

        const handleMouseEnter = (e: MouseEvent) => {
            const link = e.currentTarget as HTMLElement;
            scrambleVisible(link, 0, {
                duration: 0.2,
                charDelay: 40,
                stagger: 20,
            });
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const link = e.currentTarget as HTMLElement;
            link.style.color = "";
        };

        allLinks?.forEach(link => {
            link.addEventListener("mouseenter", handleMouseEnter as any);
            link.addEventListener("mouseleave", handleMouseLeave as any);
        });

        return () => {
            allLinks?.forEach(link => {
                link.removeEventListener("mouseenter", handleMouseEnter as any);
                link.removeEventListener("mouseleave", handleMouseLeave as any);
            });
        };
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
