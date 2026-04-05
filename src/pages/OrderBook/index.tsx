import { Controls } from "@pages/OrderBook/components/Controls";
import { Table } from "@pages/OrderBook/components/Table";
import { useBinancePartialDepth } from "@pages/OrderBook/hooks/useBinancePartialDepth";
import {
  BINANCE_PARTIAL_DEPTH_LEVELS,
  BINANCE_PARTIAL_DEPTH_SPEED_SUFFIX,
} from "@pages/OrderBook/model/binance";
import {
  DEFAULT_MARKET_SYMBOL,
  getMarketConfig,
  type MarketSymbol,
  ORDER_BOOK_MARKETS,
} from "@pages/OrderBook/model/markets";
import { useMemo, useState } from "react";

export function OrderBookPage() {
  const [activeMarketSymbol, setActiveMarketSymbol] = useState<MarketSymbol>(
    DEFAULT_MARKET_SYMBOL,
  );
  const activeMarket = useMemo(
    () => getMarketConfig(activeMarketSymbol),
    [activeMarketSymbol],
  );
  const { state } = useBinancePartialDepth({
    symbol: activeMarket?.streamSymbol ?? DEFAULT_MARKET_SYMBOL,
    levels: BINANCE_PARTIAL_DEPTH_LEVELS,
    speedSuffix: BINANCE_PARTIAL_DEPTH_SPEED_SUFFIX,
  });

  if (!activeMarket) {
    return null;
  }

  return (
    <main className="ob-text-primary relative flex min-h-screen w-full justify-center overflow-visible px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-4">
        <Controls
          markets={ORDER_BOOK_MARKETS}
          activeMarketSymbol={activeMarket.symbol}
          onSelectMarket={setActiveMarketSymbol}
        />
        <Table
          asks={state.book?.asks ?? []}
          bids={state.book?.bids ?? []}
          priceStep={activeMarket.defaultTickSize}
          rowCount={activeMarket.defaultRowCount}
          baseAsset={activeMarket.baseAsset}
          quoteAsset={activeMarket.quoteAsset}
          centerPricePrecision={activeMarket.centerPricePrecision}
          connectionState={state.connectionState}
          errorMessage={state.book?.errorMessage}
        />
      </div>
    </main>
  );
}
