export const ROBOT_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export const SPLINE_ORIGIN = "https://prod.spline.design";

/** Minimum overlay time so the sign-in experience feels intentional, not janky. */
export const START_PAGE_MIN_MS = 2400;

/** Reveal the page even if Spline is still downloading after this cap. */
export const START_PAGE_MAX_MS = 7000;

let prefetched = false;

export function prefetchStartAssets() {
  if (typeof window === "undefined" || prefetched) return;
  prefetched = true;

  const head = document.head;

  if (!document.querySelector('link[data-prefetch="start-route"]')) {
    const route = document.createElement("link");
    route.rel = "prefetch";
    route.href = "/start";
    route.dataset.prefetch = "start-route";
    head.appendChild(route);
  }

  if (!document.querySelector('link[data-preconnect="spline"]')) {
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = SPLINE_ORIGIN;
    preconnect.crossOrigin = "anonymous";
    preconnect.dataset.preconnect = "spline";
    head.appendChild(preconnect);
  }

  if (!document.querySelector('link[data-prefetch="spline-scene"]')) {
    const scene = document.createElement("link");
    scene.rel = "prefetch";
    scene.href = ROBOT_SCENE_URL;
    scene.as = "fetch";
    scene.crossOrigin = "anonymous";
    scene.dataset.prefetch = "spline-scene";
    head.appendChild(scene);
  }

  void fetch(ROBOT_SCENE_URL, { mode: "cors", credentials: "omit" }).catch(
    () => {},
  );
  void import("@splinetool/react-spline").catch(() => {});
}
