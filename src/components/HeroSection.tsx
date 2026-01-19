"use client";

import DistortionCanvas from "./DistortionCanvas";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p>Design should evoke emotion and feel natural. Through thoughtful design and development, I focus on creating digital experiences that are clear and intentional.</p>
      </div>
      <div className="hero-canvas">
        <DistortionCanvas />
      </div>
    </section>
  );
}
