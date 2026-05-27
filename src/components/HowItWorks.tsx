'use client';

import { useState, useRef, useEffect } from 'react';

/** "How it works?" button with white popup — matches demo video */
export default function HowItWorks() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="text-blue-400 hover:text-blue-300 text-sm font-medium
          underline underline-offset-2 transition-colors"
      >
        How it works?
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-3 z-50 w-[300px] sm:w-[340px]">
          {/* Arrow */}
          <div className="ml-5 w-3 h-3 bg-white rotate-45 shadow ring-1 ring-black/5 -mb-1.5" />
          {/* Popup */}
          <div className="bg-white rounded-xl shadow-2xl ring-1 ring-black/10 p-5 text-sm text-gray-800 leading-relaxed">
            <ul className="space-y-2.5 mb-4">
              {[
                'See your capital gains for FY 2024-25 in the left card',
                'Check boxes for assets you plan on selling to reduce your tax liability',
                'Instantly see your updated tax liability in the right card',
              ].map((txt, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-3 text-xs text-gray-600">
              <span className="font-bold text-gray-900">Pro tip:</span>{' '}
              Experiment with different combinations of your holdings to optimize your tax liability
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
