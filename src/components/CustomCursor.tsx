"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  // Visibility on fine-pointer devices is handled purely by CSS
  // ([@media(pointer:fine)]), so no JS state is needed to enable the cursor.
  // DOM refs are updated directly in a rAF loop; React state is only used for
  // the hover state so mousemove never triggers a re-render.
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const target = { x: -100, y: -100 };
    const trailing = { x: -100, y: -100 };

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleElementHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      setIsHovered(
        !!el.closest("button, a, [role='button'], input, select, textarea, label")
      );
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", handleElementHover, { passive: true });

    // Smooth trailing physics loop
    let rafId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const loop = () => {
      trailing.x = lerp(trailing.x, target.x, 0.18);
      trailing.y = lerp(trailing.y, target.y, 0.18);
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${trailing.x}px, ${trailing.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Central crisp dot — hidden on touch devices via media query */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden [@media(pointer:fine)]:block rounded-full bg-primary-400"
        style={{ width: isHovered ? 6 : 4, height: isHovered ? 6 : 4 }}
      />
      {/* Fluid glowing aura */}
      <div
        ref={auraRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9998] hidden [@media(pointer:fine)]:block rounded-full border transition-all duration-300 ease-out ${
          isHovered
            ? "border-primary-400/40 bg-primary-400/10 shadow-[0_0_25px_rgba(0,188,212,0.25)]"
            : "border-primary-400/40"
        }`}
        style={{ width: isHovered ? 48 : 28, height: isHovered ? 48 : 28 }}
      />
    </>
  );
}
