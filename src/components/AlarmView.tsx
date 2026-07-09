import { useState, useEffect } from 'react';
import CosmicBackground from './CosmicBackground';

interface Props { onStop: () => void; }

export default function AlarmView({ onStop }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ color: 'rgba(60,50,30,0.9)' }}>
      <CosmicBackground theme="light" />
      <div className={`diov-app-content flex flex-col items-center justify-center px-6 text-center z-10 max-w-sm transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>

        <p className="text-[11px] tracking-[0.3em] uppercase font-medium mb-6" style={{ color: 'rgba(60,50,30,0.5)' }}>
          ALARM PROTOCOL: ENGAGED.
        </p>

        <p className="text-lg font-light mb-2" style={{ color: 'rgba(60,50,30,0.7)' }}>ALARM ACTIVE.</p>
        <p className="text-sm font-light mb-10" style={{ color: 'rgba(60,50,30,0.5)' }}>Prepare to initiate ritual.</p>

        <div className="relative w-64 h-64 mb-10">
          <img src="/orb-wake.png" alt="" className="w-full h-full object-contain" style={{ animation: 'diovOrbPulse 2s ease-in-out infinite' }} />
          <div className="diov-wake-ring" style={{ animationDelay: '0s' }} />
          <div className="diov-wake-ring" style={{ animationDelay: '0.7s' }} />
        </div>

        <button onClick={onStop} className="w-full py-4 rounded-full diov-cta-light text-[14px] font-semibold tracking-[0.15em] uppercase transition-all active:scale-[0.98]">
          [ STOP ALARM ]
        </button>
      </div>
    </div>
  );
}
