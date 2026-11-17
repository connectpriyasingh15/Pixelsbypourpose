"use client";

// Infinite procedural terrain. FBM displacement that both streams forward (uFlow)
// and slowly evolves in place (uEvo) so the landscape gently breathes. Per-vertex
// normals drive lambert lighting from a slowly-orbiting light. On hover, glowing
// topographic contour lines are revealed in a soft radius under the cursor.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SNOISE, FBM } from "./glsl";
import { scrollStore } from "@/lib/scrollStore";

const vertexShader = /* glsl */ `
${SNOISE}
${FBM}
uniform float uFlow;
uniform float uEvo;
varying float vH;
varying vec2 vXY;
varying float vFog;
varying vec3 vNormal;
varying vec3 vWorld;

float terrainH(vec2 q){
  // low-frequency rolling base + a single smooth secondary undulation.
  return (fbm(vec3(q.x * 0.006, q.y * 0.006 - uFlow, uEvo)) * 1.0
        + snoise(vec3(q.x * 0.02, q.y * 0.02 - uFlow * 2.0, 7.0 + uEvo)) * 0.28) * 24.0;
}

void main() {
  vec2 q = position.xy;
  float height = terrainH(q);
  float e = 2.5;
  float hL = terrainH(q + vec2(-e, 0.0));
  float hR = terrainH(q + vec2(e, 0.0));
  float hD = terrainH(q + vec2(0.0, -e));
  float hU = terrainH(q + vec2(0.0, e));
  vNormal = normalize(vec3(-(hR - hL) / (2.0 * e), -(hU - hD) / (2.0 * e), 1.0));
  vec3 pos = vec3(position.x, position.y, height);
  vH = height;
  vXY = q;
  vWorld = (modelMatrix * vec4(pos, 1.0)).xyz;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vFog = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
${SNOISE}
${FBM}
uniform float uTime;
uniform vec3 uLightDir;
uniform vec2 uMouse;
uniform vec3 uHoverPos;
uniform float uHoverStrength;
uniform float uContourFreq;
uniform float uRadius;
varying float vH;
varying vec2 vXY;
varying float vFog;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  float hn = clamp((vH + 18.0) / 44.0, 0.0, 1.0);
  float e = fbm(vec3(vXY.x * 0.011 + uMouse.x * 0.5, vXY.y * 0.011 - uTime * 0.05, 2.0));
  e = smoothstep(-0.15, 0.75, e);
  float diff = clamp(dot(normalize(vNormal), normalize(uLightDir)), 0.0, 1.0);
  float light = 0.18 + 0.92 * diff;

  vec3 nearBlack = vec3(0.003, 0.007, 0.003);
  vec3 olive     = vec3(0.05, 0.09, 0.014);
  vec3 highlight = vec3(0.30, 0.40, 0.10);
  vec3 col = nearBlack;
  col = mix(col, olive, e * (0.35 + 0.65 * hn));
  col += highlight * pow(e, 2.0) * hn * 0.6;
  col *= light;
  col += highlight * pow(diff, 3.0) * hn * 0.22;

  // hover: glowing topographic contour lines revealed under the cursor
  if (uHoverStrength > 0.002) {
    float distH = distance(vWorld.xz, uHoverPos.xz);
    // ultra-tight, soft feathered pool at the cursor
    float ring = pow(smoothstep(uRadius, 0.0, distH), 2.0);
    // soft flowing aurora light (no lines) — wispy noise drifting over time
    float aur = fbm(vec3(vWorld.x * 0.05, vWorld.z * 0.05 - uTime * 0.35, uTime * 0.12));
    aur = smoothstep(-0.1, 1.0, aur);
    col += vec3(0.42, 0.52, 0.16) * aur * ring * uHoverStrength * 1.35;
  }

  float fog = smoothstep(90.0, 640.0, vFog);
  col = mix(col, vec3(0.0), fog);
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Terrain() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 7), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const hoverTarget = useRef(0);

  const uniforms = useMemo(
    () => ({
      uFlow: { value: 0 },
      uEvo: { value: 0 },
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0.4, 0.35, 0.8) },
      uMouse: { value: new THREE.Vector2() },
      uHoverPos: { value: new THREE.Vector3(0, -7, -200) },
      uHoverStrength: { value: 0 },
      uContourFreq: { value: 0.22 },
      uRadius: { value: 38 },
    }),
    []
  );

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;
    const d = Math.min(dt, 0.05);
    const t = state.clock.elapsedTime;
    m.uniforms.uFlow.value += (0.06 + Math.abs(scrollStore.velocity) * 0.6) * d;
    m.uniforms.uEvo.value = t * 0.03;
    m.uniforms.uTime.value = t;
    (m.uniforms.uLightDir.value as THREE.Vector3).set(
      Math.cos(t * 0.05) * 0.7,
      0.35 + Math.sin(t * 0.07) * 0.12,
      Math.sin(t * 0.05) * 0.7 + 0.4
    );
    (m.uniforms.uMouse.value as THREE.Vector2).set(scrollStore.mx, scrollStore.my);

    // project the cursor onto the terrain plane for the contour reveal
    if (scrollStore.pointerActive) {
      state.raycaster.setFromCamera(state.pointer, state.camera);
      const p = state.raycaster.ray.intersectPlane(plane, hit);
      if (p) {
        hoverTarget.current = 1;
        (m.uniforms.uHoverPos.value as THREE.Vector3).copy(hit);
      } else {
        hoverTarget.current = 0;
      }
    } else {
      hoverTarget.current = 0;
    }
    m.uniforms.uHoverStrength.value +=
      (hoverTarget.current - m.uniforms.uHoverStrength.value) * 0.07;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -7, -300]}>
      <planeGeometry args={[1100, 640, 320, 240]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
