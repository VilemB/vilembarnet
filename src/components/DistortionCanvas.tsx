"use client";

import { useRef, useEffect, useState } from "react";
import { useTextDistortion } from "@/hooks/useTextDistortion";

export default function DistortionCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useTextDistortion({
    text: "barnet",
    font: "Italiana",
    fontSize: 1000,
    fontWeight: "400",
    textColor: "#001F3D",
    backgroundColor: "#F3F0F0",
    gridSize: 80.0,
    intensity: 0.2,
    radius: 0.2,
    easeFactor: 0.01,
    containerRef,
    containerWidth: dimensions.width,
    containerHeight: dimensions.height,
  });

  return <div ref={containerRef} id="textContainer" />;
}
