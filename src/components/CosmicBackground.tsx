import { useMemo } from 'react';

interface Props {
  theme?: 'dark' | 'light';
}

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

export default function CosmicBackground({ theme = 'dark' }: Props) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${1 + Math.random() * 2}px`,
        min: 0.1 + Math.random() * 0.3,
        max: 0.5 + Math.random() * 0.4,
        dur: `${3 + Math.random() * 5}s`,
        delay: `${Math.random() * 5}s`,
      })),
    []
  );

  if (theme === 'light') {
    return (
      <div className="diov-morning-bg">
        <div className="diov-grid-overlay-light" />
        <div className="diov-vignette-light" />
      </div>
    );
  }

  return (
    <div className="diov-cosmic-bg">
      <div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(76, 29, 149, 0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'diovCorePulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -right-[20%] -top-[10%] w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
          animation: 'diovCorePulse 15s ease-in-out infinite alternate',
        }}
      />
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
