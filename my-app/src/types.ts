export interface Stock {
  id: string;              // e.g., "AAPL"
  name: string;            // e.g., "Apple Inc."
  lastTradePrice: number;
  openPrice: number;
}

export interface StockNames {
  id: string;
  name: string;
}
