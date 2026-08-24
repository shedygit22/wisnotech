import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function InteractiveCursor() {
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 28, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 400, damping: 28, mass: 0.3 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-cursor='hover']"));
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) setHidden(true);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [x, y]);

  if (hidden) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference lg:block"
        style={{ x: springX, y: springY }}
        animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 0.9 : 0.7 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 mix-blend-difference lg:block"
        style={{ x, y }}
        animate={{ scale: hovering ? 1.6 : 1, opacity: hovering ? 0.6 : 0.25 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      />
    </>
  );
}
