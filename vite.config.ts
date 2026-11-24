import { build, defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";
import { pathToFileURL } from "url";
import {
  ROUTES_SEO,
  albumCrumbs,
  albumSeo,
  buildSitemap,
  injectBody,
  renderAlbumFallbackHead,
  renderNotFoundHead,
  renderRouteHead,
} from "./src/lib/seo-routes";
import { pageDataScript } from "./src/lib/page-data";
import { firstPaintScript } from "./src/lib/first-paint";

/** Last commit date of `files`, or undefined (no git, or only the shallow-clone boundary). */
function gitLastmod(files: string[]): string | undefined {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%H %cI", "--", ...files], {
      encoding: "utf8",
    }).trim();
    if (!out) return undefined;
    const [hash, date] = out.split(" ");
    const shallowFile = execFileSync("git", ["rev-parse", "--git-path", "shallow"], { encoding: "utf8" }).trim();
    // In a shallow clone the boundary commit "touches" every file: its date means nothing.
    if (fs.existsSync(shallowFile) && fs.readFileSync(shallowFile, "utf8").includes(hash)) return undefined;
    return date;
  } catch {
    return undefined;
  }
}

const API_BASE = "https://api.geeketoys.com.br";

/**
 * Promo strip as the API has it at build time. Only a layout hint for the
 * first paint (ShopPromoBanner reserves the strip's room, invisible); it is
 * never shown as an offer nor fed to prices. No answer in 3 s → no hint.
 */
type PromoHint = { enabled: boolean; bannerEnabled: boolean; percent: number; bannerText: string };

async function promoHint(): Promise<PromoHint | null> {
  try {
    const r = await fetch(`${API_BASE}/promo`, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return null;
    const p = (await r.json()) as Record<string, unknown>;
    return {
      enabled: p.enabled === true,
      bannerEnabled: p.bannerEnabled === true,
      percent: typeof p.percent === "number" ? p.percent : 0,
      bannerText: typeof p.bannerText === "string" ? p.bannerText : "",
    };
  } catch {
    return null;
  }
}

type Album = { slug: string; name: string; description?: string | null; coverUrl?: string | null };

/**
 * Gallery albums with their photos, as the API has them at build time: each
 * one gets its own page (head, canonical, body). An album created later is
 * served by the generic album shell until the next deploy. No answer → none.
 */
async function galleryAlbums(): Promise<Album[]> {
  try {
    const r = await fetch(`${API_BASE}/gallery`, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return [];
    const list = ((await r.json()) as { albums?: Album[] }).albums ?? [];
    const full = await Promise.all(
      list.map(async (a) => {
        if (!/^[a-z0-9-]+$/.test(a.slug)) return null;
        const d = await fetch(`${API_BASE}/gallery/${a.slug}`, { signal: AbortSignal.timeout(3000) });
        return d.ok ? ((await d.json()) as Album) : null;
      })
    );
    return full.filter((a): a is Album => a != null && a.slug != null);
  } catch {
    return [];
  }
}

type BundleAsset = { type: string; fileName: string; names?: string[]; name?: string };

/** Build output URL of the asset whose source file is `name` (e.g. "inter-latin.woff2"). */
function assetUrl(bundle: Record<string, BundleAsset>, name: string): string {
  const a = Object.values(bundle).find((f) => f.type === "asset" && (f.names?.includes(name) || f.name === name));
  if (!a) throw new Error(`seoShells: asset ${name} not in the bundle`);
  return `/${a.fileName}`;
}

/**
 * Per-route static head (the body is still the SPA): writes <route>/index.html
 * with its own title, description, canonical and breadcrumb, plus sitemap.xml.
 * Vercel serves these files before the SPA rewrite. Also preloads the latin
 * fonts and, in the root index.html, the hero image and the promo hint.
 */
function seoShells(): Plugin {
  let outDir = "dist";
  let hint: PromoHint | null = null;
  let albums: Album[] = [];
  return {
    name: "seo-shells",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await prerenderBodies(outDir, hint, albums);
    },
    async generateBundle(_, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset") throw new Error("seoShells: index.html missing");
      const assets = bundle as unknown as Record<string, BundleAsset>;
      const fonts = ["inter-latin.woff2", "space-grotesk-latin.woff2"]
        .map((f) => `<link rel="preload" href="${assetUrl(assets, f)}" as="font" type="font/woff2" crossorigin />`)
        .join("\n    ");
      const hero = [768, 1280, 1920].map((w) => `${assetUrl(assets, `hero-bg-${w}.webp`)} ${w}w`).join(", ");
      const heroPreload = `<link rel="preload" as="image" imagesrcset="${hero}" imagesizes="100vw" fetchpriority="high" />`;

      const base = String(index.source).replace("</title>", () => `</title>\n    ${fonts}`);
      [hint, albums] = await Promise.all([promoHint(), galleryAlbums()]);
      if (!hint) this.warn("promo hint unavailable: the promo strip may shift the hero on first paint");
      if (!albums.length) this.warn("gallery unavailable: album pages fall back to the generic shell");
      const hintTag = hint ? pageDataScript("promo-hint", hint) : "";
      index.source = base.replace("</head>", () => `  ${heroPreload}\n    ${hintTag}\n  </head>`);

      for (const route of ROUTES_SEO) {
        if (route.path === "/") continue;
        this.emitFile({ type: "asset", fileName: `${route.path.slice(1)}/index.html`, source: renderRouteHead(base, route) });
      }

      const lastmod = Object.fromEntries(
        ROUTES_SEO.map((r) => [r.path, gitLastmod([...r.sources, "src/lib/seo-routes.ts"])])
      );
      const albumPaths = albums.map((a) => `/galeria/${a.slug}`);
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: buildSitemap(lastmod, albumPaths) });
    },
  };
}

const ALIAS = { "@": path.resolve(__dirname, "./src") };

/**
 * Body of every fixed route rendered at build time (src/entry-server.tsx in an
 * SSR build), so crawlers that do not run JS read the page, not an empty
 * #root. Also writes dist/404.html, which Vercel serves with status 404 for
 * any unknown path (vercel.json has no SPA catch-all).
 */
async function prerenderBodies(outDir: string, hint: PromoHint | null, albums: Album[]) {
  const ssrDir = path.resolve(__dirname, "node_modules/.cache/ssr-prerender");
  await build({
    configFile: false,
    logLevel: "warn",
    mode: "production",
    plugins: [react()],
    resolve: { alias: ALIAS },
    build: { ssr: "src/entry-server.tsx", outDir: ssrDir, emptyOutDir: true, copyPublicDir: false, minify: false },
  });
  const { render } = (await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href)) as {
    render: (url: string, data?: Record<string, unknown>) => Promise<string>;
  };
  const shell = (p: string) => path.join(outDir, p === "/" ? "index.html" : `${p.slice(1)}/index.html`);
  // Shells before their body goes in: the 404 and album pages start from them.
  const base = fs.readFileSync(shell("/"), "utf8");
  const galleryShell = fs.readFileSync(shell("/galeria"), "utf8");

  for (const route of ROUTES_SEO) {
    // The home renders the promo strip's reserve from the same hint as the browser.
    const body = await render(route.path, route.path === "/" && hint ? { "promo-hint": hint } : {});
    if (!body.includes("<h1")) throw new Error(`prerender: ${route.path} has no <h1>`);
    const file = shell(route.path);
    let html = injectBody(fs.readFileSync(file, "utf8"), route.path, body);
    if (route.path === "/") html = html.replace("</div>\n  </body>", () => `</div>\n    ${firstPaintScript()}\n  </body>`);
    if (route.path === "/" && !html.includes("--promo-banner-h")) throw new Error("prerender: home without first-paint script");
    fs.writeFileSync(file, html);
  }

  for (const album of albums) {
    const p = `/galeria/${album.slug}`;
    const body = await render(p, { "album-data": album });
    if (!body.includes("<h1")) throw new Error(`prerender: ${p} has no <h1>`);
    const html = renderRouteHead(galleryShell, albumSeo(album), albumCrumbs(album)).replace(
      "</head>",
      () => `  ${pageDataScript("album-data", album)}\n  </head>`
    );
    fs.mkdirSync(path.dirname(shell(p)), { recursive: true });
    fs.writeFileSync(shell(p), injectBody(html, p, body));
  }

  // Albums created after the build (vercel.json rewrite): loading state, no canonical.
  const albumBody = await render("/galeria/__album__");
  fs.writeFileSync(path.join(outDir, "galeria/_album.html"), injectBody(renderAlbumFallbackHead(galleryShell), "/galeria/:slug", albumBody));

  const notFound = await render("/__pagina-inexistente__");
  if (!notFound.includes("Página não encontrada")) throw new Error("prerender: 404 without NotFound");
  fs.writeFileSync(path.join(outDir, "404.html"), injectBody(renderNotFoundHead(base), "/404", notFound));
  fs.rmSync(ssrDir, { recursive: true, force: true });
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), seoShells()],
  resolve: {
    alias: ALIAS,
  },
});
