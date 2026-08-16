import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

/**
 * jsdom não implementa ResizeObserver, e o EventAnnouncementBanner passou a
 * depender dele para medir a própria altura (ver a correção de 16/08/2026).
 * Sem este stub, qualquer teste que renderize o banner — ou a Navbar dentro
 * dele — quebra com "ResizeObserver is not defined".
 *
 * Guarda a callback para o teste poder disparar uma remedição na mão.
 */
class ResizeObserverStub {
  static callbacks: ResizeObserverCallback[] = [];
  constructor(private cb: ResizeObserverCallback) {
    ResizeObserverStub.callbacks.push(cb);
  }
  observe() {}
  unobserve() {}
  disconnect() {
    ResizeObserverStub.callbacks = ResizeObserverStub.callbacks.filter((c) => c !== this.cb);
  }
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverStub,
});
