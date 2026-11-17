// Shared, mutable state read every frame by the WebGL scene. Kept outside React
// so the render loop never triggers re-renders.
export const scrollStore = {
  progress: 0, // 0..1 through the page
  velocity: 0, // recent scroll velocity (decays to 0 when idle)
  mouseX: 0, // -1..1 raw pointer target
  mouseY: 0, // -1..1 raw pointer target
  // Smoothed pointer with inertia (spring), updated once per frame in CameraRig.
  mx: 0,
  my: 0,
  mvx: 0,
  mvy: 0,
  // 1 while the pointer is over the page, 0 when it leaves.
  pointerActive: 0,
};
