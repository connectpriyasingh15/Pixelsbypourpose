"use client";

// A shader-based GPU particle layer. Points stream toward the camera on a wrapped
// z axis (endless forward flight), pushed sideways by simplex turbulence, faded
// by atmospheric depth. One draw call. Compose several layers for parallax depth.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SNOISE } from "./glsl";
import { scrollStore } from "@/lib/scrollStore";

const vertexShader = /* glsl */ `
${SNOISE}
uniform float uTime;
uniform float uFlow;
uniform float uDepth;
uniform float uSize;
uniform float uPixelRatio;
uniform float uTurb;
uniform vec2 uMouse;
attribute float aSeed;
attribute float aScale;
attribute float aBright;
varying float vAlpha;
varying float vSeed;
varying float vBright;
void main() {
  vec3 p = position;
  // endless stream toward the camera along z, wrapped into [-uDepth, 0]
  float m = mod(p.z + uFlow, uDepth);
  p.z = -uDepth + m;
  float depth01 = m / uDepth; // 0 far .. 1 near
  // turbulence (flowing streams)
  float t = uTime * 0.06;
  vec3 np = vec3(p.x * 0.028, p.y * 0.028, p.z * 0.02 + t);
  p.x += snoise(np) * uTurb;
  p.y += snoise(np + 37.3) * uTurb;
  // gentle independent float drift, unique per particle
  p.x += sin(uTime * 0.12 + aSeed * 34.0) * 2.2;
  p.y += cos(uTime * 0.09 + aSeed * 21.0) * 2.2;
  // subtle mouse parallax, stronger for nearer particles
  p.xy += uMouse * 6.0 * depth01;
  vBright = aBright;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = -mv.z;
  gl_PointSize = (uSize * aScale * uPixelRatio) / max(dist, 0.6);
  float fogFar = smoothstep(uDepth, uDepth * 0.14, dist);
  float nearFade = smoothstep(0.3, 9.0, dist);
  vAlpha = clamp(fogFar * nearFade, 0.0, 1.0);
  vSeed = aSeed;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
varying float vAlpha;
varying float vSeed;
varying float vBright;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.0, length(uv)) * vAlpha;
  // slow per-particle twinkle + opacity variation by brightness
  a *= (0.68 + 0.32 * sin(vSeed * 40.0 + uTime * 0.6)) * (0.5 + 0.55 * vBright);
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor * (0.75 + 0.5 * vBright), a);
}
`;

export default function ParticleField({
  count,
  size,
  depth,
  spread,
  speed,
  turb = 4,
  color,
}: {
  count: number;
  size: number;
  depth: number;
  spread: number;
  speed: number;
  turb?: number;
  color: [number, number, number];
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const flow = useRef(Math.random() * depth);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);
    const brights = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * spread;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * spread;
      pos[i * 3 + 2] = Math.random() * depth;
      seeds[i] = Math.random();
      scales[i] = 0.3 + Math.random() * Math.random() * 2.2;
      // most particles dim, a few bright, for a strong sense of scale
      brights[i] = Math.pow(Math.random(), 2.4);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aBright", new THREE.BufferAttribute(brights, 1));
    return g;
  }, [count, spread, depth]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlow: { value: 0 },
      uDepth: { value: depth },
      uSize: { value: size },
      uTurb: { value: turb },
      uPixelRatio: { value: 1 },
      uMouse: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color(color[0], color[1], color[2]) },
    }),
    [depth, size, turb, color]
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    flow.current += (speed + Math.abs(scrollStore.velocity) * speed * 6.0) * d;
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uFlow.value = flow.current;
    m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    (m.uniforms.uMouse.value as THREE.Vector2).set(scrollStore.mx, scrollStore.my);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
