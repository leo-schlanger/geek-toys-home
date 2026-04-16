import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Play, Pause, Radio, Volume2, VolumeX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useNowPlaying } from "@/hooks/useNowPlaying";

// Backoff pra reconexão após drop do stream
const RECONNECT_BACKOFF_MS = [1000, 2000, 4000, 8000];

const RadioSection = () => {
  const { song, listeners, streamUrl, loading } = useNowPlaying();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlayingRef = useRef(false);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const userActionRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const clearReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const attemptReconnect = useCallback(() => {
    if (!audioRef.current || !isPlayingRef.current) return;
    const attempt = reconnectAttemptsRef.current;
    if (attempt >= RECONNECT_BACKOFF_MS.length) {
      setIsBuffering(false);
      setIsPlaying(false);
      reconnectAttemptsRef.current = 0;
      return;
    }
    reconnectAttemptsRef.current = attempt + 1;
    setIsBuffering(true);
    clearReconnect();
    reconnectTimeoutRef.current = setTimeout(async () => {
      reconnectTimeoutRef.current = null;
      if (!audioRef.current || !isPlayingRef.current) return;
      try {
        audioRef.current.src = streamUrl;
        audioRef.current.load();
        await audioRef.current.play();
      } catch {
        attemptReconnect();
      }
    }, RECONNECT_BACKOFF_MS[attempt]);
  }, [streamUrl]);

  // Listeners do <audio> pra reconexão e sincronização de estado
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      reconnectAttemptsRef.current = 0;
      clearReconnect();
      setIsBuffering(false);
    };
    const onWaiting = () => {
      if (isPlayingRef.current) setIsBuffering(true);
    };
    const onError = () => {
      if (isPlayingRef.current) attemptReconnect();
    };
    const onStalled = () => {
      if (isPlayingRef.current) attemptReconnect();
    };
    const onEnded = () => {
      // Live stream não deveria "terminar"; tratar como drop
      if (isPlayingRef.current) attemptReconnect();
    };
    const onPause = () => {
      if (userActionRef.current) {
        userActionRef.current = false;
        return;
      }
      // Pause externo (SO, call recebida) — sincroniza estado
      if (isPlayingRef.current) {
        setIsPlaying(false);
        setIsBuffering(false);
        clearReconnect();
        reconnectAttemptsRef.current = 0;
      }
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("stalled", onStalled);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("stalled", onStalled);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
    };
  }, [attemptReconnect]);

  useEffect(() => () => clearReconnect(), []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userActionRef.current = true;
      audio.pause();
      setIsPlaying(false);
      setIsBuffering(false);
      clearReconnect();
      reconnectAttemptsRef.current = 0;
      return;
    }

    try {
      if (!audio.currentSrc || audio.error) {
        audio.src = streamUrl;
        audio.load();
      }
      await audio.play();
      setIsPlaying(true);
      reconnectAttemptsRef.current = 0;
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <section
      id="radio"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Radio className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Rádio Geek &amp; Toys
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-3">
            Sintonize a <span className="text-primary">vibe geek</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Top 100 K-pop em rotação — dos clássicos aos hits de 2026. Dê play e deixe tocando enquanto navega.
          </p>
        </div>

        {/* Player card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative glass rounded-3xl border border-border overflow-hidden shadow-2xl">
            {/* Art background blur */}
            {song?.art && (
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src={song.art}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover scale-150 blur-3xl opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background/90" />
              </div>
            )}

            <audio
              ref={audioRef}
              src={streamUrl}
              preload="none"
              aria-label="Stream da Rádio Geek & Toys"
            />

            <div className="relative z-10 p-6 md:p-8">
              {/* Top bar — status + ouvintes */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/30">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow shadow-green-400/60" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wide">
                    Ao Vivo
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{listeners}</span>
                </div>
              </div>

              {/* Art + play */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div
                    className={`w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-2 border-border shadow-2xl shadow-black/40 transition-transform duration-300 ${
                      isPlaying ? "scale-100" : "scale-95"
                    }`}
                  >
                    {song?.art ? (
                      <img
                        src={song.art}
                        alt={`${song.title} — ${song.artist}`}
                        className="w-full h-full object-cover"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                        <Music className="w-14 h-14 text-primary/80" />
                      </div>
                    )}

                    {/* Play/pause overlay */}
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pausar" : "Tocar"}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group"
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
                          isPlaying
                            ? "bg-white/0 group-hover:bg-primary text-transparent group-hover:text-primary-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" fill="currentColor" />
                        ) : (
                          <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                  {loading ? (
                    <>
                      <div className="h-5 bg-muted/50 rounded w-3/4 animate-pulse mb-2 mx-auto sm:mx-0" />
                      <div className="h-4 bg-muted/30 rounded w-1/2 animate-pulse mx-auto sm:mx-0" />
                    </>
                  ) : isBuffering && isPlaying ? (
                    <>
                      <p className="font-heading font-bold text-lg truncate">
                        Rádio Geek &amp; Toys
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Conectando…</p>
                    </>
                  ) : song ? (
                    <>
                      <p
                        className="font-heading font-bold text-lg md:text-xl truncate"
                        title={song.title}
                      >
                        {song.title}
                      </p>
                      <p
                        className="text-sm text-muted-foreground truncate mt-1"
                        title={song.artist}
                      >
                        {song.artist}
                      </p>
                      {song.album && (
                        <p
                          className="text-xs text-muted-foreground/70 truncate mt-0.5"
                          title={song.album}
                        >
                          {song.album}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="font-heading font-bold text-lg truncate">
                        Rádio Geek &amp; Toys
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isPlaying ? "No ar" : "Clique para ouvir"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/60">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted((m) => !m)}
                  className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label={isMuted || volume === 0 ? "Ativar som" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(v) => {
                    setVolume(v[0]);
                    if (v[0] > 0 && isMuted) setIsMuted(false);
                  }}
                  max={100}
                  step={1}
                  className="flex-1"
                  aria-label="Volume"
                />
                <span className="text-xs font-mono text-muted-foreground/70 w-8 text-right tabular-nums">
                  {isMuted ? 0 : volume}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioSection;
