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

    gsap.set([footerLeftRef.current, footerRightRef.current, headingRef.current], {
      y: 40,
      opacity: 0,
    });

    const tl = gsap.timeline({
      delay: 0.8,
      defaults: {
        ease: "power4.out",
        duration: 0.8,
      }
    });
    tl.to(headingRef.current, {
      y: 0,
      opacity: 1,
    });

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
        <div ref={headingRef} className="hero-center">
          <div className="pixelated-text">
            <PixelatedText>BARNETVILEM</PixelatedText>
          </div>
        </div>

        <div ref={footerLeftRef} className="hero-footer-left">
          <p className="hero-description">
            I DESIGN AND BUILD DIGITAL EXPERIENCES WITH CLARITY AND INTENTION.
          </p>
          <Button href="mailto:barnetv7@gmail.com">
            WORK WITH ME
          </Button>
        </div>

        <div ref={footerRightRef} className="hero-footer-right">
          <div className="scroll-hint">
            [ SCROLL TO CONTINUE ]
          </div>
        </div>
      </div>
    </section>
  );
}
