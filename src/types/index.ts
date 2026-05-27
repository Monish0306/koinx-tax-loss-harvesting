export interface GainLossEntry {
  profits: number;
  losses: number;
}

export interface CapitalGainsData {
  capitalGains: {
    stcg: GainLossEntry;
    ltcg: GainLossEntry;
  };
}

export interface HoldingGain {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: HoldingGain;
  ltcg: HoldingGain;
}

export interface ComputedGains {
  stcg: {
    profits: number;
    losses: number;
    net: number;
  };
  ltcg: {
    profits: number;
    losses: number;
    net: number;
  };
  realised: number;
}
