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

const AcademyPage = lazy(() => import("./components/AcademyPage"));
const CoursePage = lazy(() => import("./components/CoursePage"));
const BlogPage = lazy(() => import("./components/BlogPage"));
const BlogPostPage = lazy(() => import("./components/BlogPostPage"));
const WinoPage = lazy(() => import("./components/WinoPage"));
const PortfolioPage = lazy(() => import("./components/PortfolioPage"));
const LegalPage = lazy(() => import("./components/LegalPage"));

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
      <Suspense fallback={<PageFallback />}>
        <BlogPostPage slug={slug} />
      </Suspense>
    );
  }

  if (path === "/blog") {
    return (
      <Suspense fallback={<PageFallback />}>
        <BlogPage />
      </Suspense>
    );
  }

  if (path === "/privacy") {
    return (
      <Suspense fallback={<PageFallback />}>
        <LegalPage kind="privacy" />
      </Suspense>
    );
  }

  if (path === "/terms") {
    return (
      <Suspense fallback={<PageFallback />}>
        <LegalPage kind="terms" />
      </Suspense>
    );
  }

  /* WINO — dedicated AI video product page. */
  if (path === "/wino") {
    return (
      <Suspense fallback={<PageFallback />}>
        <WinoPage />
      </Suspense>
    );
  }

  /* Client-converting AI video studio portfolio. */
  if (path === "/portfolio") {
    return (
      <Suspense fallback={<PageFallback />}>
        <PortfolioPage />
      </Suspense>
    );
  }

  /* Lightweight hash routing — "#/academy" opens the dedicated courses page. */
  if (hash.startsWith("#/courses/")) {
    const slug = hash.slice("#/courses/".length).split("/")[0];
    return (
      <Suspense fallback={<PageFallback />}>
        <CoursePage slug={slug} />
      </Suspense>
    );
  }

  if (hash.startsWith("#/academy")) {
    return (
      <Suspense fallback={<PageFallback />}>
        <AcademyPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
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
      <AiAssistant />
    </div>
  );
}