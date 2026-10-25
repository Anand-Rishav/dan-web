import type Lenis from "lenis";

// Module-level handle to the Lenis instance created by <SmoothScroll />.
// Lets overlays (modals) pause the smooth scroller and lets nav links
// smooth-scroll to sections regardless of which page they render on.
let lenisInstance: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function stopScroll() {
  lenisInstance?.stop();
}

export function startScroll() {
  lenisInstance?.start();
}

export function scrollToSection(hash: string) {
  if (typeof document === "undefined") return;
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { offset: -64 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}
