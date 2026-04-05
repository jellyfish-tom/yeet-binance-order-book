import { describe, expect, it } from "bun:test";
import {
  getOverlay,
  getOverlayOffset,
  getTickSize,
  isTickSize,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/utils";
import type {
  OrderBookRow,
  OrderBookSide,
} from "@pages/OrderBook/model/orderBook";

function makeRow(
  price: string,
  amount: string,
  total: string,
  side: OrderBookSide,
  key?: string,
): OrderBookRow {
  return { price, amount, total, depthPercent: 0, side, key };
}

describe("isTickSize", () => {
  it("returns true for valid tick sizes", () => {
    for (const ts of ["0.01", "0.1", "1", "10", "50", "100", "1000"]) {
      expect(isTickSize(ts)).toBe(true);
    }
  });

  it("returns false for invalid values", () => {
    expect(isTickSize("0.001")).toBe(false);
    expect(isTickSize("")).toBe(false);
    expect(isTickSize("5")).toBe(false);
  });
});

describe("getTickSize", () => {
  it("returns the value when it is a valid tick size", () => {
    expect(getTickSize("1")).toBe("1");
    expect(getTickSize("0.01")).toBe("0.01");
  });

  it("returns the first tick size (0.01) for invalid values", () => {
    expect(getTickSize("0.003")).toBe("0.01");
    expect(getTickSize("")).toBe("0.01");
  });
});

describe("getOverlay", () => {
  // For ask rows, the overlay accumulates from the hovered index to the end (index = closest to center)
  const askRows = [
    makeRow("100", "2", "200", "ask", "ask-100"),
    makeRow("101", "3", "303", "ask", "ask-101"),
    makeRow("102", "1", "102", "ask", "ask-102"),
  ];

  // For bid rows, accumulate from start to hovered index (index = closest to center)
  const bidRows = [
    makeRow("99", "4", "396", "bid", "bid-99"),
    makeRow("98", "2", "196", "bid", "bid-98"),
    makeRow("97", "1", "97", "bid", "bid-97"),
  ];

  it("returns zeros for empty rows", () => {
    const result = getOverlay([], 0);
    expect(result.avgPrice).toContain("0");
    expect(result.sumAmount).toBe("0");
    expect(result.sumTotal).toBe("0");
  });

  it("returns correct sumAmount and sumTotal for ask at index 0 (all rows)", () => {
    const result = getOverlay(askRows, 0);
    expect(result.sumAmount).toBe("6");
    expect(result.sumTotal).toBe("605");
  });

  it("returns single row data for ask at last index", () => {
    const result = getOverlay(askRows, 2);
    expect(result.sumAmount).toBe("1");
    expect(result.sumTotal).toBe("102");
  });

  it("returns correct cumulative data for bid at index 1", () => {
    const result = getOverlay(bidRows, 1);
    expect(result.sumAmount).toBe("6");
    expect(result.sumTotal).toBe("592");
  });

  it("computes avgPrice as sumTotal / sumAmount", () => {
    // 1 row: price=100, amount=2, total=200 → avg = 100
    const result = getOverlay(
      [makeRow("100", "2", "200", "ask", "ask-100")],
      0,
    );
    expect(result.avgPrice).toContain("100.00000");
  });

  it("formats avgPrice with prefix '≈ '", () => {
    const result = getOverlay(askRows, 0);
    expect(result.avgPrice.startsWith("≈ ")).toBe(true);
  });

  it("handles single row", () => {
    const result = getOverlay([makeRow("500", "1", "500", "ask", "k")], 0);
    expect(result.sumAmount).toBe("1");
    expect(result.sumTotal).toBe("500");
  });
});

describe("getOverlayOffset", () => {
  it("returns 0 for middle row in a list", () => {
    // 5 rows: middle index is 2
    expect(getOverlayOffset(2, 5)).toBe(0);
  });

  it("returns positive offset for rows above middle", () => {
    // index 0 in 5 rows: (0 - 2) * 20 = -40
    expect(getOverlayOffset(0, 5)).toBe(-40);
  });

  it("returns negative offset for rows below middle", () => {
    // index 4 in 5 rows: (4 - 2) * 20 = 40
    expect(getOverlayOffset(4, 5)).toBe(40);
  });

  it("handles single row (index 0, count 1)", () => {
    // middleIndex = floor(0/2) = 0; offset = (0 - 0) * 20 = 0
    expect(getOverlayOffset(0, 1)).toBe(0);
  });

  it("handles even row count middle", () => {
    // 4 rows: middleIndex = floor(3/2) = 1
    expect(getOverlayOffset(1, 4)).toBe(0);
    expect(getOverlayOffset(0, 4)).toBe(-20);
  });
});
