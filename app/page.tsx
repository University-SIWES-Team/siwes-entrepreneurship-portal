import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import SkillsShowcase from "./components/SkillsShowcase";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white">
        <Hero />
        <About />
        <SkillsShowcase />
        <HowItWorks />
      </main>
    </>
  );
}