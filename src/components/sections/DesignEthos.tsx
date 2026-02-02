"use client";

import { useRef } from "react";
import Button from "@/components/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function DesignEthos() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const text = "DESIGN SHOULD EVOKE EMOTION AND FEEL NATURAL.";
    const words = text.split(" ");

    useGSAP(() => {
        const wordsElements = headingRef.current?.querySelectorAll(".ethos-word");
        if (!wordsElements || wordsElements.length === 0) return;

        // Create the timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%", // Starts earlier
                end: "top 20%",   // Ends before it leaves the viewport
                scrub: 1,         // Slightly more smoothing for Lenis
            }
        });

        // Animate each word from a very light version of dark to the full dark color
        tl.to(wordsElements, {
            color: "#001F3D", // --color-dark
            stagger: 0.1,
            ease: "power2.out",
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="ethos-section">
            <div className="padding-section ethos-grid">
                <div className="ethos-top-left">
                    <h2 ref={headingRef} className="ethos-heading">
                        {words.map((word, i) => (
                            <span key={i} className="ethos-word" style={{ color: "rgba(0, 31, 61, 0.15)" }}>
                                {word}{" "}
                            </span>
                        ))}
                    </h2>
                </div>

                <div className="ethos-bottom-left">
                    <Button href="/work" className="ethos-button">
                        EXPLORE MY WORK
                    </Button>
                </div>

                <div className="ethos-bottom-right">
                    <p className="ethos-text">
                        BEYOND STRUCTURE AND USABILITY, DESIGN IS ABOUT HOW THINGS FEEL. I FOCUS ON BUILDING DIGITAL EXPERIENCES THAT EARN ATTENTION THROUGH THOUGHTFUL INTERACTION, VISUAL CLARITY, AND CARE FOR DETAIL, CREATING INTERFACES THAT FEEL NATURAL AND CONSIDERED.
                    </p>
                </div>
            </div>
        </section>
    );
}

