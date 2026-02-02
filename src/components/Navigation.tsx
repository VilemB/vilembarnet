"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import MenuOverlay from "./MenuOverlay";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsTransitioning(true);
    const handleEnd = () => setIsTransitioning(false);

    window.addEventListener("pageTransitionStart", handleStart);
    window.addEventListener("pageTransitionEnd", handleEnd);

    return () => {
      window.removeEventListener("pageTransitionStart", handleStart);
      window.removeEventListener("pageTransitionEnd", handleEnd);
    };
  }, []);

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
        if (isMenuOpen) return;
        if (self.direction === -1 || self.scroll() < 50) {
          showAnim.play();
        } else {
          showAnim.reverse();
        }
      },
    });
  }, { scope: navRef, dependencies: [isMenuOpen] });



  useGSAP(() => {
    if (!navRef.current) return;

    if (isTransitioning || isMenuOpen) {
      gsap.to(navRef.current, {
        yPercent: -100,
        duration: 0.4,
        ease: "power2.inOut",
        overwrite: true
      });
    } else {
      gsap.to(navRef.current, {
        yPercent: 0,
        duration: 0.6,
        ease: "power4.out",
        delay: 0.2,
        overwrite: true
      });
    }
  }, { scope: navRef, dependencies: [isTransitioning, isMenuOpen] });

  useGSAP(() => {
    if (!navRef.current) return;

    if (isMenuOpen) {
      // Keep it visible but potentially handle animations here if needed
      // We don't slide it out anymore as per user request to avoid redundant animations
    }
  }, { scope: navRef, dependencies: [isMenuOpen] });

  return (
    <>
      <nav
        ref={navRef}
        className={`top-navigation ${isMenuOpen ? 'nav-open' : ''}`}
        style={{
          backgroundColor: 'var(--color-light)',
          borderBottom: '1px solid transparent'
        }}
      >
        <div className="top-nav-content">
          <div className="top-nav-left">
            <span>WEB DEVELOPER</span>
            <span className="top-nav-divider"></span>
            <span>DESIGNER</span>
          </div>

        </div>
      </nav>

      <div className="top-nav-controls">
        <button
          className={`top-nav-menu-button ${isMenuOpen ? 'menu-open' : ''}`}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 33 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="menu-icon-svg"
          >
            <path d="M31.5 21L11 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M31.5 1L11 0.999998" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M21.5 11L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}


