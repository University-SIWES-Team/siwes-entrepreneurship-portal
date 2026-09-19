import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";
import SkillsShowcase from "./components/SkillsShowcase";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">
        <HowItWorks />
        <SkillsShowcase />
      </main>
    </>
  );
}