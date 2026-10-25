"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scrollControl";

export default function SmoothScroll() {
  useEffect(() => {
    // Only initialize on desktop / capable pointer devices
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
      // Let Lenis own anchor scrolling so hash links and CSS scroll-behavior
      // don't fight the transform-based scroller.
      anchors: { offset: -64 },
    });

    registerLenis(lenis);

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      registerLenis(null);
    };
  }, []);

  return null;
}
