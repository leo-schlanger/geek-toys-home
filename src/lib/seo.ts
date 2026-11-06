/**
 * Canonical origin of the site. geekpoptoys.com.br is the main domain; www and
 * the legacy geeketoys.com.br hosts redirect here (308), so canonical, og:url,
 * sitemap and JSON-LD must all use it.
 */
export const SITE_URL = "https://geekpoptoys.com.br";

/** Alt text for a gallery photo: its caption, or album + position when it has none. */
export function photoAlt(albumName: string, caption: string | null | undefined, index: number): string {
  const text = caption?.trim();
  if (text) return text;
  return `${albumName} na GeekPop & Toys, foto ${index + 1}`;
}
