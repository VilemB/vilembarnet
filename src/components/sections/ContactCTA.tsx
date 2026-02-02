"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { initRollAnimation } from "@/lib/animations/roll";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ContactCTA() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        if (!headingRef.current) return;

        gsap.fromTo(headingRef.current,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 95%",
                }
            }
        );

        // Initialize roll animation for the contact link
        const link = sectionRef.current?.querySelector(".contact-link") as HTMLElement;
        if (link) {
            return initRollAnimation(link);
        }
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="contact-cta-section">
            <div className="padding-section contact-cta-container">
                <h2 ref={headingRef} className="contact-cta-heading">
                    WANT TO COLLAB?
                    <Link href="mailto:barnetv7@gmail.com" className="contact-link">
                        CONTACT ME
                    </Link>
                </h2>
            </div>
        </section>
    );
}
