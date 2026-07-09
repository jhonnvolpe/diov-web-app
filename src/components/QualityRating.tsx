import { useState } from 'react';
import { Star } from 'lucide-react';
import { QUALITY_CONTEXT } from '@/lib/diovUtils';
import CosmicBackground from './CosmicBackground';

interface QualityRatingProps {
  onSubmit: (rating: number) => void;
}

export default function QualityRating({ onSubmit }: QualityRatingProps) {
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative">
      <CosmicBackground />
      <div className="diov-app-content w-full max-w-sm px-6 diov-slide-up">
        <div className="diov-glass-card-strong p-8 space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-medium">
              Morning Check-In
            </p>
            <h3 className="diov-serif text-2xl font-normal italic text-white/90">
              How did you sleep?
            </h3>
          </div>

          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className="text-3xl transition-transform active:scale-75 p-1"
              >
                <Star
                  className={`w-8 h-8 transition-all ${
                    s <= rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-white/15'
                  }`}
                  style={
                    s <= rating
                      ? { filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.5))' }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>

          <p className="text-xs text-white/40 font-light min-h-[20px]">
            {rating === 0
              ? 'Tap to rate your recovery'
              : QUALITY_CONTEXT[rating] || ''}
          </p>

          <button
            onClick={() => rating > 0 && onSubmit(rating)}
            disabled={rating === 0}
            className={`w-full py-3.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all active:scale-95 ${
              rating === 0
                ? 'bg-white/5 text-white/30'
                : 'bg-white text-black diov-cta-btn'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
