"use client";

import React, { useEffect, useRef, useState } from "react";
import { Timeline } from "animejs";
import ThreeDLoadingAnimation from "./ThreeDLoadingAnimation";

interface LoadingScreenProps {
  isLoading: boolean; // Controls whether to show entry or exit animation
  onExitComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  onExitComplete,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hasAnimatedEntry, setHasAnimatedEntry] = useState(false);
  const [initiate3DExit, setInitiate3DExit] = useState(false); // New state for 3D exit

  useEffect(() => {
    if (isLoading && !hasAnimatedEntry) {
      // Entry Animation
      const entryTl = new Timeline({
        defaults: {},
      });

      entryTl.add(overlayRef.current!, {
        opacity: [0, 1],
        duration: 500,
        easing: "easeOutExpo",
      });
      setHasAnimatedEntry(true);
      setInitiate3DExit(false); // Ensure 3D exit is reset on new entry
    } else if (!isLoading && hasAnimatedEntry) {
      // Exit Animation
      setInitiate3DExit(true); // Trigger 3D exit animation

      const exitTl = new Timeline({
        defaults: {},
      });

      exitTl.add(overlayRef.current!, {
        opacity: 0,
        duration: 400,
        complete: onExitComplete,
        easing: "easeInExpo",
      });
    }
  }, [isLoading, hasAnimatedEntry, onExitComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[9999]"
      style={{ opacity: 0 }} // Initial state: hidden, anime.js will manage opacity
    >
      <ThreeDLoadingAnimation isExiting={initiate3DExit} />
    </div>
  );
};

export default LoadingScreen;
