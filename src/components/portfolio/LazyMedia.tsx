import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

/**
 * IntersectionObserver-driven image. `src` is only set when the element is
 * near the viewport, so off-screen posters cost zero network. Shows a shimmer
 * skeleton until the image has loaded, then fades it in.
 */
export function LazyPoster({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={boxRef} className="relative block h-full w-full overflow-hidden">
      {!loaded && (
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
            backgroundSize: "200% 100%",
            animation: "portfolio-shimmer 1.8s linear infinite",
          }}
        />
      )}
      {inView && !failed && (
        <img
          src={src}
          alt={alt}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-700",
            loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
            className
          )}
        />
      )}
    </span>
  );
}