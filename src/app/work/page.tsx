"use client";

import { useState } from "react";
import Image from "next/image";

const projects = [
  { number: "01", name: "Studio Eclipse", image: "/work/eclipse-studio.webp" },
  { number: "02", name: "LumenApps", image: "/work/lumenapps.webp" },
  { number: "03", name: "Stepps.ai", image: "/work/stepps.webp" },
  { number: "04", name: "Travist", image: "/work/travist.webp" },
];

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="work">
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
