"use client";

import type { Application } from "@splinetool/runtime";
import dynamic from "next/dynamic";
import { Spotlight } from "@/components/spotlight";
import { ROBOT_SCENE_URL } from "@/lib/spline-sign-in";

const SplineScene = dynamic(
  () => import("@/components/spline-scene").then((mod) => mod.SplineScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-end justify-center pb-8">
        <span className="sign-in-robot-loader" aria-hidden />
      </div>
    ),
  },
);

function handleSplineLoad(app: Application) {
  app.setGlobalEvents(true);
  app.setBackgroundColor("#fafaf8");
}

type SignInRobotProps = {
  onReady?: () => void;
};

export function SignInRobot({ onReady }: SignInRobotProps) {
  return (
    <div className="sign-in-robot-stage pointer-events-none fixed inset-0" aria-hidden>
      <Spotlight fill="#6b7bff" size={500} trackWindow />
      <div className="sign-in-robot-canvas-wrap">
        <SplineScene
          scene={ROBOT_SCENE_URL}
          className="sign-in-robot-scene"
          onLoad={(app) => {
            handleSplineLoad(app);
            onReady?.();
          }}
        />
      </div>
    </div>
  );
}
