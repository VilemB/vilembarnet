"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export default function PageTransition() {
    const pathname = usePathname();
    const router = useRouter();
    const overlayRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [isPending, setIsPending] = useState(false);

    // Initial reveal on site entry (Loader)
    useEffect(() => {
        const tl = gsap.timeline();

        // Set initial state
        gsap.set(overlayRef.current, { scaleY: 1, transformOrigin: "top" });
        gsap.set(progressRef.current, { opacity: 1 });

        // Simulate initial loading progress
        tl.to({}, {
            duration: 1.2,
            onUpdate: function () {
                setProgress(Math.round(this.progress() * 100));
            }
        });

        // Fade out progress
        tl.to(progressRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut"
        });

        // Reveal page
        tl.to(overlayRef.current, {
            scaleY: 0,
            duration: 0.8,
            ease: "power4.inOut",
            transformOrigin: "top"
        }, "-=0.1");
    }, []);

    // Intercept internal link clicks to trigger transition
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

            // Skip same page navigation (unless we want to trigger it anyway)
            if (href === pathname || (href === "/" && pathname === "/")) {
                const menuBtn = document.querySelector(".top-nav-menu-button.menu-open") as HTMLButtonElement;
                if (menuBtn) {
                    e.preventDefault();
                    menuBtn.click();
                }
                return;
            }

            e.preventDefault();

            if (isPending) return;
            setIsPending(true);

            // Close menu if open
            const menuBtn = document.querySelector(".top-nav-menu-button.menu-open") as HTMLButtonElement;
            if (menuBtn) menuBtn.click();

            // Start transition animation (Covering)
            const tl = gsap.timeline({
                onComplete: () => {
                    router.push(href);
                }
            });

            // Cover screen from bottom
            tl.set(overlayRef.current, { transformOrigin: "bottom" });
            tl.to(overlayRef.current, {
                scaleY: 1,
                duration: 0.6,
                ease: "power4.inOut"
            });

            // Show and animate progress
            tl.to(progressRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            }, "-=0.2");

            tl.to({}, {
                duration: 0.7,
                onUpdate: function () {
                    setProgress(Math.round(this.progress() * 100));
                }
            });
        };

        document.addEventListener("click", handleLinkClick, { capture: true });
        return () => document.removeEventListener("click", handleLinkClick, { capture: true });
    }, [pathname, router, isPending]);

    // Reveal after pathname change
    useEffect(() => {
        // Check if we are currently covered (scaleY is 1)
        const scaleY = gsap.getProperty(overlayRef.current, "scaleY") as number;

        if (scaleY > 0.9) {
            const tl = gsap.timeline({
                onComplete: () => setIsPending(false)
            });

            // Delay slightly to ensure page is rendered
            tl.to(progressRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut",
                delay: 0.2
            });

            tl.to(overlayRef.current, {
                scaleY: 0,
                duration: 0.8,
                ease: "power4.inOut",
                transformOrigin: "top"
            }, "-=0.1");
        }
    }, [pathname]);

    return (
        <div className="transition-container">
            <div ref={overlayRef} className="transition-overlay" />
            <div ref={progressRef} className="transition-progress">
                [&nbsp;&nbsp;{progress}%&nbsp;&nbsp;]
            </div>
        </div>
    );
}
