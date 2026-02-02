"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!navRef.current) return;

    const showAnim = gsap.from(navRef.current, {
      yPercent: -100,
      paused: true,
      duration: 0.3,
      ease: "power2.out",
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        // Show at the very top, or when scrolling up
        if (self.direction === -1 || self.scroll() < 50) {
          showAnim.play();
        } else {
          showAnim.reverse();
        }
      },
    });
  }, { scope: navRef });

  return (
    <nav ref={navRef} className="top-navigation">
      <div className="top-nav-content">
        {/* Left: Navigation Text */}
        <div className="top-nav-left">
          <span>WEB DEVELOPER</span>
          <span className="top-nav-divider"></span>
          <span>DESIGNER</span>
        </div>

        {/* Right: Menu Icon */}
        <div className="top-nav-right">
          <button className="top-nav-menu-button" aria-label="Open menu">
            <Image
              src="/icons/menu.svg"
              alt="Menu"
              width={32}
              height={32}
              priority
            />
          </button>
        </div>
      </div>
    </nav>
  );
}


