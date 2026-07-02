"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref"> & {
  variant?: "light" | "dark";
  /** Increment to flash dots black briefly (e.g. on onboarding step change). */
  flashSignal?: number;
};

function styleCanvas(canvas: HTMLCanvasElement) {
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.pointerEvents = "none";
}

/** Dark brand violet (#3d4ddb) — readable on #fafaf8 onboarding background */
const LIGHT_DOT_RGB: [number, number, number] = [0.24, 0.3, 0.86];

export function DottedSurface({
  className,
  variant = "light",
  flashSignal = 0,
  ...props
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorsRef = useRef<{
    colorAttr: THREE.Float32BufferAttribute;
    baseColors: Float32Array;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;
    const fogColor = variant === "dark" ? 0x0a0a0b : 0xfafaf8;

    const scene = new THREE.Scene();
    if (variant === "dark") {
      scene.fog = new THREE.Fog(fogColor, 2000, 10000);
    }

    const getSize = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    let { width, height } = getSize();

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(fogColor, 0);
    styleCanvas(renderer.domElement);

    container.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);

        if (variant === "dark") {
          colors.push(0.78, 0.78, 0.78);
        } else {
          colors.push(...LIGHT_DOT_RGB);
        }
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );

    const colorAttr = geometry.attributes.color as THREE.Float32BufferAttribute;
    colorsRef.current = {
      colorAttr,
      baseColors: new Float32Array(colors),
    };

    const material = new THREE.PointsMaterial({
      size: variant === "dark" ? 10 : 15,
      vertexColors: true,
      transparent: variant === "dark",
      opacity: variant === "dark" ? 0.75 : 1,
      sizeAttenuation: true,
      depthWrite: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const positionAttribute = geometry.attributes.position;
      const positionArray = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          positionArray[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.1;
    };

    const handleResize = () => {
      ({ width, height } = getSize());
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      colorsRef.current = null;

      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  useEffect(() => {
    if (!flashSignal) return;

    const colors = colorsRef.current;
    if (!colors) return;

    const { colorAttr, baseColors } = colors;
    const colorArray = colorAttr.array as Float32Array;

    for (let i = 0; i < colorArray.length; i += 3) {
      colorArray[i] = 0;
      colorArray[i + 1] = 0;
      colorArray[i + 2] = 0;
    }
    colorAttr.needsUpdate = true;

    const timeout = window.setTimeout(() => {
      if (!colorsRef.current) return;
      colorArray.set(baseColors);
      colorAttr.needsUpdate = true;
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [flashSignal]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[1] h-full w-full overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}
