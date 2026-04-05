import type { BinancePartialDepthMessage } from "@pages/OrderBook/model/binance";
import type { MarketSymbol } from "@pages/OrderBook/model/markets";
import type {
  PartialDepthBookState,
  UseBinancePartialDepthState,
} from "@pages/OrderBook/model/orderBook";
import { normalizeBinanceLevels } from "@pages/OrderBook/utils/depth";

export function createEmptyBookState(
  symbol: MarketSymbol,
  status: PartialDepthBookState["status"],
): PartialDepthBookState {
  return {
    symbol,
    receivedAt: Date.now(),
    lastUpdateId: null,
    bids: [],
    asks: [],
    status,
    errorMessage: null,
  };
}

export function createBookFromPayload(
  symbol: MarketSymbol,
  payload: BinancePartialDepthMessage,
): PartialDepthBookState {
  return {
    symbol,
    receivedAt: Date.now(),
    lastUpdateId:
      typeof payload.lastUpdateId === "number" ? payload.lastUpdateId : null,
    bids: normalizeBinanceLevels(payload.bids, "bid"),
    asks: normalizeBinanceLevels(payload.asks, "ask"),
    status: "live",
    errorMessage: null,
  };
}

export function updateBookStatus(
  currentBook: PartialDepthBookState | null,
  symbol: MarketSymbol,
  status: PartialDepthBookState["status"],
  errorMessage: string | null = null,
): PartialDepthBookState {
  const shouldResetBook = currentBook === null || currentBook.symbol !== symbol;
  const book = shouldResetBook
    ? createEmptyBookState(symbol, status)
    : currentBook;

  return {
    ...book,
    status,
    errorMessage,
  };
}

export function createHookState(
  symbol: MarketSymbol,
  connectionState: UseBinancePartialDepthState["connectionState"],
  book: PartialDepthBookState | null,
  isStale: boolean,
  reconnectAttempt: number,
): UseBinancePartialDepthState {
  return {
    connectionState,
    book,
    isStale,
    reconnectAttempt,
    activeSymbol: symbol,
  };
}

export function clearBookErrorMessage(book: PartialDepthBookState | null) {
  if (!book) {
    return book;
  }

  return {
    ...book,
    errorMessage: null,
  };
}
