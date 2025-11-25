import { useEffect, useState } from "react";

export default function AnimatedCounter({
  value = 0,
  duration = 1200,
  className = "",
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    let rafId = null;
    const startTime = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad-ish
      const val = Math.floor(eased * value);
      setDisplay(val);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  return <div className={className}>{display.toLocaleString()}</div>;
}
