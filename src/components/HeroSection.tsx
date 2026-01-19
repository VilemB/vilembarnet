"use client";

import MissionText from "./MissionText";
import DistortionCanvas from "./DistortionCanvas";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <MissionText />
      </div>
      <div className="hero-canvas">
        <DistortionCanvas />
      </div>
    </section>
  );
}
