"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  { number: "01", name: "Studio Eclipse", image: "/work/eclipse-studio.webp" },
  { number: "02", name: "LumenApps", image: "/work/lumenapps.webp" },
  { number: "03", name: "Stepps.ai", image: "/work/stepps.webp" },
  { number: "04", name: "Travist", image: "/work/travist.webp" },
];

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray(".work-item");

    items.forEach((item: any) => {
      gsap.fromTo(item,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: item,
            start: "top 92%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="work" id="work">
      <div className="padding-section work-content">
        {projects.map((project, index) => (
          <div
            key={project.number}
            className={`work-item${index === activeIndex ? " work-item--active" : ""}`}
          >
            <button
              className="work-item-header"
              aria-expanded={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span className="work-item-number">{project.number}</span>
              <span className="work-item-name">{project.name}</span>
            </button>
            <div className="work-item-panel">
              <div className="work-item-image">
                <Image
                  src={project.image}
                  alt={project.name}
                  width={1600}
                  height={900}
                  sizes="(max-width: 720px) 100vw, 80vw"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
