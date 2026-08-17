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
 * jsdom does not implement ResizeObserver, and EventAnnouncementBanner needs
 * it to measure its own height. Without this stub any test rendering the
 * banner — or the Navbar inside it — fails with "ResizeObserver is not
 * defined".
 *
 * Keeps the callback so a test can trigger a re-measure by hand.
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
