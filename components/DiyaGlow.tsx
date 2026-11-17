// DiyaGlow: living lamps adrift on the night canvas. Each diya is two
// layers: a soft warm halo that breathes slowly, and a small bright
// core that flickers irregularly and licks upward like a real flame.
// Deterministic positions, pure CSS animation, sits behind everything
// and never intercepts the pointer.

// Few and uneven, like lamps that happen to be there: clustered
// asymmetrically, one large and near, one tiny and far.
const DIYAS = [
  { left: "83%", top: "18%", size: 180, drift: 16, flick: 2.4, delay: 0.5, tilt: -14 },
  { left: "12%", top: "47%", size: 70, drift: 13, flick: 1.7, delay: 1.9, tilt: 32 },
  { left: "68%", top: "78%", size: 120, drift: 18, flick: 2.1, delay: 0, tilt: 118 },
  { left: "31%", top: "88%", size: 55, drift: 12, flick: 1.5, delay: 1.1, tilt: 74 },
];

export default function DiyaGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {DIYAS.map((d, i) => (
        <span
          key={i}
          className="diya-wrap absolute"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDuration: `${d.drift}s`,
            animationDelay: `${d.delay}s`,
          }}
        >
          <span
            className="diya-halo absolute inset-0"
            style={{
              animationDuration: `${d.flick * 2.4}s`,
              animationDelay: `${d.delay * 0.7}s`,
              transform: `rotate(${d.tilt}deg)`,
            }}
          />
          <span
            className="diya-core absolute"
            style={{
              animationDuration: `${d.flick}s, ${d.flick * 1.7}s`,
              animationDelay: `${d.delay * 0.5}s, ${d.delay}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
