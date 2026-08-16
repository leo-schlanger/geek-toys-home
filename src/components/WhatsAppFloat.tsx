import { MessageCircle } from "lucide-react";
import { primaryWhatsAppUrl, PRIMARY_WHATSAPP } from "@/data/contacts";

/**
 * Botão flutuante WhatsApp — número principal da loja (atendentes).
 *
 * O `data-floating-whatsapp` é o gancho da regra em `index.css` que o esconde
 * enquanto o menu mobile está aberto: sendo `fixed`, ele ficava por cima dos
 * últimos itens do painel.
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
