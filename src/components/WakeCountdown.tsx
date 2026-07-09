import { useState, useEffect } from 'react';
import CosmicBackground from './CosmicBackground';

interface Props { onComplete: () => void; }

export default function WakeCountdown({ onComplete }: Props) {
  const [count, setCount] = useState(3);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (count <= 0) { onComplete(); return; }
    setShow(true);
    const h = setTimeout(() => setShow(false), 800);
    const n = setTimeout(() => setCount(c => c - 1), 1000);
    return () => { clearTimeout(h); clearTimeout(n); };
  }, [count, onComplete]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ color: 'rgba(60,50,30,0.9)' }}>
      <CosmicBackground theme="light" />
      <div className="diov-app-content flex flex-col items-center justify-center z-10">

        {/* Light ring */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-amber-300/20" style={{ boxShadow: '0 0 40px rgba(251,191,36,0.1), inset 0 0 40px rgba(251,191,36,0.05)' }} />
          <div className="absolute inset-4 rounded-full border border-amber-200/10" />

          <span key={count}
            className={`text-[8rem] font-extralight transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            style={{ color: 'rgba(60,50,30,0.8)', textShadow: '0 0 30px rgba(251,191,36,0.3)' }}>
            {count > 0 ? count : ''}
            {count > 0 && <span className="text-4xl ml-1">...</span>}
          </span>
        </div>

        <p className="text-sm font-light tracking-wider" style={{ color: 'rgba(60,50,30,0.5)' }}>3... 2... 1...</p>
      </div>
    </div>
  );
}
