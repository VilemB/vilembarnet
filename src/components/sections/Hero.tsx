"use client";

import PixelatedText from "@/components/PixelatedText";
import Clock from "@/components/Clock";
import Button from "@/components/Button";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="padding-section hero-grid">
        {/* Center: PixelatedText */}
        <div className="hero-center">
          <div className="pixelated-text">
            <PixelatedText>BARNETVILEM</PixelatedText>
          </div>
        </div>

        {/* Bottom Left: Description + CTA */}
        <div className="hero-footer-left">
          <p className="hero-description">
            I design and build digital experiences with clarity and intention.
          </p>
          <Button href="mailto:barnetv7@gmail.com">
            Work With Me
          </Button>
        </div>

        {/* Bottom Right: Scroll Hint */}
        <div className="hero-footer-right">
          <div className="scroll-hint">
            [ SCROLL TO CONTINUE ]
          </div>
        </div>
      </div>
    </section>
  );
}
