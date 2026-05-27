import { CapitalGainsData } from '@/types';

// Updated to match the large-scale holdings data
const data: CapitalGainsData = {
  capitalGains: {
    stcg: { profits: 4049.48, losses: 32127.03 },
    ltcg: { profits: 0,       losses: 0         },
  },
};

export const fetchCapitalGains = (): Promise<CapitalGainsData> =>
  new Promise(resolve => setTimeout(() => resolve(data), 600));
