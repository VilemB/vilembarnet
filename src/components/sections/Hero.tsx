"use client";

import PixelatedText from "@/components/PixelatedText";
import Link from "next/link";
import Clock from "@/components/Clock";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="padding-section hero-grid">
        {/* Center: PixelatedText */}
        <div className="hero-center">
          <div className="pixelated-text">
            <PixelatedText>@barnetvilem</PixelatedText>
          </div>
        </div>

        {/* Bottom Left: Description + CTA */}
        <div className="hero-footer-left">
          <p className="hero-description">
            Through thoughtful design and development, I focus on creating digital experiences that are clear and intentional.
          </p>
          <Link href="mailto:barnetv7@gmail.com" className="cta-button">
            Work With Me
          </Link>
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
