"use client"; // Required for useEffect and useState

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { animate } from "animejs"; // Import animejs

// Helper function to throttle scroll events
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): T {
  let lastFunc: NodeJS.Timeout | undefined;
  let lastRan: number | undefined;

  return function (this: unknown, ...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (lastRan && Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - (lastRan || 0)));
    }
  } as T;
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("about");
  const navRef = useRef<HTMLElement>(null); // Ref for the nav element

  // Smooth scroll handler with Click Animation
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // Click animation
    animate(e.currentTarget, {
      scale: [0.97, 1], // Quick shrink and return
      duration: 200,
      easing: "easeOutQuad",
    });

    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = navRef.current?.offsetHeight || 70;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const sections = ["about", "work", "contact"];
    // Ensure elements are queried only after component mounts
    const sectionElements = sections.map((id) => document.getElementById(id));

    const handleScroll = throttle(() => {
      let currentSection = "about";
      const navHeight = navRef.current?.offsetHeight || 70;
      const scrollThreshold = navHeight + 50;
      const scrollPosition = window.scrollY + scrollThreshold;

      // Check if scrolled to the bottom of the page
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10; // Allow 10px tolerance

      if (atBottom) {
        currentSection = sections[sections.length - 1]; // Force last section if at bottom
      } else {
        // Original logic to find the current section based on top offset
        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const el = sectionElements[i];
          if (el && el.offsetTop <= scrollPosition) {
            currentSection = sections[i];
            break;
          }
        }
      }

      setActiveSection((prev) =>
        prev === currentSection ? prev : currentSection
      );
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check on mount

    // Enhanced Animation setup for links on hover
    const links = navRef.current?.querySelectorAll("a[data-nav-link]");
    if (links) {
      links.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          animate(link, {
            translateY: "-4px", // Slightly more lift
            scale: 1.05, // Add subtle scale
            duration: 250, // Slightly longer duration
            easing: "easeOutExpo", // Different easing
          });
        });
        link.addEventListener("mouseleave", () => {
          animate(link, {
            translateY: "0px",
            scale: 1,
            duration: 250,
            easing: "easeOutExpo",
          });
        });
      });
    }

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Optional: Clean up anime event listeners if needed, though usually not necessary
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Enhanced CSS Classes for Underline Animations
  const linkBaseClasses =
    "px-3 py-1.5 transition-colors duration-200 ease-in-out text-sm md:text-base relative inline-block origin-bottom " +
    "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-2px] " +
    "after:h-[2px] after:rounded-full after:origin-center after:transition-all after:duration-300 after:ease-out"; // Base for underline

  const activeLinkClasses =
    "text-black font-semibold after:w-[55%] after:scale-x-100 after:bg-black"; // Visible underline for active

  const inactiveLinkClasses =
    "text-neutral-600 hover:text-neutral-900 " +
    "after:w-[55%] after:scale-x-0 after:bg-neutral-400 hover:after:scale-x-100"; // Hidden underline, visible on hover

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-sm"
    >
      {/* White background, lighter border */}
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-center items-center">
        <div className="flex space-x-4 md:space-x-5">
          <Link
            data-nav-link
            className={`${linkBaseClasses} ${
              activeSection === "about"
                ? activeLinkClasses
                : inactiveLinkClasses
            }`}
            href="#about"
            onClick={(e) => handleLinkClick(e, "about")}
          >
            About
          </Link>
          <Link
            data-nav-link
            className={`${linkBaseClasses} ${
              activeSection === "work" ? activeLinkClasses : inactiveLinkClasses
            }`}
            href="#work"
            onClick={(e) => handleLinkClick(e, "work")}
          >
            Work
          </Link>
          <Link
            data-nav-link
            className={`${linkBaseClasses} ${
              activeSection === "contact"
                ? activeLinkClasses
                : inactiveLinkClasses
            }`}
            href="#contact"
            onClick={(e) => handleLinkClick(e, "contact")}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
