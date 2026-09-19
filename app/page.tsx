import About from "./components/About";
import SkillsShowcase from "./components/SkillsShowcase";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <About />
  <SkillsShowcase />
    </main>
  );
}