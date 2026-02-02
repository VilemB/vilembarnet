"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function DrivenSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const bgImageRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        if (!bgImageRef.current || !sectionRef.current) return;

        gsap.fromTo(bgImageRef.current,
            { yPercent: -20 },
            {
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            }
        );

        gsap.fromTo(headingRef.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 92%",
                }
            }
        );

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="driven-section">
            <div ref={bgImageRef} className="driven-bg">
                <Image
                    src="/website/vilem.webp"
                    alt="Vilem Barnet"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            <div className="driven-overlay"></div>

            <div className="padding-section driven-content">
                <div className="driven-top">
                    <h2 ref={headingRef} className="driven-heading">
                        DRIVEN BY A PASSION<br />FOR BUILDING.
                    </h2>
                </div>

                <div className="driven-bottom">
                    <div className="driven-bottom-left">
                        <div className="driven-service">[ WEB APPLICATIONS ]</div>
                        <div className="driven-service">[ WEB DESIGN ]</div>
                        <div className="driven-service">[ BRANDING ]</div>
                    </div>

                    <div className="driven-bottom-right">
                        <Button href="/about" className="driven-button">
                            GET TO KNOW ME
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
