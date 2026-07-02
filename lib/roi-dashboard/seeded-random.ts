/** Deterministic sparkline data — avoids SSR/client hydration mismatches from Math.random(). */
function hashSeed(seedKey: string, salt = 0): number {
  let seed = salt;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed + seedKey.charCodeAt(i) * (i + 1)) | 0;
  }
  return seed;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandom(seedKey: string, salt = 0) {
  return mulberry32(hashSeed(seedKey, salt));
}

export function seedSpark(
  n: number,
  min: number,
  max: number,
  seedKey: string,
): number[] {
  const rand = createSeededRandom(seedKey, n * 97 + min * 13 + max * 7);
  return Array.from({ length: n }, () => min + rand() * (max - min));
}

/** Fixed epoch for demo event timestamps (stable relative labels across SSR). */
export const DEMO_NOW = 1_735_689_600_000; // 2025-01-01T00:00:00Z

export function demoTs(offsetMs: number) {
  return DEMO_NOW - offsetMs;
}
