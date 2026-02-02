"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AboutPage() {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        gsap.fromTo(headingRef.current,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power4.out",
                delay: 0.8, // Match Hero load timing
            }
        );
    });

    return (
        <section className="padding-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 ref={headingRef} style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 300, textTransform: 'uppercase' }}>About</h1>
        </section>
    );
}
