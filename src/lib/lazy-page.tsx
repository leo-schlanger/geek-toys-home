import { lazy, type ComponentType } from "react";

type Loader = () => Promise<{ default: ComponentType }>;

export interface LazyPage {
  (): JSX.Element;
  load: Loader;
}

const loaded = new Map<Loader, ComponentType>();

/**
 * React.lazy that can be loaded ahead: once preloadPage() resolved, the page
 * renders at once, without suspending. main.tsx uses it so the first render
 * of a prerendered route never commits the empty Suspense fallback.
 */
export function lazyPage(load: Loader): LazyPage {
  const Lazy = lazy(() =>
    load().then((m) => {
      loaded.set(load, m.default);
      return m;
    })
  );
  const Page = (() => {
    const Ready = loaded.get(load);
    return Ready ? <Ready /> : <Lazy />;
  }) as LazyPage;
  Page.load = load;
  return Page;
}

export async function preloadPage(page: LazyPage): Promise<void> {
  const m = await page.load();
  loaded.set(page.load, m.default);
}
