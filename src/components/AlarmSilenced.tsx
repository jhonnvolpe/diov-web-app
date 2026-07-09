import { useState, useEffect } from 'react';
import { Gem } from 'lucide-react';
import { ALARM_SILENCED_MESSAGES } from '@/lib/diovUtils';
import CosmicBackground from './CosmicBackground';

interface Props { onStartWake: () => void; }

export default function AlarmSilenced({ onStartWake }: Props) {
  const [visible, setVisible] = useState(false);
  const msg = ALARM_SILENCED_MESSAGES[0];

  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ color: 'rgba(60,50,30,0.9)' }}>
      <CosmicBackground theme="light" />
      <div className="diov-app-content flex flex-col items-center justify-center px-6 text-center z-10 max-w-sm">

        {/* Top bar */}
        <div className="absolute top-8 left-0 right-0 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2"><Gem className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: 'rgba(60,50,30,0.4)' }} /><span className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: 'rgba(60,50,30,0.4)' }}>0 DAYS STREAK</span></div>
        </div>

        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <p className="text-xl font-light leading-relaxed mb-2" style={{ color: 'rgba(60,50,30,0.75)' }}>{msg.main}</p>
          <p className="text-sm font-light mb-12" style={{ color: 'rgba(60,50,30,0.45)' }}>{msg.sub}</p>
        </div>

        {/* Crystal/Diamond button */}
        <button onClick={onStartWake} className="relative w-48 h-48 rounded-full flex items-center justify-center transition-all active:scale-95">
          <div className="absolute inset-0 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(255,255,255,0.3) 40%, rgba(200,180,140,0.2) 70%, transparent 80%)',
            boxShadow: '0 0 60px rgba(251,191,36,0.15), inset 0 0 40px rgba(255,255,255,0.3)',
          }} />
          <div className="absolute inset-2 rounded-full border border-amber-300/20" />
          <div className="absolute inset-4 rounded-full border border-amber-200/10" />
          <p className="relative text-[13px] font-semibold tracking-[0.1em] uppercase leading-tight" style={{ color: 'rgba(60,50,30,0.8)' }}>
            [ START WAKE<br />SEQUENCE ]
          </p>
        </button>
      </div>
    </div>
  );
}
