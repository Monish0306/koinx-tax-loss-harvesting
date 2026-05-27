'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCapitalGains } from '@/mock/capitalGains';
import { fetchHoldings } from '@/mock/holdings';
import { Holding, CapitalGainsData, ComputedGains } from '@/types';

function computeGains(
  baseData: CapitalGainsData,
  selectedHoldings: Holding[]
): ComputedGains {
  let stcgProfits = baseData.capitalGains.stcg.profits;
  let stcgLosses = baseData.capitalGains.stcg.losses;
  let ltcgProfits = baseData.capitalGains.ltcg.profits;
  let ltcgLosses = baseData.capitalGains.ltcg.losses;

  for (const h of selectedHoldings) {
    // Short-term gain
    if (h.stcg.gain > 0) {
      stcgProfits += h.stcg.gain;
    } else if (h.stcg.gain < 0) {
      stcgLosses += Math.abs(h.stcg.gain);
    }
    // Long-term gain
    if (h.ltcg.gain > 0) {
      ltcgProfits += h.ltcg.gain;
    } else if (h.ltcg.gain < 0) {
      ltcgLosses += Math.abs(h.ltcg.gain);
    }
  }

  const stcgNet = stcgProfits - stcgLosses;
  const ltcgNet = ltcgProfits - ltcgLosses;

  return {
    stcg: { profits: stcgProfits, losses: stcgLosses, net: stcgNet },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses, net: ltcgNet },
    realised: stcgNet + ltcgNet,
  };
}

export function useTaxData() {
  const [capitalGainsData, setCapitalGainsData] = useState<CapitalGainsData | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gainsData, holdingsData] = await Promise.all([
          fetchCapitalGains(),
          fetchHoldings(),
        ]);
        setCapitalGainsData(gainsData);
        setHoldings(holdingsData);
      } catch {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const preHarvesting: ComputedGains | null = capitalGainsData
    ? {
        stcg: {
          profits: capitalGainsData.capitalGains.stcg.profits,
          losses: capitalGainsData.capitalGains.stcg.losses,
          net:
            capitalGainsData.capitalGains.stcg.profits -
            capitalGainsData.capitalGains.stcg.losses,
        },
        ltcg: {
          profits: capitalGainsData.capitalGains.ltcg.profits,
          losses: capitalGainsData.capitalGains.ltcg.losses,
          net:
            capitalGainsData.capitalGains.ltcg.profits -
            capitalGainsData.capitalGains.ltcg.losses,
        },
        realised:
          capitalGainsData.capitalGains.stcg.profits -
          capitalGainsData.capitalGains.stcg.losses +
          (capitalGainsData.capitalGains.ltcg.profits -
            capitalGainsData.capitalGains.ltcg.losses),
      }
    : null;

  const selectedHoldingsList = holdings.filter((h) =>
    selectedCoins.has(`${h.coin}-${h.coinName}`)
  );

  const afterHarvesting: ComputedGains | null =
    capitalGainsData
      ? computeGains(capitalGainsData, selectedHoldingsList)
      : null;

  const savings =
    preHarvesting && afterHarvesting
      ? preHarvesting.realised - afterHarvesting.realised
      : 0;

  const toggleHolding = useCallback((holding: Holding) => {
    const key = `${holding.coin}-${holding.coinName}`;
    setSelectedCoins((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedCoins.size === holdings.length) {
      setSelectedCoins(new Set());
    } else {
      setSelectedCoins(new Set(holdings.map((h) => `${h.coin}-${h.coinName}`)));
    }
  }, [holdings, selectedCoins.size]);

  const isSelected = useCallback(
    (holding: Holding) => selectedCoins.has(`${holding.coin}-${holding.coinName}`),
    [selectedCoins]
  );

  const allSelected = holdings.length > 0 && selectedCoins.size === holdings.length;
  const someSelected = selectedCoins.size > 0 && selectedCoins.size < holdings.length;

  return {
    holdings,
    preHarvesting,
    afterHarvesting,
    savings,
    loading,
    error,
    toggleHolding,
    toggleAll,
    isSelected,
    allSelected,
    someSelected,
    showAll,
    setShowAll,
  };
}
