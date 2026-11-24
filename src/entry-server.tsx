// Build-time renderer (vite.config.ts, prerenderBodies): each fixed route's
// body as static HTML. The page chunk is loaded first, so nothing suspends.
// API data is not fetched here: those sections render their loading state.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppProviders, AppRoutes } from "./App";
import { preloadRoute } from "./routes";
import { ssrPageData } from "./lib/page-data";

/** `data`: what the page's HTML carries for its first render (page-data.ts). */
export async function render(url: string, data: Record<string, unknown> = {}): Promise<string> {
  await preloadRoute(url);
  for (const k of Object.keys(ssrPageData)) delete ssrPageData[k];
  Object.assign(ssrPageData, data);
  return renderToString(
    <AppProviders>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>
  );
}
