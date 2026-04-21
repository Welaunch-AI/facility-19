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
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
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
    [style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] {
      grid-template-columns: 60px minmax(0, 1.3fr) minmax(0, 1fr) auto !important;
      gap: 16px !important;
    }

    [style*="padding: 80px 72px"] { padding: 56px 32px !important; }
    [style*="padding: 56px 64px"] { padding: 40px 28px !important; }
  }

  @media (max-width: 720px) {
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

    [style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] {
      grid-template-columns: 44px minmax(0, 1fr) auto !important;
      gap: 12px !important;
      padding: 16px 18px !important;
    }
    [style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] > *:nth-child(3),
    [style*="grid-template-columns: 80px 1.4fr 1fr 1fr auto"] > *:nth-child(4) {
      display: none !important;
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

console.log("Wrote", outHtml);
console.log("Assets:", Object.keys(manifest).length);
