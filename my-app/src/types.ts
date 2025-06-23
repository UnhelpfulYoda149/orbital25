export interface Stock {
  symbol: string; // e.g., "AAPL"
  name: string;
  timestamp: Date; // e.g., "Apple Inc."
  open: number;
  lastTrade: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockNames {
  symbol: string;
  name: string;
}

export interface StockTransaction {
  user: string; // Username
  symbol: string; // e.g "AAPL"
  timestamp: string;
  tradePrice: string;
  numShares: number; // Negative for sell, Postiive for buy
}

export interface PortfolioSummary {
  stock: Stock;
  quantity: number;
  averagePrice: number;
}

export type Order = "buy" | "sell";
export type Instruction = "market" | "limit";
export type Expiry = "gtc" | "day";

export interface TradeOrder {
  id: string;
  user: string;
  symbol: string;
  purchasePrice: number;
  numShares: number;
  timestamp: string;
  instruction: Instruction;
  expiry: Expiry;
}

export interface Friend {
  username: string;
  timestamp: string;
}
