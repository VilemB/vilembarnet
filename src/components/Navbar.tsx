"use client"; // Required for useEffect and useState

import Link from "next/link";
import { useState, useEffect, useRef } from "react"; // Added useRef
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

// Placeholder SVG Icon (inspired by the image) - REMOVED as it's unused
// const LogoIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M6.75 7.5L3 12L6.75 16.5M17.25 7.5L21 12L17.25 16.5M14.25 3L9.75 21"
//       stroke="#6D28D9"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <rect
//       x="4"
//       y="9"
//       width="6"
//       height="6"
//       rx="1"
//       fill="#6D28D9"
//       fillOpacity="0.2"
//     />
//     <rect
//       x="14"
//       y="9"
//       width="6"
//       height="6"
//       rx="1"
//       fill="#6D28D9"
//       fillOpacity="0.2"
//     />
//   </svg>
// );

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("about");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navLinksRef = useRef<HTMLDivElement>(null); // Ref for the container of main navigation links

  // Link data - sectionId should match IDs in your page.tsx
  // Text can be whatever you want to display.
  const navigationLinks = [
    { id: "about", text: "About" }, // Was "Pricing" in example, using "About" to match existing page section
    { id: "work", text: "Work" }, // Was "FAQ" in example, using "Work"
    { id: "contact", text: "Contact" }, // Was "Blog" in example, using "Contact"
    // { id: "blog", text: "Blog" }, // Example, if you have a blog section
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    animate(
      {
        targets: e.currentTarget,
        scale: [0.97, 1],
        duration: 200,
        easing: "easeOutQuad",
      },
      {}
    );
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const sectionIds = navigationLinks.map((link) => link.id);

    const updateActiveStateAndUnderline = () => {
      let currentSectionId = sectionIds[0] || "";
      const scrollThreshold = window.innerHeight * 0.4; // Can be adjusted
      const scrollPosition = window.scrollY + scrollThreshold;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 20;

      if (atBottom && sectionIds.length > 0) {
        currentSectionId = sectionIds[sectionIds.length - 1];
      } else {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const section = document.getElementById(sectionIds[i]);
          if (section && section.offsetTop <= scrollPosition) {
            currentSectionId = sectionIds[i];
            break;
          }
        }
      }
      setActiveSection(currentSectionId);

      if (navLinksRef.current) {
        const activeLinkElement = navLinksRef.current.querySelector(
          `a[href="#${currentSectionId}"]`
        ) as HTMLElement;

        if (activeLinkElement) {
          setUnderlineStyle({
            width: activeLinkElement.offsetWidth - 16, // Account for px-2 on links (8px each side)
            transform: `translateX(${activeLinkElement.offsetLeft + 8}px)`,
            opacity: 1,
          });
        } else {
          setUnderlineStyle({ opacity: 0, width: 0 });
        }
      }
    };

    const throttledScrollHandler = throttle(updateActiveStateAndUnderline, 100);
    window.addEventListener("scroll", throttledScrollHandler);
    window.addEventListener("resize", updateActiveStateAndUnderline);
    updateActiveStateAndUnderline(); // Initial call

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      window.removeEventListener("resize", updateActiveStateAndUnderline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // navigationLinks can be added if it's dynamic, but here it's static

  const baseLinkClasses =
    "px-3 py-2 text-sm transition-colors duration-200 ease-out rounded-md"; // Added px-3 for a bit more space
  const navLinkClasses = `${baseLinkClasses} text-slate-700 hover:text-blue-600`;
  const activeNavLinkTextClass = "!text-blue-600 font-medium";

  return (
    <nav
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 
                 bg-white/90 backdrop-blur-md 
                 rounded-full shadow-xl border border-gray-200/75"
    >
      <div className="flex items-center justify-center h-14 px-4 sm:px-6">
        <div
          ref={navLinksRef}
          className="flex items-center space-x-1 sm:space-x-2 relative"
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`${navLinkClasses} ${
                activeSection === link.id ? activeNavLinkTextClass : ""
              }`}
              aria-current={activeSection === link.id ? "page" : undefined}
            >
              {link.text}
            </Link>
          ))}
          <div
            className="absolute bottom-[6px] h-[2.5px] bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={underlineStyle}
          />
        </div>
      </div>
    </nav>
  );
}
