"use client";

import React, { useEffect, useRef } from "react";

interface LazyCursorProps {
  isHovering: boolean;
}

const LazyCursor: React.FC<LazyCursorProps> = ({ isHovering }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const delayedMousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  const lerp = (start: number, end: number, amount: number): number => {
    return (1 - amount) * start + amount * end;
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animateCursor = () => {
      if (cursorRef.current) {
        delayedMousePosition.current.x = lerp(
          delayedMousePosition.current.x,
          mousePosition.current.x,
          0.125 // Adjusted for less laziness (was 0.075)
        );
        delayedMousePosition.current.y = lerp(
          delayedMousePosition.current.y,
          mousePosition.current.y,
          0.125 // Adjusted for less laziness (was 0.075)
        );

        cursorRef.current.style.transform = `translate3d(${
          delayedMousePosition.current.x - (isHovering ? 20 : 10)
        }px, ${delayedMousePosition.current.y - (isHovering ? 20 : 10)}px, 0)`;
      }
      animationFrameId.current = requestAnimationFrame(animateCursor);
    };

    animationFrameId.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isHovering]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isHovering ? "40px" : "20px",
        height: isHovering ? "40px" : "20px",
        backgroundColor: isHovering
          ? "rgba(135, 206, 250, 0.7)"
          : "rgba(173, 216, 230, 0.5)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        transform: `translate3d(${
          delayedMousePosition.current.x - (isHovering ? 20 : 10)
        }px, ${delayedMousePosition.current.y - (isHovering ? 20 : 10)}px, 0)`,
        transition:
          "width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out, transform 0.05s linear",
      }}
    />
  );
};

export default LazyCursor;
