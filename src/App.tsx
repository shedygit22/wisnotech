import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import About from "./components/About";
import Problems from "./components/Problems";
import Services from "./components/Services";
import FeaturedWork from "./components/FeaturedWork";
import LatestPosts from "./components/LatestPosts";
import Why from "./components/Why";
import WhoWeWorkWith from "./components/WhoWeWorkWith";
import AiAutomation from "./components/AiAutomation";
import Process from "./components/Process";
import Wino from "./components/Wino";
import Academy from "./components/Academy";
import LlmStudio from "./components/LlmStudio";
import FAQ from "./components/FAQ";
import FinalCta from "./components/FinalCta";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AiAssistant from "./components/AiAssistant";
import { PageFallback } from "./components/PageFallback";
import { Analytics } from "@vercel/analytics/react";
import { ErrorBoundary } from "./components/ErrorBoundary";

const AcademyPage = lazy(() => import("./components/AcademyPage"));
const CoursePage = lazy(() => import("./components/CoursePage"));
const BlogPage = lazy(() => import("./components/BlogPage"));
const BlogPostPage = lazy(() => import("./components/BlogPostPage"));
const WinoPage = lazy(() => import("./components/WinoPage"));
const PortfolioPage = lazy(() => import("./components/PortfolioPage"));
const LegalPage = lazy(() => import("./components/LegalPage"));
const NotFound = lazy(() => import("./components/NotFound"));
const TrainingPage = lazy(() => import("./components/TrainingPage"));
const FaePage = lazy(() => import("./components/FaePage"));

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

function usePathRoute(): string {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPath);
    return () => window.removeEventListener("popstate", onPath);
  }, []);
  return path;
}

export default function App() {
  const hash = useHashRoute();
  const path = usePathRoute();

  /* SEO-friendly real URLs for the blog. */
  if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length).split("/")[0];
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <BlogPostPage slug={slug} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (path === "/blog") {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <BlogPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (path === "/privacy") {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <LegalPage kind="privacy" />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (path === "/terms") {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <LegalPage kind="terms" />
        </Suspense>
      </ErrorBoundary>
    );
  }

  /* WINO — dedicated AI video product page. */
  if (path === "/wino") {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <WinoPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  /* Client-converting AI video studio portfolio. */
  if (path === "/portfolio") {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <PortfolioPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  /* Academy & course pages — support both real paths (/academy, /courses/:slug)
     and legacy hash routes (#/academy, #/courses/:slug) for backwards compat. */
  const courseSlugFromPath = path.startsWith("/courses/") ? path.slice("/courses/".length).split("/")[0] : "";
  const courseSlugFromHash = hash.startsWith("#/courses/") ? hash.slice("#/courses/".length).split("/")[0] : "";
  const courseSlug = courseSlugFromPath || courseSlugFromHash;
  if (courseSlug) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <CoursePage slug={courseSlug} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (path === "/academy" || path.startsWith("/academy/") || hash.startsWith("#/academy")) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <AcademyPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (path === "/training" || path.startsWith("/training/")) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <TrainingPage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (path === "/fae" || path === "/fae/" || path.startsWith("/fae/")) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <FaePage />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // 404 — unknown path (keep homepage for "/" and hash navigations)
  const knownPaths = ["/", "/wino", "/portfolio", "/blog", "/privacy", "/terms", "/academy", "/training", "/fae"];
  const isKnownPath =
    knownPaths.includes(path) ||
    knownPaths.some((p) => p !== "/" && path.startsWith(`${p}/`)) ||
    path.startsWith("/blog/") ||
    path.startsWith("/courses/");
  if (path !== "/" && !isKnownPath) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <NotFound />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <ErrorBoundary>
        <Navbar />
        <main>
          <Hero />
          <TrustStrip />
          <About />
          <Problems />
          <Services />
          <FeaturedWork />
          <LatestPosts />
          <Why />
          <WhoWeWorkWith />
          <AiAutomation />
          <Process />
          <Wino />
          <Academy />
          <LlmStudio />
          <FAQ />
          <FinalCta />
          <Contact />
        </main>
        <Footer />
      </ErrorBoundary>
      <AiAssistant />
      <Analytics />
    </div>
  );
}
