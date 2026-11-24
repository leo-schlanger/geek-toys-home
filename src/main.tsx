import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { preloadRoute } from "./routes";
import "./index.css";
import { initTheme } from "./lib/theme";

initTheme();

// The build prerenders each route's body (vite.config.ts) for crawlers that
// do not run JS. Not hydrated: the first client render depends on the browser
// (cached event, promo hint, season), so React replaces that HTML in one
// commit. The page chunk loads first, so the prerendered HTML stays on screen
// until then instead of a blank fallback.
const root = document.getElementById("root")!;
// dist/404.html: the server said 404, the app must not render a page anyway.
const notFound = root.dataset.route === "/404";
// The prerendered page already played its entrance animations; React's new
// nodes must not fade in a second time (index.css, html[data-prerendered]).
if (root.dataset.route) document.documentElement.dataset.prerendered = "";
preloadRoute(window.location.pathname, notFound)
  .catch(() => undefined)
  .then(() => createRoot(root).render(<App notFound={notFound} />));
