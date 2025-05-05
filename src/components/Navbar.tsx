"use client"; // Required for useEffect and useState

import Link from "next/link";
import { useState, useEffect } from "react";
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

  // Smooth scroll handler - Simplified for side nav
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // Keep subtle click animation
    animate(e.currentTarget, {
      scale: [0.95, 1],
      duration: 150,
      easing: "easeOutQuad",
    });

    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (element) {
      // Simple scroll into view, adjust behavior if needed
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const sections = ["about", "work", "contact"];
    const sectionElements = sections.map((id) => document.getElementById(id));

    const handleScroll = throttle(() => {
      let currentSection = "about";
      // Adjust threshold for vertical nav - might need tweaking
      const scrollThreshold = window.innerHeight * 0.3;
      const scrollPosition = window.scrollY + scrollThreshold;

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (atBottom) {
        currentSection = sections[sections.length - 1];
      } else {
        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const el = sectionElements[i];
          // Use offsetTop directly, should be fine
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
    handleScroll();

    // Remove previous Anime hover effect setup
    // const links = navRef.current?.querySelectorAll("a[data-nav-link]"); ...

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // New CSS Classes for Vertical Side Nav
  const linkBaseClasses =
    "w-full text-center py-3 px-2 transition-colors duration-200 ease-in-out text-sm relative group"; // Full width, centered text

  const activeLinkClasses = "text-white bg-gray-700/50"; // Brighter text, subtle background

  const inactiveLinkClasses =
    "text-gray-400 hover:text-white hover:bg-gray-700/30"; // Dimmer text, different hover

  return (
    <nav
      // Side Nav Styling
      className="fixed top-0 left-0 h-screen w-20 bg-gray-800 text-white flex flex-col items-center pt-20 z-50 shadow-lg"
    >
      <div className="flex flex-col space-y-6 w-full items-center">
        <Link
          className={`${linkBaseClasses} ${
            // Removed data-nav-link as querySelector is removed
            activeSection === "about" ? activeLinkClasses : inactiveLinkClasses
          }`}
          href="#about"
          onClick={(e) => handleLinkClick(e, "about")}
        >
          {/* Consider Icons Here */}
          <span className="block">About</span>{" "}
          {/* Ensure text wraps or use icons */}
        </Link>
        <Link
          className={`${linkBaseClasses} ${
            activeSection === "work" ? activeLinkClasses : inactiveLinkClasses
          }`}
          href="#work"
          onClick={(e) => handleLinkClick(e, "work")}
        >
          <span className="block">Work</span>
        </Link>
        <Link
          className={`${linkBaseClasses} ${
            activeSection === "contact"
              ? activeLinkClasses
              : inactiveLinkClasses
          }`}
          href="#contact"
          onClick={(e) => handleLinkClick(e, "contact")}
        >
          <span className="block">Contact</span>
        </Link>
      </div>
    </nav>
  );
}
