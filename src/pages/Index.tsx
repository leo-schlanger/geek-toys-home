import Navbar from "@/components/Navbar";
import EventAnnouncementBanner from "@/components/EventAnnouncementBanner";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import EventSection from "@/components/EventSection";
import PromoSection from "@/components/PromoSection";
import EventPhotosSection from "@/components/EventPhotosSection";
import ChannelsSection from "@/components/ChannelsSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import RadioSection from "@/components/RadioSection";
import SocialSection from "@/components/SocialSection";
import LocationSection from "@/components/LocationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

/**
 * Ordem (pedido Laura 06/08/2026):
 * produtos + evento em foco no topo; quem somos / galeria / rádio / etc. mais abaixo.
 */
const Index = () => {
  return (
    <div className="min-h-screen">
      <EventAnnouncementBanner />
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <EventSection />
        <PromoSection />
        <EventPhotosSection />
        <ChannelsSection />
        <AboutSection />
        <GallerySection />
        <RadioSection />
        <SocialSection />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
