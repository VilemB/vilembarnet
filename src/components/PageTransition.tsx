"use client";

import { useEffect, useRef, useCallback, useState } from "react";
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
    const progressRef = useRef<HTMLDivElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);
    const isPendingRef = useRef(false);
    const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressTweenRef = useRef<gsap.core.Tween | null>(null);
    const progressObjRef = useRef({ value: 0 });
    const [progress, setProgress] = useState(0);

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

    const killProgressTween = () => {
        if (progressTweenRef.current) {
            progressTweenRef.current.kill();
            progressTweenRef.current = null;
        }
    };

    const revealPage = useCallback(() => {
        if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }

        killProgressTween();
        if (progressRef.current) gsap.killTweensOf(progressRef.current);
        if (progressTextRef.current) gsap.killTweensOf(progressTextRef.current);
        if (overlayRef.current) gsap.killTweensOf(overlayRef.current);
        if (accentRef.current) gsap.killTweensOf(accentRef.current);

        progressObjRef.current.value = 100;
        setProgress(100);

        if (prefersReducedMotion()) {
            gsap.set(overlayRef.current, { clipPath: POLY_HIDDEN_TOP });
            gsap.set(accentRef.current, { clipPath: POLY_HIDDEN_TOP });
            gsap.set(progressRef.current, { opacity: 0 });
            isPendingRef.current = false;
            unlockScroll();
            requestAnimationFrame(() => ScrollTrigger.refresh());
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                isPendingRef.current = false;
                unlockScroll();
                requestAnimationFrame(() => ScrollTrigger.refresh());
            },
        });

        tl.to(progressTextRef.current, {
            y: -30,
            duration: 0.5,
            ease: "power3.inOut",
        });

        tl.to(progressRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.inOut",
        }, "-=0.3");

        tl.to(accentRef.current, {
            clipPath: POLY_HIDDEN_TOP,
            duration: 1,
            ease: "hop",
            onStart: () => {
                window.dispatchEvent(new CustomEvent("pageTransitionEnd"));
            }
        }, "-=0.3");

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

        gsap.set(progressRef.current, { opacity: 1 });
        gsap.set(progressTextRef.current, { y: 20 });
        progressObjRef.current.value = 0;
        setProgress(0);

        gsap.to(progressTextRef.current, {
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.3,
        });

        progressTweenRef.current = gsap.to(progressObjRef.current, {
            value: 90,
            duration: 2.5,
            ease: "power2.out",
            delay: 0.3,
            onUpdate: () => {
                setProgress(Math.round(progressObjRef.current.value));
            },
        });

        let revealed = false;
        const reveal = () => {
            if (revealed) return;
            revealed = true;

            killProgressTween();
            if (progressRef.current) gsap.killTweensOf(progressRef.current);
            if (progressTextRef.current) gsap.killTweensOf(progressTextRef.current);
            if (overlayRef.current) gsap.killTweensOf(overlayRef.current);
            if (accentRef.current) gsap.killTweensOf(accentRef.current);

            progressObjRef.current.value = 100;
            setProgress(100);

            requestAnimationFrame(() => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        unlockScroll();
                        requestAnimationFrame(() => ScrollTrigger.refresh());
                    },
                });

                tl.to(progressTextRef.current, {
                    y: -30,
                    duration: 0.6,
                    ease: "power3.inOut",
                    delay: 0.2,
                });

                tl.to(progressRef.current, {
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.inOut",
                }, "-=0.3");

                tl.to(accentRef.current, {
                    clipPath: POLY_HIDDEN_TOP,
                    duration: 1.2,
                    ease: "hop",
                    onStart: () => {
                        window.dispatchEvent(new CustomEvent("pageTransitionEnd"));
                    }
                }, "-=0.3");

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

            killProgressTween();
            progressObjRef.current.value = 0;
            setProgress(0);

            const tl = gsap.timeline({
                onComplete: () => {
                    if (!isPendingRef.current) return;
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));
                    window.scrollTo(0, 0);

                    gsap.set(progressTextRef.current, { y: 20 });

                    gsap.to(progressTextRef.current, {
                        y: 0,
                        duration: 0.4,
                        ease: "power3.out",
                    });

                    progressTweenRef.current = gsap.to(progressObjRef.current, {
                        value: 90,
                        duration: 3,
                        ease: "power2.out",
                        onUpdate: () => {
                            setProgress(Math.round(progressObjRef.current.value));
                        },
                    });

                    gsap.to(progressRef.current, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: true,
                    });

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
            <div ref={progressRef} className="transition-progress">
                <span ref={progressTextRef} style={{ display: 'inline-block' }}>
                    {progress}%
                </span>
            </div>
        </div>
    );
}
