"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MenuOverlay from "./MenuOverlay";

gsap.registerPlugin(ScrollTrigger);

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavBackground, setShowNavBackground] = useState(true);

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

  // Sync background state with menu state with a delay
  useEffect(() => {
    if (isMenuOpen) {
      // Delay transparency and light text until overlay is almost fully expanded
      const timer = setTimeout(() => {
        setShowNavBackground(false);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      // When closing, wait for overlay to start closing before switching back
      const timer = setTimeout(() => {
        setShowNavBackground(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  useGSAP(() => {
    if (!navRef.current) return;

    if (isMenuOpen) {
      // On menu open: hide the nav quickly so it doesn't transition color while visible
      gsap.to(navRef.current, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.inOut",
      });
    } else if (!isMenuOpen && !showNavBackground) {
      // On menu close start: slide it out if it was in the menu state
      gsap.to(navRef.current, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, { scope: navRef, dependencies: [isMenuOpen, showNavBackground] });

  useGSAP(() => {
    if (!navRef.current) return;

    if (!showNavBackground && isMenuOpen) {
      // After showNavBackground turns false (menu is open), animate it back in
      gsap.fromTo(navRef.current,
        { yPercent: -100 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: "power4.out",
          delay: 0.1
        }
      );
    } else if (showNavBackground && !isMenuOpen) {
      // When closing is done and background is restored, slide it back in for the page
      gsap.fromTo(navRef.current,
        { yPercent: -100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out"
        }
      );
    }
  }, { scope: navRef, dependencies: [showNavBackground, isMenuOpen] });

  return (
    <>
      <nav
        ref={navRef}
        className={`top-navigation ${!showNavBackground ? 'nav-open' : ''}`}
        style={{
          backgroundColor: !showNavBackground ? 'transparent' : 'var(--color-light)',
          borderBottom: !showNavBackground ? 'none' : '1px solid transparent'
        }}
      >
        <div className="top-nav-content">
          <div className="top-nav-left">
            <span>WEB DEVELOPER</span>
            <span className="top-nav-divider"></span>
            <span>DESIGNER</span>
          </div>

          <div className="top-nav-right">
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
        </div>
      </nav>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}


