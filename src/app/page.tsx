import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhySection } from "@/components/sections/WhySection";
import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import { CollectionSection } from "@/components/sections/CollectionSection";

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <WhySection />
      <ShowcaseSection />
      <CollectionSection />
      <Footer />
    </main>
  );
}
