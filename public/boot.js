/*
 * Runs before the bundle (plain script in index.html). On the home, asks the
 * API for what sits above the hero (promo strip, event strip) while the bundle
 * downloads; main.tsx waits a moment for the answers and paints with them.
 * Answers that arrived after first paint pushed the hero down (CLS ~0.09).
 * Read by src/lib/boot-data.ts; the app falls back to its own calls.
 */
(function () {
  try {
    if (location.pathname !== '/' || !window.fetch) return;
    var api = 'https://api.geeketoys.com.br';
    var paths = ['/promo', '/events/active'];
    var boot = {};
    for (var i = 0; i < paths.length; i++) {
      boot[paths[i]] = fetch(api + paths[i], { headers: { Accept: 'application/json' } })
        .then(function (r) {
          return r.ok ? r.json() : null;
        })
        ['catch'](function () {
          return null;
        });
    }
    window.__geekpopBoot = boot;
  } catch (e) {
    /* the app fetches on its own */
  }
})();
