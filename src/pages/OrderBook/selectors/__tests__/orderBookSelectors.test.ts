import { describe, expect, it } from "bun:test";
import type { NormalizedDepthLevel } from "@pages/OrderBook/model/orderBook";
import {
  bucketDepthLevelsByTickSize,
  buildOrderBookDerivedView,
  calculateCumulativeTotals,
  calculateDepthPercentages,
  deriveBuySellRatio,
} from "@pages/OrderBook/selectors/orderBookSelectors";
import { makeLevel } from "@pages/OrderBook/test-utils";

describe("bucketDepthLevelsByTickSize", () => {
  it("groups levels with the same bucket price", () => {
    const levels = [makeLevel(100.11, 1, "ask"), makeLevel(100.14, 2, "ask")];
    const buckets = bucketDepthLevelsByTickSize(levels, "0.1", "ask", true);
    expect(buckets).toHaveLength(1);
    expect(buckets[0]?.totalQuantity).toBe(3);
    expect(buckets[0]?.bucketPrice).toBe(100.1);
  });

  it("keeps separate buckets for different tick groups", () => {
    const levels = [makeLevel(100.1, 1, "ask"), makeLevel(100.2, 2, "ask")];
    const buckets = bucketDepthLevelsByTickSize(levels, "0.1", "ask", true);
    expect(buckets).toHaveLength(2);
  });

  it("sorts asks ascending", () => {
    const levels = [makeLevel(200, 1, "ask"), makeLevel(100, 2, "ask")];
    const buckets = bucketDepthLevelsByTickSize(levels, "1", "ask", true);
    expect(buckets[0]?.bucketPrice).toBe(100);
    expect(buckets[1]?.bucketPrice).toBe(200);
  });

  it("sorts bids descending", () => {
    const levels = [makeLevel(100, 1, "bid"), makeLevel(200, 2, "bid")];
    const buckets = bucketDepthLevelsByTickSize(levels, "1", "bid", true);
    expect(buckets[0]?.bucketPrice).toBe(200);
    expect(buckets[1]?.bucketPrice).toBe(100);
  });

  it("returns empty array for empty input", () => {
    expect(bucketDepthLevelsByTickSize([], "1", "ask", true)).toEqual([]);
  });

  it("accumulates totalValue correctly", () => {
    const levels = [makeLevel(100, 2, "ask"), makeLevel(100, 3, "ask")];
    const buckets = bucketDepthLevelsByTickSize(levels, "1", "ask", true);
    expect(buckets[0]?.totalValue).toBe(500);
  });
});

describe("calculateCumulativeTotals", () => {
  it("computes running cumulative total", () => {
    const buckets = bucketDepthLevelsByTickSize(
      [makeLevel(100, 1, "ask"), makeLevel(200, 2, "ask")],
      "1",
      "ask",
      true,
    );
    const result = calculateCumulativeTotals(buckets);
    expect(result[0]?.cumulativeTotal).toBe(100);
    expect(result[1]?.cumulativeTotal).toBe(500);
  });

  it("returns a single-element array with its own totalValue as cumulativeTotal", () => {
    const buckets = bucketDepthLevelsByTickSize(
      [makeLevel(50, 3, "ask")],
      "1",
      "ask",
      true,
    );
    const result = calculateCumulativeTotals(buckets);
    expect(result[0]?.cumulativeTotal).toBe(150);
  });

  it("returns empty array for empty input", () => {
    expect(calculateCumulativeTotals([])).toEqual([]);
  });
});

describe("calculateDepthPercentages", () => {
  it("normalises to 100% for the max quantity in amount mode", () => {
    const buckets = bucketDepthLevelsByTickSize(
      [makeLevel(100, 1, "ask"), makeLevel(200, 4, "ask")],
      "1",
      "ask",
      true,
    );
    const result = calculateDepthPercentages(buckets, "amount");
    expect(result[1]?.depthPercent).toBe(100);
    expect(result[0]?.depthPercent).toBe(25);
  });

  it("normalises to cumulative total in cumulative mode", () => {
    const buckets = calculateCumulativeTotals(
      bucketDepthLevelsByTickSize(
        [makeLevel(100, 1, "ask"), makeLevel(200, 1, "ask")],
        "1",
        "ask",
        true,
      ),
    );
    const result = calculateDepthPercentages(buckets, "cumulative");
    expect(result[1]?.depthPercent).toBe(100);
    expect(result[0]?.depthPercent).toBeGreaterThan(0);
    expect(result[0]?.depthPercent).toBeLessThan(100);
  });

  it("returns 0% for all when max is 0", () => {
    const buckets = bucketDepthLevelsByTickSize(
      [makeLevel(100, 0, "ask")],
      "1",
      "ask",
      true,
    );
    const result = calculateDepthPercentages(buckets, "amount");
    expect(result[0]?.depthPercent).toBe(0);
  });
});

describe("deriveBuySellRatio", () => {
  it("returns 50/50 when both sides are empty", () => {
    expect(deriveBuySellRatio([], [])).toEqual({ buyRatio: 50, sellRatio: 50 });
  });

  it("returns 0/100 when bids are empty", () => {
    const asks = bucketDepthLevelsByTickSize(
      [makeLevel(100, 5, "ask")],
      "1",
      "ask",
      true,
    );
    const { buyRatio, sellRatio } = deriveBuySellRatio(asks, []);
    expect(buyRatio).toBe(0);
    expect(sellRatio).toBe(100);
  });

  it("returns 100/0 when asks are empty", () => {
    const bids = bucketDepthLevelsByTickSize(
      [makeLevel(100, 5, "bid")],
      "1",
      "bid",
      true,
    );
    const { buyRatio, sellRatio } = deriveBuySellRatio([], bids);
    expect(buyRatio).toBe(100);
    expect(sellRatio).toBe(0);
  });

  it("rounds ratio to nearest integer and sums to 100", () => {
    const asks = bucketDepthLevelsByTickSize(
      [makeLevel(100, 1, "ask")],
      "1",
      "ask",
      true,
    );
    const bids = bucketDepthLevelsByTickSize(
      [makeLevel(100, 1, "bid")],
      "1",
      "bid",
      true,
    );
    const { buyRatio, sellRatio } = deriveBuySellRatio(asks, bids);
    expect(buyRatio + sellRatio).toBe(100);
    expect(buyRatio).toBe(50);
  });
});

describe("buildOrderBookDerivedView", () => {
  const btcAsks: NormalizedDepthLevel[] = [
    makeLevel(50100, 0.5, "ask"),
    makeLevel(50200, 1.0, "ask"),
    makeLevel(50300, 0.3, "ask"),
  ];
  const btcBids: NormalizedDepthLevel[] = [
    makeLevel(50000, 0.8, "bid"),
    makeLevel(49900, 1.2, "bid"),
    makeLevel(49800, 0.4, "bid"),
  ];

  const baseInput = {
    asks: btcAsks,
    bids: btcBids,
    tickSize: "1" as const,
    rowCount: 10,
    depthMode: "amount" as const,
    roundingEnabled: true,
    quoteAsset: "USDT",
    centerPricePrecision: 2,
  };

  it("returns the correct number of ask and bid rows (capped by rowCount)", () => {
    const view = buildOrderBookDerivedView({ ...baseInput, rowCount: 2 });
    expect(view.asks).toHaveLength(2);
    expect(view.bids).toHaveLength(2);
  });

  it("computes spread as bestAsk - bestBid", () => {
    const view = buildOrderBookDerivedView(baseInput);
    expect(view.spread).toBe(100);
    expect(view.bestAsk).toBe(50100);
    expect(view.bestBid).toBe(50000);
  });

  it("formats centerConvertedPrice with $ for USDT", () => {
    const view = buildOrderBookDerivedView(baseInput);
    expect(view.centerConvertedPrice).toMatch(/^\$/);
  });

  it("formats centerConvertedPrice with asset suffix for non-dollar quote", () => {
    const view = buildOrderBookDerivedView({
      ...baseInput,
      quoteAsset: "BTC",
    });
    expect(view.centerConvertedPrice).toMatch(/BTC$/);
  });

  it("asks are ordered descending (closest to center first in display)", () => {
    const view = buildOrderBookDerivedView(baseInput);
    const prices = view.asks.map((r) => r.rawPrice);
    expect(prices[0]).toBeGreaterThan(prices[prices.length - 1] ?? 0);
  });

  it("bids are ordered descending (best bid first)", () => {
    const view = buildOrderBookDerivedView(baseInput);
    const prices = view.bids.map((r) => r.rawPrice);
    expect(prices[0]).toBeGreaterThan(prices[prices.length - 1] ?? 0);
  });

  it("buyRatio + sellRatio === 100", () => {
    const view = buildOrderBookDerivedView(baseInput);
    expect(view.buyRatio + view.sellRatio).toBe(100);
  });

  it("returns spread null when only one side has data", () => {
    const view = buildOrderBookDerivedView({ ...baseInput, bids: [] });
    expect(view.spread).toBeNull();
  });

  it("effectiveTickSize matches input tickSize", () => {
    const view = buildOrderBookDerivedView(baseInput);
    expect(view.effectiveTickSize).toBe("1");
  });
});
