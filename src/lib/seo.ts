/**
 * Canonical origin of the site. geekpoptoys.com.br is the main domain; www and
 * the legacy www.geeketoys.com.br serve the same pages without a redirect (the
 * legacy host stays in use), so canonical, og:url, sitemap and JSON-LD must
 * all name this one.
 */
export const SITE_URL = "https://geekpoptoys.com.br";

/** Alt text for a gallery photo: its caption, or album + position when it has none. */
export function photoAlt(albumName: string, caption: string | null | undefined, index: number): string {
  const text = caption?.trim();
  if (text) return text;
  return `${albumName} na GeekPop & Toys, foto ${index + 1}`;
}
