import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrackingForm from "@/components/TrackingForm";
import WhyChooseUs from "@/components/WhyChooseUs";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Statistics from "@/components/Statistics";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">

      <Navbar />

      <Hero />

      <WhyChooseUs />

      <HowItWorks />

      <Statistics />

      <FAQ />

      <Footer />

    </main>
  );
}