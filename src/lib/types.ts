export type Currency = 'KRW' | 'USD';

export interface TotalInvestment {
  amount: number;
  currency: Currency;
}

export interface TickerData {
  id: string;
  symbol: string;
  amount: number;
  timestamp: number;
}

export interface Portfolio {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  totalInvestment: TotalInvestment;
  tickers: TickerData[];
}