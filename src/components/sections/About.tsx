"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRef } from "react";

export default function About() {
    const aboutRef = useRef<HTMLDivElement>(null);
    const firstLineRef = useRef<HTMLDivElement>(null);
    const secondLineRef = useRef<HTMLDivElement>(null);

    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutRef.current,
                start: "bottom bottom",
                end: "+=800",
                scrub: 1.2,
                pin: true,
                markers: true,
            }
        });

        tl.to(firstLineRef.current, {
            opacity: 0,
            y: -40,
            duration: 1,
            ease: "power2.inOut",
        })
            .fromTo(secondLineRef.current, {
                opacity: 0,
                y: 40,
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
            }, "-=0.3")
    });

    return (
        <section ref={aboutRef} className="about">
            <h2 className="" ref={firstLineRef}>hi, my name is Vilém Barnet</h2>
            <h2 className="" ref={secondLineRef}>I enjoy designing and building digital products <span className="italic font-bold">from scratch.</span></h2>
        </section>
    );
}
