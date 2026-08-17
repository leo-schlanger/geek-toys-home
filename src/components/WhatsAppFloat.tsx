import { MessageCircle } from "lucide-react";
import { primaryWhatsAppUrl, PRIMARY_WHATSAPP } from "@/data/contacts";

/**
 * Floating WhatsApp button for the store's main line.
 *
 * `data-floating-whatsapp` is the hook for the `index.css` rule that hides it
 * while the mobile menu is open: being `fixed`, it sat over the panel's last
 * items.
 */
const WhatsAppFloat = () => (
  <a
    data-floating-whatsapp
    href={primaryWhatsAppUrl("Olá! Vim pelo site geeketoys.com.br 👋")}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-105 hover:brightness-110 transition-all md:bottom-6 md:right-6"
    aria-label={`WhatsApp ${PRIMARY_WHATSAPP.display}`}
    title={`WhatsApp ${PRIMARY_WHATSAPP.display}`}
  >
    <MessageCircle className="h-7 w-7" fill="currentColor" />
  </a>
);

export default WhatsAppFloat;
