import type { MarketSymbol } from "@pages/OrderBook/model/markets";
export type BinanceDepthLevel = readonly [price: string, quantity: string];

export type BinancePartialDepthMessage = {
  lastUpdateId: number;
  bids: BinanceDepthLevel[];
  asks: BinanceDepthLevel[];
};

export const BINANCE_PARTIAL_DEPTH_LEVELS = "20" as const;
export const BINANCE_PARTIAL_DEPTH_SPEED_SUFFIX = "" as const;

export function createPartialDepthStreamUrl(
  symbol: MarketSymbol,
  levels: string = BINANCE_PARTIAL_DEPTH_LEVELS,
  speedSuffix: string = BINANCE_PARTIAL_DEPTH_SPEED_SUFFIX,
) {
  return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth${levels}${speedSuffix}`;
}
