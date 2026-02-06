"use client";

import { useRef } from "react";
import PixelatedPhoto from "@/components/PixelatedPhoto";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function DrivenSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const text = "DRIVEN BY A PASSION FOR BUILDING.";
    const words = text.split(" ");

    useGSAP(() => {
        const wordsElements = headingRef.current?.querySelectorAll(".driven-word");
        if (!wordsElements || wordsElements.length === 0) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                end: "top 20%",
                scrub: 1,
            }
        });

        tl.to(wordsElements, {
            color: "#0F0E0E",
            stagger: 0.1,
            ease: "power2.out",
        });

        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 90%",
                    }
                }
            );
        }
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="driven-section">
            <div className="driven-container">
                <div className="driven-inner">
                    <h2 ref={headingRef} className="driven-heading">
                        {words.map((word, i) => (
                            <span key={i} className="driven-word" style={{ color: "color-mix(in srgb, var(--color-dark) 30%, var(--color-light))" }}>
                                {word}{" "}
                            </span>
                        ))}
                    </h2>

                    <div ref={contentRef} className="driven-grid">
                        <div className="driven-services">
                            <div className="driven-service">[ WEB APPLICATIONS ]</div>
                            <div className="driven-service">[ WEB DESIGN ]</div>
                            <div className="driven-service">[ BRANDING ]</div>
                        </div>

                        <PixelatedPhoto
                            src="/website/vilem.webp"
                            alt="Vilem Barnet"
                            className="driven-photo"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
