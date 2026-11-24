import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Gallery, Links, NotFound, PrivacyPolicy, TermsOfUse } from "./routes";

const queryClient = new QueryClient();

/** Providers shared by the browser and the build-time renderer (entry-server). */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {children}
    </TooltipProvider>
  </QueryClientProvider>
);

/**
 * `notFound`: the server answered 404 for this URL (dist/404.html). The page
 * stays NotFound even when the router would match it case-insensitively
 * (/Termos), so the body agrees with the status.
 */
export const AppRoutes = ({ notFound = false }: { notFound?: boolean }) =>
  notFound ? (
    <Suspense fallback={null}>
      <NotFound />
    </Suspense>
  ) : (
  <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/termos" element={<TermsOfUse />} />
      <Route path="/privacidade" element={<PrivacyPolicy />} />
      <Route path="/galeria" element={<Gallery />} />
      <Route path="/galeria/:slug" element={<Gallery />} />
      {/* Single destination for the Instagram bio. */}
      <Route path="/links" element={<Links />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE (and in routes.ts) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
  );

const App = ({ notFound = false }: { notFound?: boolean }) => (
  <AppProviders>
    <BrowserRouter>
      <AppRoutes notFound={notFound} />
    </BrowserRouter>
  </AppProviders>
);

export default App;
