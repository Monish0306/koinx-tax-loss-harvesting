'use client';

import Image from 'next/image';
import { Holding } from '@/types';
import { formatCurrency, formatTokenAmount, formatPrice } from '@/lib/utils';
import Checkbox from './Checkbox';
import Tooltip from './Tooltip';

interface Props {
  holdings: Holding[];
  isSelected: (h: Holding) => boolean;
  onToggle: (h: Holding) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
  selectedCount: number;
  loading: boolean;
  showAll: boolean;
  onToggleShowAll: () => void;
}

const PAGE_SIZE = 5;

function fullDollar(v: number): string {
  const sign = v < 0 ? '-' : '';
  return `${sign}$${Math.abs(v).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ── Gain cell — compact value + tooltip with full number ──────────────────────
function GainCell({ gain, balance, coin }: { gain: number; balance: number; coin: string }) {
  if (gain === 0 && balance === 0) {
    return (
      <div className="text-right">
        <p className="text-white text-sm">$0.00</p>
        <p className="text-gray-500 text-xs mt-0.5">0 {coin}</p>
      </div>
    );
  }

  const compact   = formatCurrency(gain);
  const full      = fullDollar(gain);
  const truncated = compact !== full;

  return (
    <div className="flex flex-col items-end gap-0.5">
      <Tooltip content={full} disabled={!truncated} align="right">
        <p className={`text-sm font-semibold tabular-nums
          ${gain < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {compact}
        </p>
      </Tooltip>
      <p className="text-gray-400 text-xs tabular-nums">
        {formatTokenAmount(balance, coin)}
      </p>
    </div>
  );
}

// ── Skeleton loading row ──────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-[#2A2D3A]">
      <td className="py-4 px-4">
        <div className="w-[18px] h-[18px] rounded bg-white/10 animate-pulse" />
      </td>
      {[140, 100, 80, 90, 80, 90].map((w, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-3 rounded-full bg-white/10 animate-pulse ml-auto"
            style={{ width: w }} />
          {i === 0 && (
            <div className="h-2.5 rounded-full bg-white/6 animate-pulse mt-1.5 ml-auto w-20" />
          )}
        </td>
      ))}
    </tr>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HoldingsTable({
  holdings, isSelected, onToggle, onToggleAll,
  allSelected, someSelected, selectedCount,
  loading, showAll, onToggleShowAll,
}: Props) {
  const rows = showAll ? holdings : holdings.slice(0, PAGE_SIZE);

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl overflow-hidden">

      {/* Header bar */}
      <div className="px-6 py-4 border-b border-[#2A2D3A]
        flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-white text-lg font-semibold">Holdings</h2>
        {/* Visual feedback badge */}
        {selectedCount > 0 && (
          <span className="text-xs font-semibold bg-blue-600/20 text-blue-300
            border border-blue-500/30 rounded-full px-3 py-1 transition-all duration-200">
            {selectedCount} asset{selectedCount !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#2A2D3A] text-gray-400 text-xs uppercase
              tracking-wide bg-[#15171F]">
              <th className="py-3 px-4 w-12 text-left">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={onToggleAll}
                  label="Select all holdings"
                />
              </th>
              <th className="py-3 px-4 text-left font-semibold">Asset</th>
              <th className="py-3 px-4 text-right font-semibold">
                Holdings
                <div className="text-[10px] normal-case tracking-normal text-gray-500 font-normal mt-0.5">
                  Avg Buy Price
                </div>
              </th>
              <th className="py-3 px-4 text-right font-semibold">Current Price</th>
              <th className="py-3 px-4 text-right font-semibold">Short-Term</th>
              <th className="py-3 px-4 text-right font-semibold">Long-Term</th>
              <th className="py-3 px-4 text-right font-semibold">Amount to Sell</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: PAGE_SIZE }, (_, i) => <SkeletonRow key={i} />)
              : rows.map(h => {
                  const sel = isSelected(h);
                  return (
                    <tr
                      key={`${h.coin}::${h.coinName}`}
                      onClick={() => onToggle(h)}
                      className={`border-b border-[#2A2D3A] cursor-pointer text-sm
                        transition-colors duration-150
                        ${sel
                          ? 'bg-blue-600/10 hover:bg-blue-600/15'
                          : 'hover:bg-white/[0.025]'
                        }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4">
                        <Checkbox
                          checked={sel}
                          onChange={() => onToggle(h)}
                          label={`Select ${h.coinName}`}
                        />
                      </td>

                      {/* Asset: logo + name + ticker */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden
                            bg-[#2A2D3A] flex-shrink-0 ring-1 ring-white/10">
                            <Image
                              src={h.logo} alt={h.coin} fill unoptimized
                              className="object-cover"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate max-w-[160px] sm:max-w-[200px]">
                              {h.coinName}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5">{h.coin}</p>
                          </div>
                        </div>
                      </td>

                      {/* Holdings + avg buy price */}
                      <td className="py-4 px-4 text-right">
                        <p className="text-white tabular-nums text-sm">
                          {formatTokenAmount(h.totalHolding, h.coin)}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 tabular-nums">
                          {h.averageBuyPrice > 0
                            ? `${formatPrice(h.averageBuyPrice)}/${h.coin}`
                            : `$0.00/${h.coin}`}
                        </p>
                      </td>

                      {/* Current price */}
                      <td className="py-4 px-4 text-right">
                        <p className="text-white font-medium tabular-nums text-sm">
                          {formatPrice(h.currentPrice)}
                        </p>
                      </td>

                      {/* Short-term gain */}
                      <td className="py-4 px-4">
                        <GainCell gain={h.stcg.gain} balance={h.stcg.balance} coin={h.coin} />
                      </td>

                      {/* Long-term gain */}
                      <td className="py-4 px-4">
                        <GainCell gain={h.ltcg.gain} balance={h.ltcg.balance} coin={h.coin} />
                      </td>

                      {/* Amount to sell */}
                      <td className="py-4 px-4 text-right">
                        {sel ? (
                          <span className="text-white font-semibold tabular-nums text-sm">
                            {formatTokenAmount(h.totalHolding, h.coin)}
                          </span>
                        ) : (
                          <span className="text-gray-600 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>

      {/* View All / Show Less */}
      {!loading && holdings.length > PAGE_SIZE && (
        <div className="px-6 py-4 border-t border-[#2A2D3A] flex justify-center">
          <button
            onClick={onToggleShowAll}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300
              text-sm font-semibold transition-colors duration-150 group"
          >
            {showAll ? (
              <>
                Show Less
                <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                View All {holdings.length} Assets
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
