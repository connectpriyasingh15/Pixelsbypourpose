"use client";

// The cinematic digital landscape: an FBM terrain flowing forever, aurora fog,
// glowing olive particles, a perspective camera drifting above it, and a post
// stack of bloom, depth of field, film grain, and vignette. Everything stays
// alive independently; the motion never loops.

import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import Terrain from "./Terrain";
import AuroraFog from "./AuroraFog";
import ParticleField from "./ParticleField";
import { scrollStore } from "@/lib/scrollStore";

function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Inertia-smoothed pointer (spring), shared with terrain / fog / particles.
    const k = 0.05;
    const damp = 0.84;
    scrollStore.mvx += (scrollStore.mouseX - scrollStore.mx) * k;
    scrollStore.mvx *= damp;
    scrollStore.mx += scrollStore.mvx;
    scrollStore.mvy += (scrollStore.mouseY - scrollStore.my) * k;
    scrollStore.mvy *= damp;
    scrollStore.my += scrollStore.mvy;

    const cam = state.camera;
    // floating: independent horizontal / vertical drift + scroll parallax in depth
    const px = scrollStore.mx * 3.0 + Math.sin(t * 0.037) * 1.3 + Math.sin(t * 0.013) * 0.7;
    const py = 4.6 + scrollStore.my * 1.6 + Math.sin(t * 0.051) * 0.7;
    const pz = 14 - scrollStore.progress * 46;
    cam.position.x += (px - cam.position.x) * 0.03;
    cam.position.y += (py - cam.position.y) * 0.03;
    cam.position.z += (pz - cam.position.z) * 0.04;
    cam.lookAt(
      scrollStore.mx * 5 + Math.sin(t * 0.029) * 3.5,
      -6 + Math.sin(t * 0.043) * 1.6,
      -240
    );
    // subtle roll on top of the fresh lookAt (re-applied each frame, no drift)
    cam.rotateZ(Math.sin(t * 0.021) * 0.02 + scrollStore.mx * 0.012);
  });
  return null;
}

export default function Universe() {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.6]}
      frameloop={reduce ? "demand" : "always"}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 4, 14], fov: 68, near: 0.1, far: 900 }}
    >
      <color attach="background" args={["#030603"]} />

      <Terrain />
      <AuroraFog />

      {/* very tiny glowing dust */}
      <ParticleField
        count={24000}
        size={9}
        depth={540}
        spread={240}
        speed={1.8}
        turb={7}
        color={[1.0, 1.05, 0.55]}
      />
      <ParticleField
        count={7000}
        size={15}
        depth={540}
        spread={300}
        speed={1.0}
        turb={10}
        color={[0.85, 0.95, 0.4]}
      />

      <CameraRig />

      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={0.95}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.4}
          radius={0.82}
        />
        <DepthOfField
          focusDistance={0.012}
          focalLength={0.055}
          bokehScale={2.2}
        />
        <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.05} />
        <Vignette eskil={false} offset={0.28} darkness={0.72} />
      </EffectComposer>
    </Canvas>
  );
}
