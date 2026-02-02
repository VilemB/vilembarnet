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

  // Sync background state with menu state with a delay when closing
  useEffect(() => {
    if (isMenuOpen) {
      setShowNavBackground(false);
    } else {
      // Delay reappearing of solid background
      const timer = setTimeout(() => {
        setShowNavBackground(true);
      }, 500); // Wait for menu animation to partially complete
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`top-navigation ${!showNavBackground ? 'nav-open' : ''}`}
        style={{
          backgroundColor: !showNavBackground ? 'transparent' : 'var(--color-light)',
          borderBottom: !showNavBackground ? 'none' : '1px solid transparent',
          transition: 'background-color 0.6s ease'
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

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}


