import { useEffect, useRef, useState } from "react";
import { Camera, Download, Loader2, X, Images } from "lucide-react";
import { toast } from "sonner";
import {
  ACTIVE_EVENT,
  isEventVisible,
  photoPublicUrl,
  type EventConfig,
  type EventPhoto,
} from "@/data/event";

async function downloadFile(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar ${filename}`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

type LightboxState = {
  photo: EventPhoto;
  url: string;
} | null;

const EventPhotosSection = ({ event = ACTIVE_EVENT }: { event?: EventConfig }) => {
  const ref = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [busyFile, setBusyFile] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  if (!isEventVisible(event)) return null;

  const photos = event.photos;
  const hasPhotos = photos.length > 0;

  const handleDownloadOne = async (photo: EventPhoto) => {
    const url = photoPublicUrl(event, photo.file);
    setBusyFile(photo.file);
    try {
      await downloadFile(url, photo.file);
      toast.success(`Download: ${photo.file}`);
    } catch {
      toast.error("Não foi possível baixar esta foto. Tente novamente.");
    } finally {
      setBusyFile(null);
    }
  };

  const handleDownloadAll = async () => {
    if (!hasPhotos) return;
    setDownloadingAll(true);
    let ok = 0;
    try {
      for (const photo of photos) {
        try {
          await downloadFile(photoPublicUrl(event, photo.file), photo.file);
          ok += 1;
          // pequena pausa para o browser não bloquear múltiplos downloads
          await new Promise((r) => setTimeout(r, 350));
        } catch {
          /* continua nas demais */
        }
      }
      if (ok === photos.length) {
        toast.success(`${ok} foto(s) baixada(s).`);
      } else if (ok > 0) {
        toast.message(`Baixadas ${ok} de ${photos.length}. Algumas falharam.`);
      } else {
        toast.error("Nenhuma foto pôde ser baixada.");
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <>
      <section
        id="fotos-evento"
        ref={ref}
        className="section-fade-in py-20 md:py-28 scroll-mt-28"
      >
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wide mb-3">
                <Camera className="h-3.5 w-3.5" />
                Fotos do evento
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                Galeria — {event.shortTitle}
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Baixe as fotos oficiais direto daqui. Assim a loja não precisa enviar
                a foto de cada pessoa individualmente.
              </p>
            </div>

            {hasPhotos && (
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={downloadingAll}
                className="inline-flex items-center justify-center gap-2 self-center md:self-auto rounded-xl bg-primary text-primary-foreground px-5 py-3 font-semibold hover:brightness-110 transition-all disabled:opacity-60"
              >
                {downloadingAll ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Baixar todas ({photos.length})
              </button>
            )}
          </div>

          {!hasPhotos ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/80 p-10 md:p-14 text-center max-w-2xl mx-auto">
              <Images className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">Fotos em breve</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Assim que as fotos do evento forem publicadas pela equipe, elas
                aparecerão aqui com opção de download. Volte depois do evento ou
                acompanhe nossos stories no Instagram.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => {
                const url = photoPublicUrl(event, photo.file);
                return (
                  <div
                    key={photo.file}
                    className="group rounded-xl overflow-hidden border border-border shadow-sm bg-card hover-glow-primary"
                  >
                    <button
                      type="button"
                      onClick={() => setLightbox({ photo, url })}
                      className="block w-full text-left"
                    >
                      <img
                        src={url}
                        alt={photo.alt ?? photo.caption ?? photo.file}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </button>
                    <div className="flex items-center justify-between gap-2 p-3 border-t border-border">
                      <p className="text-xs text-muted-foreground truncate min-w-0">
                        {photo.caption ?? photo.file}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDownloadOne(photo)}
                        disabled={busyFile === photo.file}
                        className="inline-flex items-center gap-1 shrink-0 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-60"
                      >
                        {busyFile === photo.file ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        Baixar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-background p-2 rounded-full hover:bg-white/10"
            aria-label="Fechar"
          >
            <X size={28} />
          </button>
          <div
            className="max-w-5xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.url}
              alt={lightbox.photo.alt ?? lightbox.photo.caption ?? "Foto do evento"}
              className="max-w-full max-h-[78vh] rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => handleDownloadOne(lightbox.photo)}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-semibold hover:brightness-110"
            >
              <Download className="h-4 w-4" />
              Baixar esta foto
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventPhotosSection;
