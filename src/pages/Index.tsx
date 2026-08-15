import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/SeoHead";
import EventAnnouncementBanner from "@/components/EventAnnouncementBanner";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import EventSection from "@/components/EventSection";
import PromoSection from "@/components/PromoSection";
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
 * Fotos da Laura entram na galeria geral (#galeria) — sem seção separada de download.
 */
const Index = () => {
  return (
    <div className="min-h-screen">
      <SeoHead
        title="GeekPop & Toys | Loja de K-pop no Rio de Janeiro | Photocards & Colecionáveis"
        description="Loja de K-pop no Rio de Janeiro. Photocards, merch de grupos, colecionáveis e cultura pop em Copacabana. Envio pelos Correios para todo o Brasil."
        path="/"
      />
      <EventAnnouncementBanner />
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <EventSection />
        <PromoSection />
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
