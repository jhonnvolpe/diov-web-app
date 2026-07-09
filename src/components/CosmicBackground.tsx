import { useMemo } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  size: string;
  min: number;
  max: number;
  dur: string;
  delay: string;
}

export default function CosmicBackground() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${1 + Math.random() * 2}px`,
        min: 0.1 + Math.random() * 0.3,
        max: 0.6 + Math.random() * 0.4,
        dur: `${3 + Math.random() * 5}s`,
        delay: `${Math.random() * 5}s`,
      })),
    []
  );

  return (
    <div className="diov-cosmic-bg">
      <div className="diov-nebula-core" />
      <div className="diov-nebula-teal" />
      <div className="diov-grid-overlay" />
      <div className="diov-vignette" />
      {stars.map((s) => (
        <div
          key={s.id}
          className="diov-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            '--min': s.min,
            '--max': s.max,
            '--dur': s.dur,
            animationDelay: s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
