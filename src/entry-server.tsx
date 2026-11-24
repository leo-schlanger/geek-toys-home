// Build-time renderer (vite.config.ts, prerenderBodies): each fixed route's
// body as static HTML. The page chunk is loaded first, so nothing suspends.
// API data is not fetched here: those sections render their loading state.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppProviders, AppRoutes } from "./App";
import { preloadRoute } from "./routes";

export async function render(url: string): Promise<string> {
  await preloadRoute(url);
  return renderToString(
    <AppProviders>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>
  );
}
