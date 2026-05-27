'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { fetchCapitalGains } from '@/mock/capitalGains';
import { fetchHoldings } from '@/mock/holdings';
import { Holding, CapitalGainsData, ComputedGains } from '@/types';

// ─── Business logic ───────────────────────────────────────────────────────────
function computeAfterHarvesting(
  base: CapitalGainsData,
  selected: Holding[]
): ComputedGains {
  let sp = base.capitalGains.stcg.profits;
  let sl = base.capitalGains.stcg.losses;
  let lp = base.capitalGains.ltcg.profits;
  let ll = base.capitalGains.ltcg.losses;

  for (const h of selected) {
    if (h.stcg.gain > 0)      sp += h.stcg.gain;
    else if (h.stcg.gain < 0) sl += Math.abs(h.stcg.gain);
    if (h.ltcg.gain > 0)      lp += h.ltcg.gain;
    else if (h.ltcg.gain < 0) ll += Math.abs(h.ltcg.gain);
  }
  const sNet = sp - sl;
  const lNet = lp - ll;
  return {
    stcg: { profits: sp, losses: sl, net: sNet },
    ltcg: { profits: lp, losses: ll, net: lNet },
    realised: sNet + lNet,
  };
}

// ─── Context type ─────────────────────────────────────────────────────────────
interface TaxCtx {
  holdings: Holding[];
  preHarvesting: ComputedGains | null;
  afterHarvesting: ComputedGains | null;
  savings: number;
  selectedCount: number;
  loading: boolean;
  error: string | null;
  showAll: boolean;
  allSelected: boolean;
  someSelected: boolean;
  isSelected: (h: Holding) => boolean;
  toggleHolding: (h: Holding) => void;
  toggleAll: () => void;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
  retry: () => void;
}

const TaxContext = createContext<TaxCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function TaxProvider({ children }: { children: React.ReactNode }) {
  const [gainsData, setGainsData]         = useState<CapitalGainsData | null>(null);
  const [holdings, setHoldings]           = useState<Holding[]>([]);
  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [showAll, setShowAll]             = useState(false);
  const [tick, setTick]                   = useState(0); // retry trigger

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.all([fetchCapitalGains(), fetchHoldings()])
      .then(([g, h]) => {
        if (!alive) return;
        setGainsData(g);
        setHoldings(h);
      })
      .catch(() => alive && setError('Failed to load data. Please try again.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [tick]);

  const retry = useCallback(() => {
    setSelected(new Set());
    setTick(n => n + 1);
  }, []);

  // Pre-harvesting: pure derived value from API data
  const preHarvesting = useMemo<ComputedGains | null>(() => {
    if (!gainsData) return null;
    const { stcg, ltcg } = gainsData.capitalGains;
    const sNet = stcg.profits - stcg.losses;
    const lNet = ltcg.profits - ltcg.losses;
    return {
      stcg: { profits: stcg.profits, losses: stcg.losses, net: sNet },
      ltcg: { profits: ltcg.profits, losses: ltcg.losses, net: lNet },
      realised: sNet + lNet,
    };
  }, [gainsData]);

  const selectedList = useMemo(
    () => holdings.filter(h => selected.has(`${h.coin}::${h.coinName}`)),
    [holdings, selected]
  );

  const afterHarvesting = useMemo(
    () => gainsData ? computeAfterHarvesting(gainsData, selectedList) : null,
    [gainsData, selectedList]
  );

  const savings = useMemo(
    () => preHarvesting && afterHarvesting
      ? preHarvesting.realised - afterHarvesting.realised
      : 0,
    [preHarvesting, afterHarvesting]
  );

  const toggleHolding = useCallback((h: Holding) => {
    const key = `${h.coin}::${h.coinName}`;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected(prev =>
      prev.size === holdings.length
        ? new Set()
        : new Set(holdings.map(h => `${h.coin}::${h.coinName}`))
    );
  }, [holdings]);

  const isSelected  = useCallback((h: Holding) => selected.has(`${h.coin}::${h.coinName}`), [selected]);
  const allSelected  = holdings.length > 0 && selected.size === holdings.length;
  const someSelected = selected.size > 0 && !allSelected;

  const ctx = useMemo<TaxCtx>(() => ({
    holdings, preHarvesting, afterHarvesting, savings,
    selectedCount: selected.size,
    loading, error, showAll, allSelected, someSelected,
    isSelected, toggleHolding, toggleAll, setShowAll, retry,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [holdings, preHarvesting, afterHarvesting, savings, selected.size,
       loading, error, showAll, allSelected, someSelected]);

  return <TaxContext.Provider value={ctx}>{children}</TaxContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTax(): TaxCtx {
  const ctx = useContext(TaxContext);
  if (!ctx) throw new Error('useTax must be used within <TaxProvider>');
  return ctx;
}
