"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisScroll() {
    const pathname = usePathname();

    useEffect(() => {
        const isMobile = window.innerWidth <= 1000;

        const lenis = new Lenis({
            duration: isMobile ? 0.8 : 1.2,
            lerp: isMobile ? 0.075 : 0.1,
            smoothWheel: true,
            syncTouch: true,
            touchMultiplier: isMobile ? 1.5 : 2,
        });

        lenis.on("scroll", ScrollTrigger.update);

        const ticker = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        window.lenis = lenis;

        // Start Lenis immediately
        lenis.start();

        return () => {
            gsap.ticker.remove(ticker);
            lenis.destroy();
            window.lenis = null;
        };
    }, []);

    useEffect(() => {
        // Reset scroll position on route change
        window.scrollTo(0, 0);

        if (window.lenis) {
            // Ensure Lenis is started (in case it was stopped during transition)
            window.lenis.start();

            // Reset scroll position immediately
            window.lenis.scrollTo(0, { immediate: true, force: true });

            // Refresh ScrollTrigger after a brief delay to ensure DOM is ready
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        }
    }, [pathname]);

    return null;
}
