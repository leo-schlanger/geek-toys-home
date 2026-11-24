import { build, defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";
import { pathToFileURL } from "url";
import { ROUTES_SEO, buildSitemap, injectBody, renderNotFoundHead, renderRouteHead } from "./src/lib/seo-routes";

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
async function promoHint(): Promise<string> {
  try {
    const r = await fetch(`${API_BASE}/promo`, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return "";
    const p = (await r.json()) as Record<string, unknown>;
    const hint = {
      enabled: p.enabled === true,
      bannerEnabled: p.bannerEnabled === true,
      percent: typeof p.percent === "number" ? p.percent : 0,
      bannerText: typeof p.bannerText === "string" ? p.bannerText : "",
    };
    return `<script type="application/json" id="promo-hint">${JSON.stringify(hint).replace(/</g, "\\u003c")}</script>`;
  } catch {
    return "";
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
  return {
    name: "seo-shells",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await prerenderBodies(outDir);
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
      const hint = await promoHint();
      if (!hint) this.warn("promo hint unavailable: the promo strip may shift the hero on first paint");
      index.source = base.replace("</head>", () => `  ${heroPreload}\n    ${hint}\n  </head>`);

      for (const route of ROUTES_SEO) {
        if (route.path === "/") continue;
        this.emitFile({ type: "asset", fileName: `${route.path.slice(1)}/index.html`, source: renderRouteHead(base, route) });
      }

      const lastmod = Object.fromEntries(
        ROUTES_SEO.map((r) => [r.path, gitLastmod([...r.sources, "src/lib/seo-routes.ts"])])
      );
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: buildSitemap(lastmod) });
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
async function prerenderBodies(outDir: string) {
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
    render: (url: string) => Promise<string>;
  };
  const shell = (p: string) => path.join(outDir, p === "/" ? "index.html" : `${p.slice(1)}/index.html`);
  // Home shell before its body goes in: the 404 page starts from it.
  const base = fs.readFileSync(shell("/"), "utf8");

  for (const route of ROUTES_SEO) {
    const body = await render(route.path);
    if (!body.includes("<h1")) throw new Error(`prerender: ${route.path} has no <h1>`);
    const file = shell(route.path);
    fs.writeFileSync(file, injectBody(fs.readFileSync(file, "utf8"), route.path, body));
  }

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
