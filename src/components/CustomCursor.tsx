"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor for fine pointers (mouse/trackpad, not touch)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    // Track clickable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isClickable =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("select") ||
        target.tagName === "BUTTON" ||
        target.tagName === "A";

      setIsHovered(!!isClickable);
    };

    window.addEventListener("mouseover", handleElementHover);

    // Smooth trailing physics loop
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const loop = () => {
      setPosition((pos) => {
        currentX = lerp(currentX, pos.x, 0.18);
        currentY = lerp(currentY, pos.y, 0.18);
        setTrailingPos({ x: currentX, y: currentY });
        return pos;
      });
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseover", handleElementHover);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Central crisp dot */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400 transition-opacity duration-200"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          width: isHovered ? "6px" : "4px",
          height: isHovered ? "6px" : "4px",
        }}
      />
      {/* Fluid glowing aura */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-400/40 transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%)`,
          width: isHovered ? "48px" : "28px",
          height: isHovered ? "48px" : "28px",
          backgroundColor: isHovered ? "rgba(0, 188, 212, 0.1)" : "transparent",
          boxShadow: isHovered ? "0 0 25px rgba(0, 188, 212, 0.25)" : "none",
        }}
      />
    </>
  );
}
