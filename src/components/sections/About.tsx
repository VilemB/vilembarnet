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
    const waveRef = useRef<HTMLDivElement>(null);
    const wavePathRef = useRef<SVGPathElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);

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
        .to(secondLineRef.current, {
            top: "40%",
            duration: 1.2,
            ease: "power3.inOut",
        }, "+=0.2")
        .fromTo(projectsRef.current,
            {
                yPercent: 100,
                scale: 0.92
            },
            {
                yPercent: 50,
                scale: 1,
                duration: 1.5,
                ease: "power2.out",
            },
            "-=0.4"
        )
        .to(waveRef.current, {
            yPercent: -200,
            duration: 1.5,
            ease: "power2.inOut",
        }, "<")
        

        gsap.set(wavePathRef.current, { drawSVG: "0%" });

        gsap.to(wavePathRef.current, {
            drawSVG: "100%",
            duration: 2.5,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: aboutRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });

        gsap.to(waveRef.current, {
            y: -80,
            rotation: 15,
            scrollTrigger: {
                trigger: aboutRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            },
        });

    });

    return (
        <section ref={aboutRef} className="about">
            <h2 className="" ref={firstLineRef}>I enjoy designing and building digital products <span className="italic font-bold">from scratch.</span></h2>
            <h2 className="" ref={secondLineRef}>Here are some of the projects I've worked on</h2>

            <div
                ref={waveRef}
                className="absolute left-[5%] bottom-[15%] md:left-[10%] md:bottom-[20%] scale-75 md:scale-100 pointer-events-none opacity-80"
            >
                <svg
                    width="113"
                    height="108"
                    viewBox="0 0 113 108"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        ref={wavePathRef}
                        d="M6.50195 92.3019C53.8547 108.873 59.5164 100.331 44.7616 88.0311C30.0067 75.7311 -29.2923 37.851 49.233 65.8122C106.354 86.1519 89.7124 65.8121 48.5361 40.0271C11.115 16.5937 13.2715 -10.2365 59.6982 19.9291C95.8888 43.4438 108.013 40.0271 106.354 40.0271"
                        stroke="#ED985F"
                        strokeWidth="13"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div ref={projectsRef} className="projects-container w-full h-full bg-accent rounded-2xl">

            </div>
        </section>
    );
}
