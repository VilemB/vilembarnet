"use client";

import { useRef, useState, useEffect } from "react";
import { useTextDistortion } from "@/hooks/useTextDistortion";

export default function DistortionCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(120);

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setFontSize(80);   // Mobile
      } else if (width < 1024) {
        setFontSize(100);  // Tablet
      } else {
        setFontSize(120);  // Desktop
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  useTextDistortion({
    text: "barnet",
    font: "Italiana",
    fontSize: fontSize,
    fontWeight: "400",
    textColor: "#001F3D",
    backgroundColor: "#F3F0F0",
    gridSize: 80.0,
    intensity: 0.2,
    radius: 0.2,
    easeFactor: 0.01,
    containerRef,
  });

  return <div ref={containerRef} id="textContainer" />;
}
