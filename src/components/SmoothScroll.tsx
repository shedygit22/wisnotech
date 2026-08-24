import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // View Transitions for anchor navigations where supported
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#'], a[href^='/']") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#") || href.startsWith("/#")) {
        e.preventDefault();
        const id = href.includes("#") ? href.slice(href.indexOf("#")) : href;
        const el = document.querySelector(id);
        if (el) {
          // @ts-ignore View Transitions API
          if (document.startViewTransition) {
            // @ts-ignore
            document.startViewTransition(() => {
              lenis.scrollTo(el as HTMLElement, { offset: -64 });
            });
          } else {
            lenis.scrollTo(el as HTMLElement, { offset: -64 });
          }
        }
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
