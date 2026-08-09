import Image from "next/image";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { WhyStandupSection } from "./components/WhyStandup";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className=" mb-5">
    <HeroSection/>
    <WhyStandupSection/>
    <Footer/>
    </div>
  );
}
