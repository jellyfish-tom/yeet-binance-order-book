import type { MarketSymbol } from "@pages/OrderBook/model/markets";

export { TICK_SIZES, type TickSize } from "@pages/OrderBook/model/tickSize";

import type { TickSize } from "@pages/OrderBook/model/tickSize";

export type OrderBookSide = "ask" | "bid";

export type OrderBookRow = {
  key?: string;
  price: string;
  amount: string;
  total: string;
  depthPercent: number;
  side: OrderBookSide;
};

export type OrderBookConnectionState =
  | "idle"
  | "connecting"
  | "live"
  | "reconnecting"
  | "error";

export type NormalizedDepthLevel = {
  priceText: string;
  quantityText: string;
  price: number;
  quantity: number;
  side: OrderBookSide;
};

export type PartialDepthBookState = {
  symbol: MarketSymbol;
  receivedAt: number;
  lastUpdateId: number | null;
  bids: NormalizedDepthLevel[];
  asks: NormalizedDepthLevel[];
  status: OrderBookConnectionState;
  errorMessage: string | null;
};

export type UseBinancePartialDepthState = {
  connectionState: OrderBookConnectionState;
  book: PartialDepthBookState | null;
  isStale: boolean;
  reconnectAttempt: number;
  activeSymbol: MarketSymbol;
};

export type DepthMode = "amount" | "cumulative";

export type OrderBookSelectorInput = {
  bids: NormalizedDepthLevel[];
  asks: NormalizedDepthLevel[];
  tickSize: TickSize;
  rowCount: number;
  depthMode: DepthMode;
  roundingEnabled: boolean;
  quoteAsset: string;
  centerPricePrecision: number;
};

export type CenterPriceDirection = "up" | "down";

export type GroupedPriceBucket = {
  bucketPrice: number;
  totalQuantity: number;
  cumulativeTotal: number;
  side: OrderBookSide;
  levelCount: number;
};

export type OrderBookDisplayRow = OrderBookRow & {
  key: string;
  rawPrice: number;
  rawAmount: number;
};

export type OrderBookDerivedView = {
  asks: OrderBookDisplayRow[];
  bids: OrderBookDisplayRow[];
  centerPrice: string;
  centerConvertedPrice: string;
  centerValue: number | null;
  buyRatio: number;
  sellRatio: number;
  effectiveTickSize: TickSize;
  spread: number | null;
  bestBid: number | null;
  bestAsk: number | null;
};
