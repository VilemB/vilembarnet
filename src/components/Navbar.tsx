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
  const navLinksContainerRef = useRef<HTMLDivElement>(null);
  const [isShrunkByScroll, setIsShrunkByScroll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigationLinks = [
    { id: "about", text: "About" },
    { id: "work", text: "Work" },
    { id: "skills", text: "Skills" },
    { id: "contact", text: "Contact" },
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
    // If clicking a link, ensure navbar is fully expanded
    setIsShrunkByScroll(false);
    setIsHovered(true); // Assume hover since click happened within

    // Ensure content is visible before scrolling
    if (navLinksContainerRef.current) {
      navLinksContainerRef.current.style.pointerEvents = "auto";
      animate(
        {
          targets: navLinksContainerRef.current,
          opacity: 1,
          duration: 250,
          easing: "easeOutQuad",
        },
        {}
      );
    }

    if (sectionId === "about") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    const sectionIds = navigationLinks.map((link) => link.id);

    const handleScrollAndResize = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsShrunkByScroll(true);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 40) {
        setIsShrunkByScroll(false);
      }
      setLastScrollY(currentScrollY);

      const trulyShrunk = isShrunkByScroll && !isHovered;

      let currentSectionId = sectionIds[0] || "";
      const scrollThreshold = window.innerHeight * 0.4;
      const scrollPosition = currentScrollY + scrollThreshold;
      const atBottom =
        window.innerHeight + currentScrollY >=
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

      // Only calculate underline if not truly shrunk and container exists
      if (navLinksContainerRef.current && !trulyShrunk) {
        const activeLinkElement = navLinksContainerRef.current.querySelector(
          `a[href="#${currentSectionId}"]`
        ) as HTMLElement;
        if (activeLinkElement) {
          setUnderlineStyle({
            width: activeLinkElement.offsetWidth - 16,
            transform: `translateX(${activeLinkElement.offsetLeft + 8}px)`,
            opacity: 1, // Ensure underline is visible when not shrunk
          });
        }
      } else if (trulyShrunk) {
        setUnderlineStyle({
          width: 0,
          opacity: 0,
          transform: "translateX(0px)",
        });
      }
    };

    const throttledScrollHandler = throttle(handleScrollAndResize, 50);
    window.addEventListener("scroll", throttledScrollHandler);
    window.addEventListener("resize", throttledScrollHandler);
    handleScrollAndResize();

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      window.removeEventListener("resize", throttledScrollHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScrollY, isShrunkByScroll, isHovered]);

  const baseLinkClasses =
    "px-3 py-2 text-sm transition-colors duration-200 ease-out rounded-md";
  const activeNavLinkTextClass = "!text-blue-600 font-medium";

  const trulyShrunkFinal = isShrunkByScroll && !isHovered;

  return (
    <nav
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 
                 bg-white/90 backdrop-blur-md 
                 rounded-full shadow-xl border border-gray-200/75
                 transition-all duration-300 ease-in-out
                 ${trulyShrunkFinal ? "w-48 h-2" : "w-auto h-14"}
                 max-w-[95vw] sm:max-w-none`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center justify-center h-full 
                      transition-all duration-300 ease-in-out
                      ${
                        trulyShrunkFinal
                          ? "px-1 overflow-hidden"
                          : "px-2 sm:px-4 md:px-6"
                      }`}
      >
        <div
          ref={navLinksContainerRef}
          className={`flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 relative transition-opacity duration-200 ease-in-out ${
            trulyShrunkFinal ? "opacity-0" : "opacity-100"
          }`}
        >
          {!trulyShrunkFinal &&
            navigationLinks.map((link) => (
              <Link
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`${baseLinkClasses} text-slate-700 hover:text-blue-600 text-xs sm:text-sm ${
                  activeSection === link.id ? activeNavLinkTextClass : ""
                }`}
                aria-current={activeSection === link.id ? "page" : undefined}
                tabIndex={trulyShrunkFinal ? -1 : 0}
              >
                {link.text}
              </Link>
            ))}
          {!trulyShrunkFinal && (
            <div
              className={`absolute bottom-[6px] h-[2.5px] bg-blue-600 rounded-full 
                         transition-transform duration-300 ease-out`}
              style={underlineStyle}
            />
          )}
        </div>
        {trulyShrunkFinal && (
          <div className="absolute top-0 left-0 w-full h-full bg-slate-300/60 rounded-full opacity-100 transition-opacity duration-300 ease-in-out"></div>
        )}
      </div>
    </nav>
  );
}
