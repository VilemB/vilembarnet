"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import MenuOverlay from "./MenuOverlay";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

export default function Navigation() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const showAnim = useRef<gsap.core.Tween | null>(null);

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

  const isWorkPage = pathname === '/work';

  useGSAP(() => {
    if (!navRef.current || isWorkPage) return;

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (isMenuOpen || isTransitioning) return;

        if (self.direction === -1 || self.scroll() < 50) {
          gsap.to(navRef.current, {
            yPercent: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true
          });
        } else {
          gsap.to(navRef.current, {
            yPercent: -100,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true
          });
        }
      }
    });
  }, { scope: navRef, dependencies: [isMenuOpen, isTransitioning, pathname, isWorkPage] });

  useGSAP(() => {
    if (!navRef.current) return;

    if (isMenuOpen || (isTransitioning && !isWorkPage)) {
      gsap.to(navRef.current, {
        yPercent: -100,
        duration: 0.4,
        ease: "power2.inOut",
        overwrite: true
      });
    } else if (isWorkPage) {
      gsap.killTweensOf(navRef.current);
      gsap.set(navRef.current, { yPercent: 0 });
    } else {
      gsap.to(navRef.current, {
        yPercent: 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true
      });
    }
  }, { scope: navRef, dependencies: [isMenuOpen, isTransitioning, isWorkPage] });

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



