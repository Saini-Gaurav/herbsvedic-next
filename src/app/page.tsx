import Hero from "./_components/Hero";
import BenefitsStrip from "./_components/BenefitsStrip";
import FeaturedProducts from "./_components/FeaturedProducts";
import Testimonials from "./_components/Testimonials";
import FAQSection from "./_components/FAQSection";
import ConsultCTA from "./_components/ConsultCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <BenefitsStrip />
      <FeaturedProducts />
      <Testimonials />
      <FAQSection />
      <ConsultCTA />
    </>
  );
}