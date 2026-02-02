"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisScroll() {
    useEffect(() => {
        const isMobile = window.innerWidth <= 1000;

        const lenis = new Lenis({
            duration: isMobile ? 0.8 : 1.2,
            lerp: isMobile ? 0.075 : 0.1,
            smoothWheel: true,
            syncTouch: true,
            touchMultiplier: isMobile ? 1.5 : 2,
        });

        if (document.body.style.overflow === "hidden") {
            lenis.stop();
        }

        lenis.on("scroll", ScrollTrigger.update);

        const ticker = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        window.lenis = lenis;

        return () => {
            gsap.ticker.remove(ticker);
            lenis.destroy();
            window.lenis = null;
        };
    }, []);

    return null;
}
