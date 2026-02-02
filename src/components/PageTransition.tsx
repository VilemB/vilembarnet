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
        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }
        if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }

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

            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                isPendingRef.current = false;
                unlockScroll();

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
                window.dispatchEvent(new CustomEvent("pageTransitionEnd"));
            }
        }, "-=0.05");
    }, []);
    useEffect(() => {
        lockScroll();

        if (prefersReducedMotion()) {
            gsap.set(overlayRef.current, { scaleY: 0 });
            unlockScroll();
            return;
        }

        gsap.set(overlayRef.current, { scaleY: 1, transformOrigin: "top" });

        gsap.set(progressRef.current, { opacity: 1 });
        progressObjRef.current.value = 0;
        setProgress(0);

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

            killProgressTween();
            if (progressRef.current) gsap.killTweensOf(progressRef.current);
            if (overlayRef.current) gsap.killTweensOf(overlayRef.current);

            progressObjRef.current.value = 100;
            setProgress(100);

            requestAnimationFrame(() => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        unlockScroll();

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
