import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { HeroSection } from "./components/HeroSection";
import { WhyStandupSection } from "./components/WhyStandup";
import { Footer } from "./components/Footer";

export default async function Home() {
  const session = await auth();

  // If logged in, don't show the landing page
  if (session?.user) {
    redirect("/dashboard");
  }

  // If logged out, show the landing page
  return (
    <div className="mb-5 space-y-16 sm:space-y-20 lg:space-y-[120px]">
      <HeroSection />
      <WhyStandupSection />
      <Footer />
    </div>
  );
}