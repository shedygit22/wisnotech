import { useState } from "react";
import type { ReactNode } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fallback: ReactNode;
}

/**
 * Renders an image and swaps to a tasteful fallback if the asset is
 * missing or fails to load, so the site never breaks.
 */
export default function ImageWithFallback({
  src,
  alt,
  className = "",
  loading = "lazy",
  fallback,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={className} role="img" aria-label={alt}>
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}