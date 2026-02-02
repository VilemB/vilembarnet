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

  // Scroll behavior
  useGSAP(() => {
    if (!navRef.current) return;

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (isMenuOpen || isTransitioning) return;

        // Show on scroll up or at the very top
        if (self.direction === -1 || self.scroll() < 50) {
          gsap.to(navRef.current, {
            yPercent: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true
          });
        } else {
          // Hide on scroll down
          gsap.to(navRef.current, {
            yPercent: -100,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true
          });
        }
      }
    });
  }, { scope: navRef });

  // Handle Menu Open/Close and Transitions
  useGSAP(() => {
    if (!navRef.current) return;

    if (isMenuOpen || isTransitioning) {
      // Hide navigation when menu is open or transitioning
      gsap.to(navRef.current, {
        yPercent: -100,
        duration: 0.4,
        ease: "power2.inOut",
        overwrite: true
      });
    } else {
      // When menu closes or transition ends, reset visibility based on scroll position
      const scrollY = window.scrollY;
      const shouldShow = scrollY < 50; // Simple logic: show if at top. 
      // If user is scrolled down, we might want to keep it hidden until they scroll up, 
      // OR show it to confirm they are back on the page. 
      // Given the "slide up" complaint, users expect it to behave normally immediately.
      // Let's default to SHOWING it if we just closed the menu, to be safe and responsive.
      // But if we are scrolled down, showing it might be annoying?
      // "the navigation doesn't slide up" implies it stays stuck or wrong. 
      // Let's trust the scroll trigger to handle the *next* move, but we need an initial state.
      // If we are at the top, show it.

      if (scrollY < 50) {
        gsap.to(navRef.current, {
          yPercent: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true
        });
      } else {
        // If we are scrolled down, ensure it matches the "hidden" state or allowing the user to scroll up to see it.
        // To fix "doesn't slide up", we ensure it IS able to slide up (hide) if we start scrolling down.
        // Is it possible it was stuck at 0?
        // The issue described is: "when he scrolls down, the navigation doesn't slide up."
        // This means it IS visible, but fails to hide.
        // This happens if the scroll trigger is broken.
        // By recreating the logic above without `showAnim`, the ScrollTrigger `onUpdate` will fire on next scroll event and fix it.
        // But we should set a sensible default here.
        // Let's leave it as is (active ScrollTrigger will catch the next event).
        // But to be sure, let's explicitely set it to visible if we are just closing the menu so the user sees *something* changed?
        // Actually, if we just closed the menu, we are usually looking at content.
        // Let's set it to 0 (visible) so the user knows where they are, then scroll down hides it.
        gsap.to(navRef.current, {
          yPercent: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true
        });
      }
    }
  }, { scope: navRef, dependencies: [isMenuOpen, isTransitioning] });

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



