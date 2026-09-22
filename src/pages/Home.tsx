import Nav from "@/sections/Nav";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Members from "@/sections/Members";
import Works from "@/sections/Works";
import Footer from "@/sections/Footer";
import { useSectionSnap } from "@/hooks/useSectionSnap";

export default function Home() {
  useSectionSnap();
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <About />
        <Members />
        <Works />
      </main>
      <Footer />
    </div>
  );
}
