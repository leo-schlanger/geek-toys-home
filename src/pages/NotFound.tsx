import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { NONO_COOL, NONO_LINES } from "@/lib/nono";
import { NonoSpeech } from "@/components/NonoSpeech";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-6 py-12">
      <SeoHead
        title="Página não encontrada | GeekPop & Toys"
        description="Esta página não existe. Volte para a home da GeekPop & Toys."
        path={location.pathname}
        noIndex
      />
      <div className="text-center max-w-md">
        <NonoSpeech tail="bottom" className="mx-auto mb-5 max-w-[16rem]">
          {NONO_LINES.notFound}
        </NonoSpeech>
        <img
          src={NONO_COOL.src}
          srcSet={NONO_COOL.srcSet}
          sizes="200px"
          width={NONO_COOL.width}
          height={NONO_COOL.height}
          alt={NONO_COOL.alt}
          className="mx-auto mb-6 w-48 h-auto drop-shadow-xl nono-bob"
        />
        <h1 className="font-heading mb-2 text-5xl font-bold text-primary">404</h1>
        <p className="mb-2 text-xl font-semibold text-foreground">Página não encontrada</p>
        <p className="mb-8 text-muted-foreground">
          Nem o Nono, de óculos escuros, achou esta página. Que tal voltar para o início?
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/25"
        >
          <Home size={18} aria-hidden="true" />
          Voltar para o início
        </a>
      </div>
    </main>
  );
};

export default NotFound;
