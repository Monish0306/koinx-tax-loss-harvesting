'use client';

import { useTax } from '@/context/TaxContext';
import CapitalGainsCard from '@/components/CapitalGainsCard';
import HoldingsTable from '@/components/HoldingsTable';
import ImportantNotes from '@/components/ImportantNotes';
import HowItWorks from '@/components/HowItWorks';
import ErrorState from '@/components/ErrorState';

export default function Page() {
  const {
    holdings, preHarvesting, afterHarvesting, savings,
    selectedCount, loading, error, showAll,
    allSelected, someSelected,
    isSelected, toggleHolding, toggleAll, setShowAll, retry,
  } = useTax();

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <main className="min-h-screen bg-[#0F1117]
      px-4 py-8
      sm:px-6
      md:px-10
      lg:px-16
      xl:px-20">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page title ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Tax Optimisation</h1>
          <HowItWorks />
        </div>

        {/* ── Disclaimer banner ── */}
        <ImportantNotes />

        {/* ── Capital Gains Cards — responsive 1-col on mobile, 2-col on md+ ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <CapitalGainsCard type="pre"   data={preHarvesting}   loading={loading} />
          <CapitalGainsCard type="after" data={afterHarvesting} loading={loading} savings={savings} />
        </div>

        {/* ── Holdings Table ── */}
        <HoldingsTable
          holdings={holdings}
          isSelected={isSelected}
          onToggle={toggleHolding}
          onToggleAll={toggleAll}
          allSelected={allSelected}
          someSelected={someSelected}
          selectedCount={selectedCount}
          loading={loading}
          showAll={showAll}
          onToggleShowAll={() => setShowAll(p => !p)}
        />

      </div>
    </main>
  );
}
