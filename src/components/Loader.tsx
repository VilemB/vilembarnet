"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const middleBarRef = useRef<SVGRectElement>(null);
  const vPathRef = useRef<SVGPathElement>(null);
  const bTopRef = useRef<SVGPathElement>(null);
  const bBottomRef = useRef<SVGPathElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const loader = loaderRef.current;
    const logo = logoRef.current;
    const middleBar = middleBarRef.current;
    const vPath = vPathRef.current;
    const bTop = bTopRef.current;
    const bBottom = bBottomRef.current;

    if (!loader || !logo || !middleBar || !vPath || !bTop || !bBottom) return;

    // Set initial states
    gsap.set([middleBar, vPath, bTop, bBottom], {
      opacity: 0,
      scale: 0.8,
      transformOrigin: "center center"
    });

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setIsComplete(true);
      },
    });

    tl.to(loader, {
      width: "100%",
      duration: 0.7,
      ease: "power2.inOut"
    });

    tl.to([middleBar, vPath, bTop, bBottom], {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.08
    }, "-=0.1");

    tl.to({}, { duration: 0.6 });

    tl.to(logo, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: "power2.inOut",
    });

    tl.to(loader, {
      x: "100%",
      duration: 0.7,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (isComplete) return null;

  return (
    <div
      ref={loaderRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 0,
        height: "100svh",
        backgroundColor: "var(--color-dark)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        ref={logoRef}
        width="80"
        height="80"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          ref={middleBarRef}
          x="89"
          width="50"
          height="200"
          fill="white"
        />
        <path
          ref={vPathRef}
          d="M0 0H50L79 131V200H48L0 0Z"
          fill="white"
        />
        <path
          ref={bTopRef}
          d="M150 0H168C185.673 0 200 14.3269 200 32V75C200 86.0457 191.046 95 180 95H150V0Z"
          fill="white"
        />
        <path
          ref={bBottomRef}
          d="M150 106H180C191.046 106 200 114.954 200 126V168C200 185.673 185.673 200 168 200H150V106Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
