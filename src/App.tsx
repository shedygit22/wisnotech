import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Services from "./components/Services";
import Showreel from "./components/Showreel";
import AiGallery from "./components/AiGallery";
import Testimonials from "./components/Testimonials";
import Process from "./components/Process";
import About from "./components/About";
import Solutions from "./components/Solutions";
import Academy from "./components/Academy";
import LlmStudio from "./components/LlmStudio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AiAssistant from "./components/AiAssistant";
import AcademyPage from "./components/AcademyPage";

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();

  /* Lightweight hash routing — "#/academy" opens the dedicated courses page. */
  if (hash.startsWith("#/academy")) {
    return <AcademyPage />;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Services />
        <Showreel />
        <AiGallery />
        <Testimonials />
        <About />
        <Solutions />
        <Process />
        <Academy />
        <LlmStudio />
        <Contact />
      </main>
      <Footer />
      <AiAssistant />
    </div>
  );
}