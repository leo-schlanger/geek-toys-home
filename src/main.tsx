import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initTheme } from "./lib/theme";
import { queryClient } from "./lib/query-client";
import { primeFirstScreen } from "./lib/first-screen";

initTheme();

// Strips above the hero paint with their data (boot.js), capped at 400 ms.
primeFirstScreen(queryClient)
  .catch(() => undefined)
  .finally(() => createRoot(document.getElementById("root")!).render(<App />));
