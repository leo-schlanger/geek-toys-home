import { useQuery } from "@tanstack/react-query";

/**
 * What we actually use from AzuraCast. The payload is large; taking only the
 * essentials keeps the UI from coupling to fields that may change.
 */
export interface NowPlayingSong {
  title: string;
  artist: string;
  album: string;
  art: string;
}

export interface NowPlayingState {
  song: NowPlayingSong | null;
  listeners: number;
  streamUrl: string;
  loading: boolean;
}

interface AzuraResponse {
  now_playing?: {
    song?: {
      title?: string;
      artist?: string;
      album?: string;
      art?: string;
    };
  };
  listeners?: {
    current?: number;
  };
  station?: {
    listen_url?: string;
  };
}

const API_URL =
  "https://radio.geeketoys.com.br/api/nowplaying_static/geek_e_toys.json";

/**
 * Polling do "agora tocando" do AzuraCast. Usa o endpoint `nowplaying_static`
 * (a cached JSON served straight by nginx) rather than the dynamic
 * `nowplaying`: far lighter on the server and enough for an auto-DJ station
 * with no live shows or podcasts.
 *
 * - Polls every 15s while the tab is visible
 * - React Query pauses automatically while the tab is backgrounded
 * - AzuraCast already sends `Access-Control-Allow-Origin: *`
 */
export function useNowPlaying(): NowPlayingState {
  const { data, isLoading } = useQuery({
    queryKey: ["geek-toys-nowplaying"],
    queryFn: async (): Promise<AzuraResponse> => {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
  });

  const rawSong = data?.now_playing?.song;
  const song: NowPlayingSong | null =
    rawSong && rawSong.title && rawSong.artist
      ? {
          title: rawSong.title,
          artist: rawSong.artist,
          album: rawSong.album ?? "",
          art: rawSong.art ?? "",
        }
      : null;

  return {
    song,
    listeners: data?.listeners?.current ?? 0,
    streamUrl:
      data?.station?.listen_url ??
      "https://radio.geeketoys.com.br/listen/geek_e_toys/radio.mp3",
    loading: isLoading,
  };
}
