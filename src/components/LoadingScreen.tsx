"use client";

import React, { useEffect, useRef, useState } from "react";
import { Timeline, stagger, animate } from "animejs";

interface LoadingScreenProps {
  isLoading: boolean; // Controls whether to show entry or exit animation
  onExitComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  onExitComplete,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textVRef = useRef<HTMLSpanElement>(null);
  const textBRef = useRef<HTMLSpanElement>(null);
  const [hasAnimatedEntry, setHasAnimatedEntry] = useState(false);

  useEffect(() => {
    if (isLoading && !hasAnimatedEntry) {
      // Entry Animation
      const entryTl = new Timeline({
        defaults: {},
      });

      entryTl
        .add(overlayRef.current!, {
          opacity: [0, 1],
          duration: 500,
          easing: "easeOutExpo",
        })
        .add(
          [textVRef.current!, textBRef.current!],
          {
            opacity: [0, 1],
            translateY: ["20px", "0px"],
            scale: [0.8, 1],
            delay: stagger(150),
            duration: 600,
            easing: "easeOutExpo",
          },
          "-=200"
        );
      setHasAnimatedEntry(true);
    } else if (!isLoading && hasAnimatedEntry) {
      // Exit Animation
      const exitTl = new Timeline({
        defaults: {},
      });

      exitTl
        .add([textVRef.current!, textBRef.current!], {
          opacity: 0,
          translateY: "-20px",
          scale: 0.8,
          delay: stagger(100, { from: "first" }),
          duration: 400,
          easing: "easeInExpo",
        })
        .add(
          overlayRef.current!,
          {
            opacity: 0,
            duration: 400,
            complete: onExitComplete,
            easing: "easeInExpo",
          },
          "-=300"
        );
    }
  }, [isLoading, hasAnimatedEntry, onExitComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[9999]" // Ensure highest z-index
      style={{ opacity: 0 }} // Initial state: hidden, anime.js will manage opacity
    >
      <div className="text-white text-7xl md:text-9xl font-bold tracking-wider flex">
        {/* Using display: 'inline-block' for individual letter animations if needed */}
        <span ref={textVRef} style={{ opacity: 0, display: "inline-block" }}>
          V
        </span>
        <span
          ref={textBRef}
          style={{ opacity: 0, display: "inline-block", marginLeft: "0.1em" }}
        >
          B
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
