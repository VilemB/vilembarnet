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
    const bottomContentRef = useRef<HTMLDivElement>(null);

    const text = "DESIGN SHOULD EVOKE EMOTION AND FEEL NATURAL.";
    const words = text.split(" ");

    useGSAP(() => {
        const wordsElements = headingRef.current?.querySelectorAll(".ethos-word");
        if (!wordsElements || wordsElements.length === 0) return;

        // 1. Text color reveal (existing)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                end: "top 20%",
                scrub: 1,
            }
        });

        tl.to(wordsElements, {
            color: "#001F3D",
            stagger: 0.1,
            ease: "power2.out",
        });

        // 2. Content reveal (Button and description)
        if (bottomContentRef.current) {
            gsap.fromTo(bottomContentRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: bottomContentRef.current,
                        start: "top 90%",
                    }
                }
            );
        }

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

                <div ref={bottomContentRef} className="ethos-bottom-content-wrapper" style={{ display: 'contents' }}>
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
            </div>
        </section>
    );
}
