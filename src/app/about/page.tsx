"use client";

import { useRef } from "react";
import { useImageDistortion } from "@/hooks/useImageDistortion";

export default function AboutPage() {
  const vilemImageRef = useRef<HTMLDivElement>(null);
  const laptopImageRef = useRef<HTMLDivElement>(null);

  // Apply distortion to both images
  useImageDistortion({
    src: "/website/vilem.png",
    containerRef: vilemImageRef,
    gridSize: 80.0,
    intensity: 0.2,
    radius: 0.35,
    easeFactor: 0.02,
  });

  useImageDistortion({
    src: "/website/laptop.png",
    containerRef: laptopImageRef,
    gridSize: 80.0,
    intensity: 0.2,
    radius: 0.35,
    easeFactor: 0.02,
  });

  return (
    <section className="about-page">
      {/* Mobile-only image */}
      <div className="about-mobile-image" ref={vilemImageRef} />

      <div className="about-grid">
        {/* Left Column: Headings and Social Links */}
        <div className="about-headings">
          <div>
            <h1 className="about-heading">ABOUT ME</h1>
          </div>

          <div>
            <h1 className="about-heading">MY JOURNEY</h1>
          </div>

          <div>
            <h1 className="about-heading">SOCIALS</h1>
            <div className="about-socials">
              <a href="https://x.com/yourusername" className="about-social-link">/ x (twitter)</a>
              <a href="https://linkedin.com/in/yourusername" className="about-social-link">/ linkedin</a>
              <a href="https://github.com/yourusername" className="about-social-link">/ github</a>
              <a href="https://instagram.com/yourusername" className="about-social-link">/ instagram</a>
              <a href="https://tiktok.com/@yourusername" className="about-social-link">/ tiktok</a>
            </div>
          </div>
        </div>

        {/* Middle Column: Images (Desktop only) */}
        <div className="about-images">
          <div className="about-image-container" ref={vilemImageRef} />
          <div className="about-image-container" ref={laptopImageRef} />
        </div>

        {/* Right Column: Content */}
        <div className="about-content">
          <div className="about-content-top">
            {/* About Me text */}
            <div className="about-section">
              <h2 className="about-heading-mobile">ABOUT ME</h2>
              <p className="about-text">
                I'm a 19-year-old web developer and designer based in the Czech Republic,
                focused on building thoughtful web applications that feel good to use.
              </p>
            </div>

            {/* My Journey text */}
            <div className="about-section">
              <h2 className="about-heading-mobile">MY JOURNEY</h2>
              <p className="about-text">
                I started studying graphic design in 2021, designing posters, packaging,
                and business cards during my internships.
              </p>
              <p className="about-text">
                Soon, I wanted to build complete digital products, so I learned web development.
              </p>
              <p className="about-text">
                Since then, I've designed user interfaces and built several full-stack applications.
              </p>
              <p className="about-text">
                Today, I focus on working with clients on innovative and creative projects.
              </p>
            </div>

            {/* Mobile Socials */}
            <div className="about-section about-section-mobile-only">
              <h2 className="about-heading-mobile">SOCIALS</h2>
              <div className="about-socials">
                <a href="https://x.com/yourusername" className="about-social-link">/ x (twitter)</a>
                <a href="https://linkedin.com/in/yourusername" className="about-social-link">/ linkedin</a>
                <a href="https://github.com/yourusername" className="about-social-link">/ github</a>
                <a href="https://instagram.com/yourusername" className="about-social-link">/ instagram</a>
                <a href="https://tiktok.com/@yourusername" className="about-social-link">/ tiktok</a>
              </div>
            </div>
          </div>

          {/* Business inquiry - bottom right */}
          <div className="about-contact-wrapper">
            <p className="about-contact">
              for business inquiries, contact me at barnetv7@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
