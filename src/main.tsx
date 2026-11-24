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
preloadRoute(window.location.pathname)
  .catch(() => undefined)
  .then(() => createRoot(root).render(<App />));
