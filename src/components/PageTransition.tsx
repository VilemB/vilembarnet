"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function PageTransition() {
    const pathname = usePathname();
    const router = useRouter();
    const overlayRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const isPendingRef = useRef(false);
    const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
            // Force Lenis to update after unlocking
            requestAnimationFrame(() => {
                if (window.lenis) {
                    window.lenis.resize();
                }
            });
        }
    };

    // Kill any running progress tween
    const killProgressTween = () => {
        if (progressTweenRef.current) {
            progressTweenRef.current.kill();
            progressTweenRef.current = null;
        }
    };

    // Reveal the page (shared between initial load and transitions)
    const revealPage = useCallback(() => {
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }
        if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }

        // Snap progress to 100%
        killProgressTween();
        if (progressRef.current) gsap.killTweensOf(progressRef.current);
        if (overlayRef.current) gsap.killTweensOf(overlayRef.current);

        progressObjRef.current.value = 100;
        setProgress(100);

        if (prefersReducedMotion()) {
            gsap.set(overlayRef.current, { scaleY: 0 });
            gsap.set(progressRef.current, { opacity: 0 });
            isPendingRef.current = false;
            unlockScroll();

            // Refresh ScrollTrigger after DOM is ready
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                isPendingRef.current = false;
                unlockScroll();

                // Refresh ScrollTrigger after page is revealed and scroll is unlocked
                requestAnimationFrame(() => {
                    ScrollTrigger.refresh();
                });
            },
        });

        tl.to(progressRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.inOut",
            overwrite: true,
        });

        tl.to(overlayRef.current, {
            scaleY: 0,
            duration: 0.6,
            ease: "power4.inOut",
            transformOrigin: "top",
            overwrite: true,
            onStart: () => {
                // Dispatch event to show navigation
                window.dispatchEvent(new CustomEvent("pageTransitionEnd"));
            }
        }, "-=0.05");
    }, []);

    // Initial reveal — waits for the page to actually be ready
    useEffect(() => {
        lockScroll();

        if (prefersReducedMotion()) {
            gsap.set(overlayRef.current, { scaleY: 0 });
            unlockScroll();
            return;
        }

        gsap.set(overlayRef.current, { scaleY: 1, transformOrigin: "top" });

        // Show progress during initial load
        gsap.set(progressRef.current, { opacity: 1 });
        progressObjRef.current.value = 0;
        setProgress(0);

        // Animate progress toward 90% while page loads
        progressTweenRef.current = gsap.to(progressObjRef.current, {
            value: 90,
            duration: 3,
            ease: "power2.out",
            onUpdate: () => {
                setProgress(Math.round(progressObjRef.current.value));
            },
        });

        let revealed = false;
        const reveal = () => {
            if (revealed) return;
            revealed = true;

            // Snap to 100% and reveal
            killProgressTween();
            if (progressRef.current) gsap.killTweensOf(progressRef.current);
            if (overlayRef.current) gsap.killTweensOf(overlayRef.current);

            progressObjRef.current.value = 100;
            setProgress(100);

            requestAnimationFrame(() => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        unlockScroll();

                        // Refresh ScrollTrigger after initial page load
                        requestAnimationFrame(() => {
                            ScrollTrigger.refresh();
                        });
                    },
                });

                tl.to(progressRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.inOut",
                    delay: 0.15,
                    overwrite: true,
                });

                tl.to(overlayRef.current, {
                    scaleY: 0,
                    duration: 0.8,
                    ease: "power4.inOut",
                    transformOrigin: "top",
                    overwrite: true,
                    onStart: () => {
                        window.dispatchEvent(new CustomEvent("pageTransitionEnd"));
                    }
                }, "-=0.1");
            });
        };

        if (document.readyState === "complete") {
            reveal();
        } else {
            window.addEventListener("load", reveal, { once: true });
            // Fallback: don't block the user longer than 3s
            const fallback = setTimeout(reveal, 3000);
            return () => {
                window.removeEventListener("load", reveal);
                clearTimeout(fallback);
            };
        }
    }, []);

    // Intercept internal link clicks
    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            const targetAttr = link.getAttribute("target");

            // Skip external links, mailto, tel, anchor, or new tab
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

            // Skip same page navigation (just close menu if open)
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

            // Lock scroll immediately
            lockScroll();

            // Dispatch event for other components (like Navigation) to hide
            window.dispatchEvent(new CustomEvent("pageTransitionStart"));

            // Close menu if open
            const menuBtn = document.querySelector(".top-nav-menu-button.menu-open") as HTMLButtonElement;
            if (menuBtn) menuBtn.click();

            if (prefersReducedMotion()) {
                router.push(href);
                return;
            }

            // Reset progress
            killProgressTween();
            progressObjRef.current.value = 0;
            setProgress(0);

            // Quick cover (~300ms), then navigate immediately
            const tl = gsap.timeline({
                onComplete: () => {
                    if (!isPendingRef.current) return;

                    // Clean up old page (overlay covers screen, safe to revert)
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));
                    window.scrollTo(0, 0);

                    // Start progress animation: 0 → 90% over 3s (eases out so it slows down)
                    progressTweenRef.current = gsap.to(progressObjRef.current, {
                        value: 90,
                        duration: 3,
                        ease: "power2.out",
                        onUpdate: () => {
                            setProgress(Math.round(progressObjRef.current.value));
                        },
                    });

                    // Show progress immediately (overlay is already covering the screen)
                    gsap.to(progressRef.current, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: true,
                    });

                    // Start navigation
                    router.push(href);

                    // Safety fallback: reveal after 5s no matter what
                    fallbackTimerRef.current = setTimeout(() => {
                        revealPage();
                    }, 5000);
                },
            });

            tl.set(overlayRef.current, { transformOrigin: "bottom" });
            tl.to(overlayRef.current, {
                scaleY: 1,
                duration: 0.3,
                ease: "power4.inOut",
            });
        };

        document.addEventListener("click", handleLinkClick, { capture: true });
        return () => document.removeEventListener("click", handleLinkClick, { capture: true });
    }, [pathname, router, revealPage]);

    // Reveal after pathname changes (navigation complete)
    useEffect(() => {
        if (!isPendingRef.current) return;
        revealPage();
    }, [pathname, revealPage]);

    return (
        <div className="transition-container" role="presentation" aria-hidden="true">
            <div ref={overlayRef} className="transition-overlay" />
            <div ref={progressRef} className="transition-progress">
                [&nbsp;&nbsp;{progress}%&nbsp;&nbsp;]
            </div>
        </div>
    );
}
