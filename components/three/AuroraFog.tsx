"use client";

// Volumetric fog approximated as large additive planes whose alpha is carved by
// flowing FBM, drifting horizontally like slow auroras. A few layers at different
// depths and speeds give layered, independent atmospheric motion.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SNOISE, FBM } from "./glsl";
import { scrollStore } from "@/lib/scrollStore";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
${SNOISE}
${FBM}
uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor;
uniform float uIntensity;
uniform vec2 uMouse;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  // warp the sampling by a slow flow field so the fog curls like an aurora
  vec2 flow = vec2(
    fbm(vec3(uv * 2.0, uTime * 0.04)),
    fbm(vec3(uv * 2.0 + 11.0, uTime * 0.04))
  ) * 0.18;
  vec2 w = uv + flow + uMouse * 0.035;
  float n = fbm(vec3(w.x * 3.2 - uTime * uSpeed, w.y * 6.5, uTime * 0.03));
  // very soft, low-contrast wisps (feathery, no hard threshold)
  float streak = smoothstep(-0.35, 1.1, n);
  streak = pow(streak, 1.5);
  // heavily feathered edges: full strength only near the center, melting to all sides
  float ex = smoothstep(0.0, 0.48, uv.x) * smoothstep(1.0, 0.52, uv.x);
  float ey = smoothstep(0.0, 0.52, uv.y) * smoothstep(1.0, 0.4, uv.y);
  float edge = pow(ex * ey, 1.4);
  float a = streak * edge * uIntensity;
  if (a < 0.002) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

function Layer({
  z,
  y,
  size,
  speed,
  intensity,
  color,
}: {
  z: number;
  y: number;
  size: [number, number];
  speed: number;
  intensity: number;
  color: [number, number, number];
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uIntensity: { value: intensity },
      uColor: { value: new THREE.Color(color[0], color[1], color[2]) },
      uMouse: { value: new THREE.Vector2() },
    }),
    [speed, intensity, color]
  );
  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    (m.uniforms.uMouse.value as THREE.Vector2).set(scrollStore.mx, scrollStore.my);
  });
  return (
    <mesh position={[0, y, z]}>
      <planeGeometry args={[size[0], size[1]]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function AuroraFog() {
  return (
    <group>
      <Layer z={-120} y={-2} size={[520, 240]} speed={0.04} intensity={0.2} color={[0.13, 0.2, 0.04]} />
      <Layer z={-240} y={2} size={[760, 320]} speed={0.025} intensity={0.25} color={[0.16, 0.24, 0.05]} />
      <Layer z={-400} y={6} size={[1100, 420]} speed={0.015} intensity={0.27} color={[0.14, 0.21, 0.045]} />
    </group>
  );
}
