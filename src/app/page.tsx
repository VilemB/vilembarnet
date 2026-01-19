"use client";

import { useRef } from "react";
import { useTextDistortion } from "@/hooks/useTextDistortion";

export default function Home() {
  const textContainerRef = useRef<HTMLDivElement>(null);

  useTextDistortion({
    text: "vilem barnet",
    font: "Italiana",
    fontSize: 400,
    fontWeight: "400",
    textColor: "#001F3D",
    backgroundColor: "#F3F0F0",
    gridSize: 80.0,
    intensity: 0.2,
    radius: 0.35,
    easeFactor: 0.02,
    containerRef: textContainerRef,
  });

  return (
    <main>
      <div ref={textContainerRef} id="textContainer"></div>
    </main>
  );
}
