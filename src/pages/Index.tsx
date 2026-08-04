import Navbar from "@/components/Navbar";
import EventAnnouncementBanner from "@/components/EventAnnouncementBanner";
import HeroSection from "@/components/HeroSection";
import EventSection from "@/components/EventSection";
import EventPhotosSection from "@/components/EventPhotosSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import ProductsSection from "@/components/ProductsSection";
import RadioSection from "@/components/RadioSection";
import SocialSection from "@/components/SocialSection";
import LocationSection from "@/components/LocationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <EventAnnouncementBanner />
      <Navbar />
      <main>
        <HeroSection />
        <EventSection />
        <EventPhotosSection />
        <AboutSection />
        <GallerySection />
        <ProductsSection />
        <RadioSection />
        <SocialSection />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
