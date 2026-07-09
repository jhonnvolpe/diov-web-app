import { useState } from 'react';
import { Star } from 'lucide-react';
import { QUALITY_CONTEXT } from '@/lib/diovUtils';
import CosmicBackground from './CosmicBackground';

interface Props { onSubmit: (rating: number) => void; }

export default function QualityRating({ onSubmit }: Props) {
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ color: 'rgba(60,50,30,0.9)' }}>
      <CosmicBackground theme="light" />
      <div className="diov-app-content w-full max-w-sm px-6 z-10 diov-slide-up">
        <div className="diov-glass-card-strong-light p-8 space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: 'rgba(60,50,30,0.4)' }}>Morning Check-In</p>
            <h3 className="diov-serif text-2xl font-normal italic" style={{ color: 'rgba(60,50,30,0.85)' }}>How did you sleep?</h3>
          </div>
          <div className="flex justify-center gap-4">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setRating(s)} className="text-3xl transition-transform active:scale-75 p-1">
                <Star className={`w-8 h-8 transition-all ${s <= rating ? 'text-amber-500 fill-amber-500' : 'text-black/10'}`}
                  style={s <= rating ? { filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.4))' } : undefined} />
              </button>
            ))}
          </div>
          <p className="text-xs font-light min-h-[20px]" style={{ color: 'rgba(60,50,30,0.45)' }}>
            {rating === 0 ? 'Tap to rate your recovery' : QUALITY_CONTEXT[rating]}
          </p>
          <button onClick={() => rating > 0 && onSubmit(rating)} disabled={rating === 0}
            className={`w-full py-3.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all active:scale-95 ${rating === 0 ? 'bg-black/5 text-black/20' : 'diov-cta-light'}`}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
