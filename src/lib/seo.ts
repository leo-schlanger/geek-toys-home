/**
 * Canonical origin of the site. The apex (geeketoys.com.br) redirects here, so
 * canonical, og:url, sitemap and JSON-LD must all use www.
 */
export const SITE_URL = "https://www.geeketoys.com.br";

/** Alt text for a gallery photo: its caption, or album + position when it has none. */
export function photoAlt(albumName: string, caption: string | null | undefined, index: number): string {
  const text = caption?.trim();
  if (text) return text;
  return `${albumName} na GeekPop & Toys, foto ${index + 1}`;
}
