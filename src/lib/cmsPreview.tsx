/**
 * CMS Preview Provider
 *
 * When running inside the admin editor iframe, page components
 * listen for postMessage with preview data and render it live.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface PreviewState {
  slug: string;
  data: Record<string, unknown>;
}

const PreviewContext = createContext<PreviewState | null>(null);

export function usePreview(slug: string) {
  const ctx = useContext(PreviewContext);
  if (ctx && ctx.slug === slug) return ctx.data;
  return null;
}

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<PreviewState | null>(null);

  useEffect(() => {
    // Check if we're inside an iframe
    if (window === window.top) return;

    // Listen for preview data from parent (admin editor)
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "cms-preview") {
        setPreview({ slug: e.data.slug, data: e.data.data });
      }
      if (e.data?.type === "cms-preview-clear") {
        setPreview(null);
      }
    };
    window.addEventListener("message", handler);

    // Signal parent that we're ready for preview data
    window.parent.postMessage({ type: "cms-preview-ready" }, "*");

    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <PreviewContext.Provider value={preview}>
      {children}
    </PreviewContext.Provider>
  );
}
