"use client";

import DistortionCanvas from "./DistortionCanvas";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2 className="hero-subtitle">web development • design</h2>
        <p className="hero-text">
          Design should evoke emotion and feel natural. Through thoughtful design and development, I focus on creating digital experiences that are clear and intentional.
        </p>
      </div>
      <div className="hero-canvas">
        <DistortionCanvas />
      </div>
    </section>
  );
}
