"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

CustomEase.create("hop",
    "M0,0 C0.29,0 0.348,0.05 0.422,0.134 0.494,0.217 0.484,0.355 0.5,0.5 0.518,0.662 0.515,0.793 0.596,0.876 0.701,0.983 0.72,0.987 1,1"
);

const POLY_HIDDEN_BOTTOM = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const POLY_FULL = "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)";
const POLY_HIDDEN_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

export default function PageTransition() {
    const pathname = usePathname();
    const router = useRouter();
    const overlayRef = useRef<HTMLDivElement>(null);
    const accentRef = useRef<HTMLDivElement>(null);
    const isPendingRef = useRef(false);
    const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const prefersReducedMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lockScroll = () => {
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = "hidden";
    };

    const unlockScroll = () => {
        document.body.style.overflow = "";
        if (window.lenis) {
            window.lenis.start();
            requestAnimationFrame(() => {
                if (window.lenis) {
                    window.lenis.resize();
                }
            });
        }
    };

    const revealPage = useCallback(() => {
        if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }

        if (overlayRef.current) gsap.killTweensOf(overlayRef.current);
        if (accentRef.current) gsap.killTweensOf(accentRef.current);

        if (prefersReducedMotion()) {
            gsap.set(overlayRef.current, { clipPath: POLY_HIDDEN_TOP });
            gsap.set(accentRef.current, { clipPath: POLY_HIDDEN_TOP });
            isPendingRef.current = false;
            unlockScroll();
            window.scrollTo(0, 0);
            if (window.lenis) window.lenis.scrollTo(0, { immediate: true, force: true });
            requestAnimationFrame(() => ScrollTrigger.refresh());
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                isPendingRef.current = false;
                unlockScroll();
                window.scrollTo(0, 0);
                if (window.lenis) window.lenis.scrollTo(0, { immediate: true, force: true });
                requestAnimationFrame(() => ScrollTrigger.refresh());
            },
        });

        tl.to(accentRef.current, {
            clipPath: POLY_HIDDEN_TOP,
            duration: 1,
            ease: "hop",
            onStart: () => {
                window.dispatchEvent(new CustomEvent("pageTransitionEnd"));
            }
        });

        let revealFired = false;
        tl.to(overlayRef.current, {
            clipPath: POLY_HIDDEN_TOP,
            duration: 1,
            ease: "hop",
            onUpdate: function() {
                if (!revealFired && this.progress() >= 0.6) {
                    revealFired = true;
                    window.dispatchEvent(new CustomEvent("pageRevealComplete"));
                }
            }
        }, "-=0.85");

    }, []);

    useEffect(() => {
        lockScroll();

        if (prefersReducedMotion()) {
            gsap.set(overlayRef.current, { clipPath: POLY_HIDDEN_TOP });
            gsap.set(accentRef.current, { clipPath: POLY_HIDDEN_TOP });
            unlockScroll();
            return;
        }

        gsap.set(overlayRef.current, { clipPath: POLY_FULL });
        gsap.set(accentRef.current, { clipPath: POLY_FULL });

        let revealed = false;
        const reveal = () => {
            if (revealed) return;
            revealed = true;

            if (overlayRef.current) gsap.killTweensOf(overlayRef.current);
            if (accentRef.current) gsap.killTweensOf(accentRef.current);

            requestAnimationFrame(() => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        unlockScroll();
                        requestAnimationFrame(() => ScrollTrigger.refresh());
                    },
                });

                tl.to(accentRef.current, {
                    clipPath: POLY_HIDDEN_TOP,
                    duration: 1.2,
                    ease: "hop",
                    onStart: () => {
                        window.dispatchEvent(new CustomEvent("pageTransitionEnd"));
                    }
                });

                let revealFired = false;
                tl.to(overlayRef.current, {
                    clipPath: POLY_HIDDEN_TOP,
                    duration: 1.2,
                    ease: "hop",
                    onUpdate: function() {
                        if (!revealFired && this.progress() >= 0.6) {
                            revealFired = true;
                            window.dispatchEvent(new CustomEvent("pageRevealComplete"));
                        }
                    },
                }, "-=1.0");
            });
        };

        if (document.readyState === "complete") {
            reveal();
        } else {
            window.addEventListener("load", reveal, { once: true });
            const fallback = setTimeout(reveal, 3000);
            return () => {
                window.removeEventListener("load", reveal);
                clearTimeout(fallback);
            };
        }
    }, []);

    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            const targetAttr = link.getAttribute("target");

            if (
                !href ||
                href.startsWith("http") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                href.startsWith("#") ||
                targetAttr === "_blank"
            ) {
                return;
            }

            if (href === pathname || (href === "/" && pathname === "/")) {
                const menuBtn = document.querySelector(".top-nav-menu-button.menu-open") as HTMLButtonElement;
                if (menuBtn) {
                    e.preventDefault();
                    menuBtn.click();
                }
                return;
            }

            e.preventDefault();
            if (isPendingRef.current) return;
            isPendingRef.current = true;

            lockScroll();

            window.dispatchEvent(new CustomEvent("pageTransitionStart"));
            const menuBtn = document.querySelector(".top-nav-menu-button.menu-open") as HTMLButtonElement;
            if (menuBtn) menuBtn.click();

            if (prefersReducedMotion()) {
                router.push(href);
                return;
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    if (!isPendingRef.current) return;
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));
                    window.scrollTo(0, 0);

                    router.push(href);

                    fallbackTimerRef.current = setTimeout(() => {
                        revealPage();
                    }, 5000);
                },
            });

            gsap.set(accentRef.current, { clipPath: POLY_HIDDEN_BOTTOM });
            gsap.set(overlayRef.current, { clipPath: POLY_HIDDEN_BOTTOM });

            tl.to(accentRef.current, {
                clipPath: POLY_FULL,
                duration: 0.7,
                ease: "hop",
            });

            tl.to(overlayRef.current, {
                clipPath: POLY_FULL,
                duration: 0.7,
                ease: "hop",
            }, "-=0.55");
        };

        document.addEventListener("click", handleLinkClick, { capture: true });
        return () => document.removeEventListener("click", handleLinkClick, { capture: true });
    }, [pathname, router, revealPage]);

    useEffect(() => {
        if (!isPendingRef.current) return;
        revealPage();
    }, [pathname, revealPage]);

    return (
        <div className="transition-container" role="presentation" aria-hidden="true">
            <div ref={overlayRef} className="transition-overlay" />
            <div ref={accentRef} className="transition-overlay-accent" />
        </div>
    );
}
