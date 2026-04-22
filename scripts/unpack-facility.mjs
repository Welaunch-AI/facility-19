import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const manifestPath = path.join(root, "extracted", "manifest.json");
const templateJsonPath = path.join(root, "extracted", "template.json");
const extPath = path.join(root, "extracted", "ext_resources.json");
const outDir = path.join(root, "public", "facility");

const extMap = JSON.parse(fs.readFileSync(extPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const templateStr = JSON.parse(fs.readFileSync(templateJsonPath, "utf8"));

function extForMime(mime) {
  if (mime === "image/png") return ".png";
  if (mime === "font/woff2") return ".woff2";
  if (mime === "text/javascript" || mime === "application/javascript") return ".js";
  return "";
}

function decodeEntry(entry) {
  const buf = Buffer.from(entry.data, "base64");
  if (entry.compressed) {
    return zlib.gunzipSync(buf);
  }
  return buf;
}

fs.mkdirSync(outDir, { recursive: true });

const uuidToPublicPath = {};
for (const [uuid, entry] of Object.entries(manifest)) {
  const ext = extForMime(entry.mime);
  const filename = `${uuid}${ext}`;
  const full = path.join(outDir, filename);
  fs.writeFileSync(full, decodeEntry(entry));
  uuidToPublicPath[uuid] = `/facility/${filename}`;
}

let html = templateStr;
for (const uuid of Object.keys(manifest)) {
  const pub = uuidToPublicPath[uuid];
  html = html.split(uuid).join(pub);
}

html = html.replace(/\s+integrity="[^"]*"/gi, "").replace(/\s+crossorigin="[^"]*"/gi, "");

const resourceMap = {};
for (const { id, uuid } of extMap) {
  if (uuidToPublicPath[uuid]) resourceMap[id] = uuidToPublicPath[uuid];
}

const resourceScript = `<script>window.__resources = ${JSON.stringify(resourceMap)};<\/script>`;
const headOpen = html.match(/<head[^>]*>/i);
if (headOpen) {
  const i = headOpen.index + headOpen[0].length;
  html = html.slice(0, i) + resourceScript + html.slice(i);
}

html = html.replace(
  /<meta\s+name="viewport"\s+content="[^"]*"\s*\/?>/i,
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n  <link rel="icon" href="/favicon.png" type="image/png" />\n  <link rel="apple-touch-icon" href="/favicon.png" />',
);

const responsivePatch = `<style id="facility-responsive-patch">
  html { -webkit-text-size-adjust: 100%; }
  html, body {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  #root {
    min-height: 100%;
    min-height: 100dvh;
    min-height: 100svh;
    width: 100%;
    max-width: 100%;
    display: block;
  }
  img, video { max-width: 100%; height: auto; }
  svg { max-width: 100%; }

  /* The source bundle used JSX-style attribute selectors that never match
     rendered DOM inline styles. These selectors target actual rendered CSS. */
  @media (max-width: 1024px) {
    .nav {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 10002 !important;
    }
    #root { padding-top: 64px !important; }
    .wrap { padding: 0 24px !important; }
    .nav-links { display: none !important; }
    .nav-cta { display: none !important; }
    .nav-burger { display: inline-flex !important; }
    .nav-mobile { display: block !important; top: 64px !important; }
    .nav-inner { height: 64px !important; }
    .nav.is-open .nav-mobile {
      display: block !important;
      position: fixed !important;
      top: 64px !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      z-index: 10001 !important;
      background: var(--paper) !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      transform: none !important;
      overflow-y: auto !important;
    }
    .nav.is-open .nav-mobile .nav-mobile-inner {
      display: flex !important;
      flex-direction: column !important;
      gap: 4px !important;
      padding: 24px 28px 40px !important;
    }
    section[style*="padding: 120px 0"] { padding: 88px 0 !important; }
    section[style*="padding: 96px 0"] { padding: 80px 0 !important; }
    section[style*="padding: 120px 0 60px"] { padding: 88px 0 40px !important; }
    section[style*="padding: 40px 0 120px"] { padding: 32px 0 88px !important; }

    [style*="display: grid"][style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }

    [style*="grid-template-columns: repeat(3, 1fr)"] {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    [style*="grid-template-columns: repeat(5, 1fr)"] {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
    [style*="grid-template-columns: repeat(4, 1fr)"] {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    footer .wrap[style*="grid-template-columns: 1.4fr 1fr 1fr 1fr"] {
      grid-template-columns: 1fr 1fr !important;
      gap: 32px !important;
    }
    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] {
      grid-template-columns: 60px minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr) auto !important;
      gap: 16px !important;
      align-items: center !important;
    }

    [style*="padding: 80px 72px"] { padding: 56px 32px !important; }
    [style*="padding: 56px 64px"] { padding: 40px 28px !important; }
  }

  @media (max-width: 720px) {
    .nav {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 10002 !important;
    }
    #root { padding-top: 64px !important; }
    .wrap {
      padding-left: max(20px, env(safe-area-inset-left, 0px)) !important;
      padding-right: max(20px, env(safe-area-inset-right, 0px)) !important;
    }
    .nav-links { display: none !important; }
    .nav-cta { display: none !important; }
    .nav-burger { display: inline-flex !important; }
    .nav-mobile { display: block !important; top: 64px !important; }
    .nav-inner {
      height: 64px !important;
      padding-left: max(0px, env(safe-area-inset-left, 0px));
      padding-right: max(0px, env(safe-area-inset-right, 0px));
    }

    section[style*="padding: 120px 0"] { padding: 64px 0 !important; }
    section[style*="padding: 96px 0"] { padding: 56px 0 !important; }
    section[style*="padding: 120px 0 60px"] { padding: 64px 0 32px !important; }
    section[style*="padding: 40px 0 120px"] { padding: 24px 0 64px !important; }

    [style*="display: grid"][style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }

    section[style*="background: var(--ink)"] [style*="grid-template-columns: repeat(4, 1fr)"] {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] {
      display: grid !important;
      grid-template-columns: 52px minmax(0, 1fr) auto !important;
      gap: 12px !important;
      padding: 14px 16px !important;
      align-items: center !important;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] > *:nth-child(3),
    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] > *:nth-child(4) {
      display: none !important;
    }
    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] > div:nth-child(2) {
      min-width: 0 !important;
      text-align: left !important;
    }
    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] > div:nth-child(5) {
      justify-self: end !important;
      align-self: center !important;
    }
    [style*="padding: 14px 32px 14px 32px"] { padding: 14px 18px !important; }
    [style*="padding: 32px 32px 32px 0"] {
      padding: 24px 18px !important;
      grid-template-columns: 1fr !important;
      gap: 24px !important;
    }

    [style*="padding: 80px 72px"] {
      padding: 40px 24px !important;
      border-radius: 18px !important;
    }
    [style*="padding: 56px 64px"] { padding: 32px 22px !important; }
    [style*="padding: 32px"] { padding: 24px !important; }
    [style*="padding: 28px"] { padding: 22px !important; }

    footer .wrap[style*="grid-template-columns: 1.4fr 1fr 1fr 1fr"] {
      grid-template-columns: 1fr !important;
      gap: 32px !important;
    }
    footer .wrap[style*="margin-top: 72px"] {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }

    [style*="margin-top: 40px"][style*="gap: 12px"][style*="flex-wrap: wrap"] .btn,
    section#contact .btn {
      width: 100% !important;
      justify-content: center !important;
    }

    /* Hero CTAs: .btn is nowrap + fixed height; long "Meet Aria…" clips on narrow screens */
    section#top .wrap a.btn {
      white-space: normal !important;
      height: auto !important;
      min-height: 52px !important;
      padding: 14px 18px !important;
      line-height: 1.35 !important;
      box-sizing: border-box !important;
      flex-wrap: wrap !important;
    }

    /* --- Mobile roster fixes (<=720px): Hero "Your AI team" + #agents expandable --- */
    section#top .wrap > div[style*="grid-template-columns: 1.4fr 1fr"] {
      width: 100% !important;
      max-width: 100% !important;
      justify-items: stretch !important;
    }
    section#top .wrap > div[style*="grid-template-columns: 1.4fr 1fr"] > * {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      justify-self: stretch !important;
    }
    section#top .card[style*="padding: 28"],
    section#top .card[style*="padding:28"] {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }

    section#top [style*="display: grid"][style*="grid-template-columns: repeat(3, 1fr)"][style*="gap: 14"],
    section#top [style*="display: grid"][style*="grid-template-columns: repeat(3, 1fr)"][style*="gap:14"] {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 10px !important;
      width: 100% !important;
      max-width: 100% !important;
      justify-items: stretch !important;
      align-items: stretch !important;
      box-sizing: border-box !important;
    }
    section#top [style*="display: grid"][style*="grid-template-columns: repeat(3, 1fr)"][style*="gap: 14"] > div,
    section#top [style*="display: grid"][style*="grid-template-columns: repeat(3, 1fr)"][style*="gap:14"] > div {
      min-width: 0 !important;
      width: 100% !important;
      max-width: none !important;
      padding: 10px 6px !important;
      justify-self: stretch !important;
      box-sizing: border-box !important;
    }
    section#top [style*="display: grid"][style*="grid-template-columns: repeat(3, 1fr)"][style*="gap: 14"] [style*="font-size: 14px"],
    section#top [style*="display: grid"][style*="grid-template-columns: repeat(3, 1fr)"][style*="gap:14"] [style*="font-size: 14px"] {
      font-size: 12px !important;
    }
    section#top [style*="display: grid"][style*="grid-template-columns: repeat(3, 1fr)"][style*="gap: 14"] [style*="font-size: 10px"],
    section#top [style*="display: grid"][style*="grid-template-columns: repeat(3, 1fr)"][style*="gap:14"] [style*="font-size: 10px"] {
      font-size: 9px !important;
    }

    section#agents .card > div:first-child[style*="grid-template-columns: 80px"] {
      grid-template-columns: 1fr !important;
      gap: 0 !important;
      padding: 12px 18px !important;
      justify-items: stretch !important;
    }
    section#agents .card > div:first-child[style*="grid-template-columns: 80px"] > div:first-child,
    section#agents .card > div:first-child[style*="grid-template-columns: 80px"] > div:nth-child(3),
    section#agents .card > div:first-child[style*="grid-template-columns: 80px"] > div:nth-child(4),
    section#agents .card > div:first-child[style*="grid-template-columns: 80px"] > div:nth-child(5) {
      display: none !important;
    }
    section#agents .card > div:first-child[style*="grid-template-columns: 80px"] > div:nth-child(2) {
      grid-column: 1 / -1 !important;
      text-align: center !important;
    }

    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] > div:first-child {
      padding-left: 0 !important;
    }
    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] [style*="font-size: 26px"] {
      font-size: 20px !important;
      letter-spacing: -0.02em !important;
    }
    section#agents .card button[style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] [style*="font-size: 11px"][style*="text-transform: uppercase"] {
      font-size: 10px !important;
    }

    section#agents [style*="border-top: 1px solid var(--line)"][style*="padding: 32px 32px 32px 0"] {
      padding: 20px 18px 24px !important;
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }
    section#agents [style*="border-top: 1px solid var(--line)"][style*="padding: 32px 32px 32px 0"] > div:first-child {
      flex-direction: column !important;
      align-items: center !important;
      padding-left: 0 !important;
      gap: 16px !important;
    }
    section#agents [style*="border-top: 1px solid var(--line)"][style*="padding: 32px 32px 32px 0"] > div:first-child > div:last-child {
      text-align: center !important;
      width: 100% !important;
    }
    section#agents [style*="border-top: 1px solid var(--line)"][style*="padding: 32px 32px 32px 0"] > div:first-child > div:last-child [style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
      text-align: center !important;
    }
    section#agents [style*="border-top: 1px solid var(--line)"][style*="padding: 32px 32px 32px 0"] > div:first-child > div:last-child [style*="font-size: 16px"][style*="line-height: 1.55"] {
      text-align: left !important;
    }

    /* How it works (#how): horizontal carousel, centered snap, neighbor peek */
    section#how {
      overflow: visible !important;
    }
    section#how .wrap > div[style*="margin-top: 72"] > div[aria-hidden="true"]:first-of-type {
      left: max(12px, env(safe-area-inset-left, 0px)) !important;
      right: max(12px, env(safe-area-inset-right, 0px)) !important;
    }
    #how .f19-how-steps {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      grid-template-columns: unset !important;
      gap: 14px !important;
      overflow-x: auto !important;
      overflow-y: visible !important;
      scroll-snap-type: x mandatory !important;
      scroll-padding-inline: max(20px, env(safe-area-inset-left, 0px)) !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
      padding: 8px 0 28px !important;
      margin-left: calc(-1 * max(20px, env(safe-area-inset-left, 0px))) !important;
      margin-right: calc(-1 * max(20px, env(safe-area-inset-right, 0px))) !important;
      padding-left: max(20px, env(safe-area-inset-left, 0px)) !important;
      padding-right: max(20px, env(safe-area-inset-right, 0px)) !important;
      width: calc(100% + 2 * max(20px, env(safe-area-inset-left, 0px))) !important;
      max-width: none !important;
      box-sizing: border-box !important;
    }
    #how .f19-how-steps::-webkit-scrollbar {
      display: none !important;
    }
    #how .f19-how-steps > div {
      flex: 0 0 min(300px, calc(100vw - 56px)) !important;
      max-width: min(320px, calc(100vw - 40px)) !important;
      min-width: 0 !important;
      scroll-snap-align: center !important;
      scroll-snap-stop: always !important;
    }
    #how .f19-how-steps > div > button {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }

    /* Capabilities: full-width diagram column on small screens */
    .f19-cap-grid {
      grid-template-columns: 1fr !important;
      gap: 32px !important;
    }
    .f19-capabilities {
      padding: 48px 0 !important;
    }

    /* Live integrations: stack detail below platform list (no overlay on mobile) */
    .f19-stack-diagram {
      overflow: visible !important;
      overflow-anchor: none !important;
    }
    .f19-stack-diagram .f19-stack-main {
      display: flex !important;
      flex-direction: column !important;
      gap: 16px !important;
      min-height: unset !important;
      align-items: stretch !important;
      grid-template-columns: unset !important;
    }
    .f19-stack-diagram .f19-stack-rail {
      flex-shrink: 0 !important;
      width: 100% !important;
      max-height: none !important;
    }
    .f19-stack-diagram .f19-stack-rail > button {
      transform: none !important;
      scroll-margin-block: 4px !important;
      touch-action: manipulation !important;
    }
    .f19-stack-diagram .f19-stack-hub {
      position: relative !important;
      padding: 0 !important;
      min-height: 0 !important;
      width: 100% !important;
    }
    .f19-stack-diagram .f19-stack-hub > svg {
      display: none !important;
    }
    .f19-stack-diagram .f19-stack-hub-inner {
      position: relative !important;
      right: auto !important;
      top: auto !important;
      transform: none !important;
      width: 100% !important;
      max-width: none !important;
      margin-top: 0 !important;
    }
    .f19-stack-diagram .f19-stack-footer {
      justify-content: center !important;
    }
  }

  @media (max-width: 400px) {
    .wrap {
      padding-left: max(16px, env(safe-area-inset-left, 0px)) !important;
      padding-right: max(16px, env(safe-area-inset-right, 0px)) !important;
    }
  }
</style>`;

html = html.replace(/<\/head>/i, `${responsivePatch}</head>`);

const navFallbackScript = `<script id="facility-nav-fallback">
  (function () {
    function q(root, sel) { return root ? root.querySelector(sel) : null; }
    function qa(root, sel) { return root ? Array.from(root.querySelectorAll(sel)) : []; }
    function isMobile() { return window.innerWidth <= 1024; }
    function ensureDrawer(nav) {
      var existing = q(document, '#facility-mobile-drawer');
      if (existing) return existing;
      var links = qa(nav, '.nav-links a');
      var ctas = qa(nav, '.nav-cta a');
      var drawer = document.createElement('div');
      drawer.id = 'facility-mobile-drawer';
      drawer.setAttribute('aria-hidden', 'true');
      drawer.style.cssText = [
        'position:fixed',
        'top:64px',
        'left:0',
        'right:0',
        'bottom:0',
        'z-index:10000',
        'background:var(--paper)',
        'padding:24px 28px 40px',
        'display:none',
        'opacity:0',
        'pointer-events:none',
        'overflow-y:auto',
        'transform:translateY(-6px)',
        'transition:opacity .2s ease, transform .25s ease'
      ].join(';');
      drawer.innerHTML =
        '<div class="facility-mobile-drawer-inner" style="display:flex;flex-direction:column;gap:4px;max-width:var(--maxw);margin:0 auto;"></div>';
      var inner = q(drawer, '.facility-mobile-drawer-inner');
      links.forEach(function (link) {
        var a = link.cloneNode(true);
        a.style.cssText = 'font-family:var(--f-display);font-size:28px;letter-spacing:-0.02em;font-weight:500;color:var(--ink);padding:14px 0;border-bottom:1px solid var(--line);text-decoration:none;';
        inner.appendChild(a);
      });
      var ctaWrap = document.createElement('div');
      ctaWrap.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin-top:28px;';
      ctas.forEach(function (cta) {
        var a = cta.cloneNode(true);
        a.style.width = '100%';
        a.style.justifyContent = 'center';
        a.style.height = '52px';
        a.style.fontSize = '16px';
        ctaWrap.appendChild(a);
      });
      inner.appendChild(ctaWrap);
      document.body.appendChild(drawer);
      return drawer;
    }
    function setDrawerState(mobile, burger, icon, open) {
      var nav = burger ? burger.closest('.nav') : null;
      var drawer = nav ? ensureDrawer(nav) : null;
      mobile.classList.toggle('show', open);
      if (icon) icon.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (drawer) {
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
        drawer.style.display = open ? 'block' : 'none';
        drawer.style.opacity = open ? '1' : '0';
        drawer.style.pointerEvents = open ? 'auto' : 'none';
        drawer.style.transform = open ? 'translateY(0)' : 'translateY(-6px)';
      }
    }
    function resetDrawerState(mobile, burger, icon) {
      var drawer = q(document, '#facility-mobile-drawer');
      mobile.classList.remove('show');
      if (icon) icon.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      mobile.style.position = '';
      mobile.style.inset = '';
      mobile.style.top = '';
      mobile.style.zIndex = '';
      mobile.style.background = '';
      mobile.style.overflowY = '';
      mobile.style.display = '';
      if (drawer) {
        drawer.setAttribute('aria-hidden', 'true');
        drawer.style.display = 'none';
        drawer.style.opacity = '0';
        drawer.style.pointerEvents = 'none';
        drawer.style.transform = 'translateY(-6px)';
      }
    }

    function syncNavLayout() {
      qa(document, '.nav').forEach(function (nav) {
        var links = q(nav, '.nav-links');
        var cta = q(nav, '.nav-cta');
        var burger = q(nav, '.nav-burger');
        var mobile = q(nav, '.nav-mobile');
        var icon = q(burger, '.nav-burger-icon');
        if (!links || !cta || !burger || !mobile) return;

        if (isMobile()) {
          links.style.display = 'none';
          cta.style.display = 'none';
          burger.style.display = 'inline-flex';
          mobile.style.display = 'none';
          ensureDrawer(nav);
          var open = mobile.classList.contains('show') || burger.getAttribute('aria-expanded') === 'true';
          setDrawerState(mobile, burger, icon, open);
        } else {
          links.style.display = '';
          cta.style.display = '';
          burger.style.display = '';
          resetDrawerState(mobile, burger, icon);
        }
      });
    }

    function bindNavControls() {
      qa(document, '.nav').forEach(function (nav) {
        var burger = q(nav, '.nav-burger');
        var mobile = q(nav, '.nav-mobile');
        if (!burger || !mobile || burger.dataset.f19Bound === '1') return;
        var icon = q(burger, '.nav-burger-icon');
        ensureDrawer(nav);

        burger.dataset.f19Bound = '1';
        burger.addEventListener('click', function (ev) {
          if (!isMobile()) return;
          ev.preventDefault();
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          var open = !mobile.classList.contains('show');
          setDrawerState(mobile, burger, icon, open);
        }, { passive: false, capture: true });

        document.addEventListener('click', function (ev) {
          var drawer = q(document, '#facility-mobile-drawer');
          if (!drawer || !isMobile()) return;
          if (!drawer.contains(ev.target) && !burger.contains(ev.target) && mobile.classList.contains('show')) {
            setDrawerState(mobile, burger, icon, false);
          }
        });

        qa(document, '#facility-mobile-drawer a').forEach(function (a) {
          a.addEventListener('click', function () {
            setDrawerState(mobile, burger, icon, false);
          });
        });
      });
    }

    function run() {
      syncNavLayout();
      bindNavControls();
    }

    document.addEventListener('DOMContentLoaded', run);
    window.addEventListener('resize', syncNavLayout, { passive: true });
    var mo = new MutationObserver(run);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(run, 0);
  })();
</script>`;

html = html.replace(/<\/body>/i, `${navFallbackScript}</body>`);

const outHtml = path.join(outDir, "index.html");
fs.writeFileSync(outHtml, html, "utf8");

const LOVABLE_ARIA = "https://talk-aloud.lovable.app/";
const INTERNAL_ARIA = "/talk-to-aria";

/** Horizontal step carousel on small screens (scroll-snap + sync to active step). */
function patchHowItWorksCarousel(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".js")) continue;
    const full = path.join(dir, name);
    let text = fs.readFileSync(full, "utf8");
    if (!text.includes("function HowItWorks({ steps })")) continue;

    const reactImportOld = "const { useState: useStateS, useEffect: useEffectS } = React;";
    const reactImportNew =
      "const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;";
    if (text.includes(reactImportOld) && !text.includes("useRef: useRefS")) {
      text = text.split(reactImportOld).join(reactImportNew);
    }

    if (!text.includes("howCarouselRef")) {
      text = text
        .split("  const [active, setActive] = useStateS(0);\n  // auto-advance")
        .join(
          "  const [active, setActive] = useStateS(0);\n  const howCarouselRef = useRefS(null);\n  // auto-advance",
        );
    }

    const scrollEffectAfter = `  }, [steps.length]);

  useEffectS(() => {
    const root = howCarouselRef.current;
    if (!root || typeof window === "undefined") return;
    if (window.innerWidth > 720) return;
    const howEl = document.getElementById("how");
    if (!howEl) return;
    const r = howEl.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= window.innerHeight) return;
    const slide = root.children[active];
    if (!slide) return;
    requestAnimationFrame(() => {
      slide.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
    });
  }, [active]);

  const progress = `;
    const scrollEffectBefore = `  }, [steps.length]);

  const progress = `;
    if (text.includes(scrollEffectBefore) && text.includes("howCarouselRef")) {
      text = text.split(scrollEffectBefore).join(scrollEffectAfter);
    }

    const gridOld =
      "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>\n            {steps.map((s, i) => {";
    const gridNew =
      "<div ref={howCarouselRef} className=\"f19-how-steps\" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>\n            {steps.map((s, i) => {";
    if (text.includes("f19-how-steps")) {
      /* already patched */
    } else if (text.includes(gridOld)) {
      text = text.split(gridOld).join(gridNew);
    } else {
      console.warn("patchHowItWorksCarousel: step grid snippet not found in", name);
    }

    fs.writeFileSync(full, text, "utf8");
    console.log("Patched HowItWorks carousel in", name);
    return;
  }
}

/** Live integrations: class hooks + mobile-friendly taps (no layout overlay). */
function patchStackDiagramMobile(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".js")) continue;
    const full = path.join(dir, name);
    let text = fs.readFileSync(full, "utf8");
    if (!text.includes("function StackDiagram()")) continue;
    if (text.includes("f19-stack-diagram")) {
      console.log("StackDiagram mobile patch already applied in", name);
      return;
    }

    text = text
      .split(
        `    <div
      onMouseEnter={() => setPaused(true)}`,
      )
      .join(
        `    <div
      className="f19-stack-diagram"
      onMouseEnter={() => setPaused(true)}`,
      );

    text = text
      .split(
        `      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: 12,
        alignItems: 'stretch',
        minHeight: 420,
      }}>`,
      )
      .join(
        `      <div className="f19-stack-main" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: 12,
        alignItems: 'stretch',
        minHeight: 420,
      }}>`,
      );

    text = text
      .split(
        `              <button
                key={pl.key}
                onMouseEnter={() => setHovered(i)}
                onClick={() => { setHovered(i); setActive(i); }}`,
      )
      .join(
        `              <button
                type="button"
                key={pl.key}
                onMouseEnter={() => setHovered(i)}
                onClick={() => {
                  setHovered(i);
                  setActive(i);
                  if (typeof window !== "undefined" && window.innerWidth <= 720) {
                    const y = window.scrollY;
                    requestAnimationFrame(() => {
                      window.scrollTo(0, y);
                      requestAnimationFrame(() => window.scrollTo(0, y));
                    });
                  }
                }}`,
      );

    text = text
      .split(
        `        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 2 }}>`,
      )
      .join(
        `        <div className="f19-stack-rail" style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 2 }}>`,
      );

    text = text
      .split(`        <div style={{ position: 'relative', padding: '4px 0 0 4px' }}>`)
      .join(`        <div className="f19-stack-hub" style={{ position: 'relative', padding: '4px 0 0 4px' }}>`);

    text = text
      .split(
        `          <div style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'calc(100% - 60px)',
            maxWidth: 280,
            zIndex: 2,
          }}>`,
      )
      .join(
        `          <div className="f19-stack-hub-inner" style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'calc(100% - 60px)',
            maxWidth: 280,
            zIndex: 2,
          }}>`,
      );

    text = text
      .split(
        `      <div style={{
        marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)',
        display: 'flex', flexWrap: 'wrap', gap: 6,
      }}>`,
      )
      .join(
        `      <div className="f19-stack-footer" style={{
        marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)',
        display: 'flex', flexWrap: 'wrap', gap: 6,
      }}>`,
      );

    const capOld = `function Capabilities({ items }) {
  return (
    <section style={{ padding: '96px 0' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'center' }}>`;
    const capNew = `function Capabilities({ items }) {
  return (
    <section className="f19-capabilities" style={{ padding: '96px 0' }}>
      <div className="wrap f19-cap-grid" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'center' }}>`;
    if (text.includes(capOld)) {
      text = text.split(capOld).join(capNew);
    } else {
      console.warn("patchStackDiagramMobile: could not add Capabilities class in", name);
    }

    fs.writeFileSync(full, text, "utf8");
    console.log("Patched StackDiagram mobile layout in", name);
    return;
  }
}

function rewriteAriaUrlsInDir(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      rewriteAriaUrlsInDir(full);
      continue;
    }
    if (!name.endsWith(".js") && name !== "index.html") continue;
    let text = fs.readFileSync(full, "utf8");
    if (text.includes(LOVABLE_ARIA)) {
      text = text.split(LOVABLE_ARIA).join(INTERNAL_ARIA);
    }
    if (name.endsWith(".js") && text.includes("ARIA_URL")) {
      text = text.replace(
        /href=\{(ARIA_URL(?:_[SAHP])?)\} target="_blank" rel="noreferrer"/g,
        "href={$1}",
      );
      text = text.replace(
        "{ l: 'Meet Aria →', h: ARIA_URL, ext: true }",
        "{ l: 'Meet Aria →', h: ARIA_URL, ext: false }",
      );
    }
    if (name.endsWith(".js") && name.includes("cfee6374")) {
      text = text.replace(
        /href=\{t\.href\}\s+target="_blank"\s+rel="noreferrer"/,
        `href={t.href}
                  target={t.href.startsWith('/') ? undefined : '_blank'}
                  rel="noreferrer"`,
      );
    }
    fs.writeFileSync(full, text, "utf8");
  }
}

rewriteAriaUrlsInDir(outDir);
patchHowItWorksCarousel(outDir);
patchStackDiagramMobile(outDir);

console.log("Wrote", outHtml);
console.log("Assets:", Object.keys(manifest).length);
