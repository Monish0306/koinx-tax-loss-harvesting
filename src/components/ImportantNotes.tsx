'use client';

import { useState } from 'react';

export default function ImportantNotes() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#0F1E44] border border-blue-900/40 rounded-2xl overflow-hidden mb-6">
      <button
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4
          text-white hover:bg-white/5 transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1
              1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0
              100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Important Notes And Disclaimers</span>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-blue-900/30 text-sm text-gray-300 space-y-2">
          <p className="mt-3">• Tax Loss Harvesting involves selling assets at a loss to offset capital gains.</p>
          <p>• Values are based on your current holdings and unrealised gains/losses.</p>
          <p>• This tool is for informational purposes only — not financial or tax advice.</p>
          <p>• Consult a qualified tax professional before making investment decisions.</p>
          <p className="pt-2 text-white text-xs">
            <span className="text-blue-400 font-semibold">Pro tip:</span>{' '}
            Experiment with different combinations of holdings to optimise your tax liability.
          </p>
        </div>
      )}
    </div>
  );
}
