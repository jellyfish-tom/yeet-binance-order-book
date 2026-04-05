import { TICK_SIZES, type TickSize } from "@pages/OrderBook/model/tickSize";

export type OrderBookMarketConfig = {
  symbol: string;
  streamSymbol: string;
  label: string;
  baseAsset: string;
  quoteAsset: string;
  centerPricePrecision: number;
  defaultTickSize: TickSize;
  supportedTickSizes: readonly TickSize[];
  defaultRowCount: number;
};

export const ORDER_BOOK_MARKETS = [
  {
    symbol: "BTCUSDT",
    streamSymbol: "BTCUSDT",
    label: "BTC/USDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    centerPricePrecision: 2,
    defaultTickSize: "0.1",
    supportedTickSizes: TICK_SIZES,
    defaultRowCount: 10,
  },
  {
    symbol: "ETHUSDT",
    streamSymbol: "ETHUSDT",
    label: "ETH/USDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    centerPricePrecision: 2,
    defaultTickSize: "0.01",
    supportedTickSizes: TICK_SIZES,
    defaultRowCount: 10,
  },
  {
    symbol: "SOLUSDT",
    streamSymbol: "SOLUSDT",
    label: "SOL/USDT",
    baseAsset: "SOL",
    quoteAsset: "USDT",
    centerPricePrecision: 2,
    defaultTickSize: "0.01",
    supportedTickSizes: TICK_SIZES,
    defaultRowCount: 10,
  },
] as const satisfies readonly OrderBookMarketConfig[];

export type MarketSymbol = (typeof ORDER_BOOK_MARKETS)[number]["symbol"];

export function isMarketSymbol(value: string): value is MarketSymbol {
  return ORDER_BOOK_MARKETS.some((market) => market.symbol === value);
}

export const DEFAULT_MARKET_SYMBOL = ORDER_BOOK_MARKETS[0].symbol;

export function getMarketConfig(symbol: MarketSymbol) {
  return (
    ORDER_BOOK_MARKETS.find((market) => market.symbol === symbol) ??
    ORDER_BOOK_MARKETS[0]
  );
}
