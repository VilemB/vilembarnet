"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

export default function About() {
    const aboutRef = useRef<HTMLDivElement>(null);
    const firstLineRef = useRef<HTMLDivElement>(null);
    const secondLineRef = useRef<HTMLDivElement>(null);

    gsap.registerPlugin(ScrollTrigger);
    useGSAP(() => {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutRef.current,
                start: "bottom bottom",
                end: "+=400",
                scrub: true,
                pin: true,
                markers: true,
            }
        });

        tl.to(firstLineRef.current, {
            delay: .5,
            opacity: 0,
            y: -30,
            ease: "power1.out",
        })
        .fromTo(secondLineRef.current, {
            opacity: 0,
            y: 30,
        }, {
            opacity: 1,
            y: 0,
            ease: "power1.in",
        })
        .to(secondLineRef.current, {
            delay: .5,
            top: "30%",
            ease: "power1.in",
        })
        

    })

    return (
        <section ref={aboutRef} className="about">
            <h2 className="" ref={firstLineRef}>I enjoy designing and building digital products</h2>
            <h2 className="" ref={secondLineRef}>Here are some of the projects I've worked on</h2>

            <div className="projects-container">

            </div>
        </section>
    );
}
