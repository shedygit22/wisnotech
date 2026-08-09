import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Showreel from "./components/Showreel";
import AiGallery from "./components/AiGallery";
import About from "./components/About";
import Solutions from "./components/Solutions";
import Academy from "./components/Academy";
import LlmStudio from "./components/LlmStudio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AiAssistant from "./components/AiAssistant";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Showreel />
        <AiGallery />
        <About />
        <Solutions />
        <Academy />
        <LlmStudio />
        <Contact />
      </main>
      <Footer />
      <AiAssistant />
    </div>
  );
}