"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PixelatedText from "@/components/PixelatedText";
import Clock from "@/components/Clock";
import Button from "@/components/Button";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const footerLeftRef = useRef<HTMLDivElement>(null);
  const footerRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial state: shifted down and transparent
    gsap.set([footerLeftRef.current, footerRightRef.current, headingRef.current], {
      y: 40,
      opacity: 0,
    });

    const tl = gsap.timeline({
      delay: 0.8, // Start right after the transition overlay clears the screen
      defaults: {
        ease: "power4.out",
        duration: 0.8,
      }
    });

    // Main heading: Strong slide up
    tl.to(headingRef.current, {
      y: 0,
      opacity: 1,
    });

    // Footer items: Staggered slide up
    tl.to([footerLeftRef.current, footerRightRef.current], {
      y: 0,
      opacity: 1,
      stagger: 0.1,
    }, "-=0.6");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="hero-section">
      <div className="padding-section hero-grid">
        {/* Center: PixelatedText */}
        <div ref={headingRef} className="hero-center">
          <div className="pixelated-text">
            <PixelatedText>BARNETVILEM</PixelatedText>
          </div>
        </div>

        {/* Bottom Left: Description + CTA */}
        <div ref={footerLeftRef} className="hero-footer-left">
          <p className="hero-description">
            I DESIGN AND BUILD DIGITAL EXPERIENCES WITH CLARITY AND INTENTION.
          </p>
          <Button href="mailto:barnetv7@gmail.com">
            WORK WITH ME
          </Button>
        </div>

        {/* Bottom Right: Scroll Hint */}
        <div ref={footerRightRef} className="hero-footer-right">
          <div className="scroll-hint">
            [ SCROLL TO CONTINUE ]
          </div>
        </div>
      </div>
    </section>
  );
}
