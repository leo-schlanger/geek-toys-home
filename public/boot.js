/*
 * Runs before the bundle (plain script in index.html). On the home, starts
 * the API calls for the strips above the hero (promo, event) while the bundle
 * downloads, so they answer sooner. The app reuses these requests
 * (src/lib/boot-data.ts) and never waits for them before painting.
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
