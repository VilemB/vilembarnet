"use client";

import AnimatedIcosahedron from "@/components/AnimatedIcosahedron";
import { useEffect, useState } from "react";

export default function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="about-container">
      <div className="padding-section about-grid">

        <div className="about-visual area-visual">
          <AnimatedIcosahedron className="icosahedron-wrapper" mouseX={mousePosition.x} mouseY={mousePosition.y} />
        </div>

        <h2 className="about-label area-label-intro">INTRODUCTION</h2>
        <div className="about-text area-text-intro">
          <p>I'm Vilém Barnet, freelance web developer and designer based in the Czech Republic.</p>
        </div>

        <h2 className="about-label area-label-journey">MY JOURNEY</h2>
        <div className="about-text area-text-journey">
          <p>I started studying graphic design in 2021. Soon, I wanted to build complete digital products, so I learned web development.</p>
          <p>Since then, I've designed user interfaces and built several full-stack applications.</p>
          <p>Today, I focus on working on innovative and creative projects.</p>
        </div>

        <h2 className="about-label area-label-contact">CONTACT</h2>
        <div className="about-text area-text-contact">
          <p>for business inquiries, contact me at <a href="mailto:barnetv7@gmail.com" className="email-link">barnetv7@gmail.com</a></p>
        </div>
      </div>
    </section>
  );
}
