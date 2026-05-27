'use client';

import { ComputedGains } from '@/types';
import { formatCurrency } from '@/lib/utils';
import Tooltip from './Tooltip';

interface Props {
  type: 'pre' | 'after';
  data: ComputedGains | null;
  savings?: number;
  loading?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fullDollar(v: number): string {
  const sign = v < 0 ? '-' : '';
  return `${sign}$${Math.abs(v).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function isCompacted(v: number) {
  return formatCurrency(v) !== fullDollar(v);
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ light }: { light?: boolean }) {
  const bg = light ? 'bg-white/20' : 'bg-white/10';
  return (
    <div className="space-y-3 py-1">
      {[1, 2, 3].map(i => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <div className={`h-3 rounded-full animate-pulse ${bg} w-3/4`} />
          <div className={`h-3 rounded-full animate-pulse ${bg} ml-auto w-2/3`} />
          <div className={`h-3 rounded-full animate-pulse ${bg} ml-auto w-2/3`} />
        </div>
      ))}
    </div>
  );
}

// ── Value cell with tooltip ───────────────────────────────────────────────────
function Val({
  value,
  colorize = false,
  light = false,
  align = 'right',
}: {
  value: number;
  colorize?: boolean;
  light?: boolean;
  align?: 'left' | 'right' | 'center';
}) {
  const compact   = formatCurrency(value);
  const full      = fullDollar(value);
  const truncated = isCompacted(value);

  const color = colorize
    ? value < 0
      ? light ? 'text-red-200' : 'text-red-400'
      : 'text-white'
    : 'text-white';

  return (
    <Tooltip content={full} disabled={!truncated} align={align}>
      <span className={`tabular-nums font-medium ${color}`}>{compact}</span>
    </Tooltip>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CapitalGainsCard({ type, data, savings = 0, loading }: Props) {
  const isAfter     = type === 'after';
  const showSavings = isAfter && data !== null && savings > 0;
  const divider     = isAfter ? 'border-white/20' : 'border-[#2A2D3A]';
  const label       = isAfter ? 'text-blue-100'   : 'text-gray-400';

  return (
    <div className={`rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300
      ${isAfter
        ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-900/40'
        : 'bg-[#1A1D27] border border-[#2A2D3A] shadow-lg'
      }`}
    >
      {/* Title */}
      <h2 className="text-white font-semibold text-base">
        {isAfter ? 'After Harvesting' : 'Pre Harvesting'}
      </h2>

      {/* Column headers */}
      <div className={`grid grid-cols-3 text-xs font-medium ${label}`}>
        <span />
        <span className="text-right">Short-term</span>
        <span className="text-right">Long-term</span>
      </div>

      <hr className={`border-t ${divider}`} />

      {loading || !data ? (
        <Skeleton light={isAfter} />
      ) : (
        <>
          {/* Profits */}
          <div className="grid grid-cols-3 items-center text-sm">
            <span className={label}>Profits</span>
            <span className="text-right">
              <Val value={data.stcg.profits} light={isAfter} />
            </span>
            <span className="text-right">
              <Val value={data.ltcg.profits} light={isAfter} />
            </span>
          </div>

          {/* Losses */}
          <div className="grid grid-cols-3 items-center text-sm">
            <span className={label}>Losses</span>
            <span className="text-right">
              <Val value={data.stcg.losses} light={isAfter} />
            </span>
            <span className="text-right">
              <Val value={data.ltcg.losses} light={isAfter} />
            </span>
          </div>

          {/* Net Capital Gains */}
          <div className="grid grid-cols-3 items-center text-sm">
            <span className={label}>Net Capital Gains</span>
            <span className="text-right">
              <Val value={data.stcg.net} colorize light={isAfter} />
            </span>
            <span className="text-right">
              <Val value={data.ltcg.net} colorize light={isAfter} />
            </span>
          </div>

          <hr className={`border-t ${divider}`} />

          {/* Effective / Realised Capital Gains */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-white font-semibold text-sm shrink-0">
              {isAfter ? 'Effective Capital Gains:' : 'Realised Capital Gains:'}
            </span>
            <Tooltip content={fullDollar(data.realised)} disabled={!isCompacted(data.realised)} align="right">
              <span className={`tabular-nums font-bold text-lg transition-all duration-500
                ${data.realised < 0
                  ? isAfter ? 'text-red-200' : 'text-red-400'
                  : 'text-white'
                }`}>
                {formatCurrency(data.realised)}
              </span>
            </Tooltip>
          </div>

          {/* Savings banner */}
          {showSavings && (
            <div className="mt-1 rounded-xl bg-white/15 border border-white/25
              px-4 py-3 flex items-start gap-2.5">
              <span className="text-base mt-0.5 shrink-0">🎉</span>
              <p className="text-white text-sm font-medium leading-snug">
                Your taxable capital gains are reduced by:{' '}
                <Tooltip content={fullDollar(savings)} disabled={!isCompacted(savings)} align="center">
                  <span className="font-bold underline decoration-dotted underline-offset-2 cursor-help">
                    {formatCurrency(savings)}
                  </span>
                </Tooltip>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
