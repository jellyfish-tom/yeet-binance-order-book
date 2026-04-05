import { describe, expect, it } from "bun:test";
import {
  getTickSizePrecision,
  normalizeBinanceLevels,
  parseNumericValue,
  sortDepthLevelsBySide,
  toBucketPrice,
} from "@pages/OrderBook/utils/depth";

describe("parseNumericValue", () => {
  it("parses a plain number string", () => {
    expect(parseNumericValue("12345.67")).toBe(12345.67);
  });

  it("strips commas before parsing", () => {
    expect(parseNumericValue("1,234,567.89")).toBe(1234567.89);
  });

  it("returns 0 for empty string (Number('') === 0)", () => {
    expect(parseNumericValue("")).toBe(0);
  });

  it("returns NaN for non-numeric string", () => {
    expect(parseNumericValue("abc")).toBeNaN();
  });

  it("parses zero", () => {
    expect(parseNumericValue("0")).toBe(0);
  });
});

describe("getTickSizePrecision", () => {
  it("returns 2 for '0.01'", () => {
    expect(getTickSizePrecision("0.01")).toBe(2);
  });

  it("returns 1 for '0.1'", () => {
    expect(getTickSizePrecision("0.1")).toBe(1);
  });

  it("returns 0 for '1'", () => {
    expect(getTickSizePrecision("1")).toBe(0);
  });

  it("returns 0 for '10'", () => {
    expect(getTickSizePrecision("10")).toBe(0);
  });

  it("returns 0 for '100'", () => {
    expect(getTickSizePrecision("100")).toBe(0);
  });

  it("returns 0 for '1000'", () => {
    expect(getTickSizePrecision("1000")).toBe(0);
  });

  it("returns 0 for '50'", () => {
    expect(getTickSizePrecision("50")).toBe(0);
  });
});

describe("normalizeBinanceLevels", () => {
  it("converts valid tuples to NormalizedDepthLevel objects", () => {
    const result = normalizeBinanceLevels(
      [
        ["100.50", "2.5"],
        ["101.00", "1.0"],
      ],
      "ask",
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      price: 100.5,
      quantity: 2.5,
      priceText: "100.50",
      quantityText: "2.5",
      side: "ask",
    });
  });

  it("filters out tuples with non-finite price", () => {
    const result = normalizeBinanceLevels(
      [
        ["NaN", "1.0"],
        ["100.00", "2.0"],
      ],
      "bid",
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.price).toBe(100);
  });

  it("filters out tuples with non-finite quantity", () => {
    const result = normalizeBinanceLevels(
      [
        ["100.00", "Infinity"],
        ["200.00", "3.0"],
      ],
      "bid",
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.price).toBe(200);
  });

  it("returns empty array for empty input", () => {
    expect(normalizeBinanceLevels([], "ask")).toEqual([]);
  });

  it("sets the side on each level", () => {
    const result = normalizeBinanceLevels([["50.00", "1.0"]], "bid");
    expect(result[0]?.side).toBe("bid");
  });

  it("coerces comma-formatted strings", () => {
    const result = normalizeBinanceLevels([["1,000.00", "0.5"]], "ask");
    expect(result[0]?.price).toBe(1000);
  });
});

describe("sortDepthLevelsBySide", () => {
  const levels = [
    {
      price: 300,
      quantity: 1,
      side: "ask" as const,
      priceText: "300",
      quantityText: "1",
    },
    {
      price: 100,
      quantity: 2,
      side: "ask" as const,
      priceText: "100",
      quantityText: "2",
    },
    {
      price: 200,
      quantity: 3,
      side: "ask" as const,
      priceText: "200",
      quantityText: "3",
    },
  ];

  it("sorts asks ascending by price", () => {
    const sorted = sortDepthLevelsBySide(levels, "ask");
    expect(sorted.map((l) => l.price)).toEqual([100, 200, 300]);
  });

  it("sorts bids descending by price", () => {
    const bids = levels.map((l) => ({ ...l, side: "bid" as const }));
    const sorted = sortDepthLevelsBySide(bids, "bid");
    expect(sorted.map((l) => l.price)).toEqual([300, 200, 100]);
  });

  it("does not mutate the original array", () => {
    const original = [...levels];
    sortDepthLevelsBySide(levels, "ask");
    expect(levels).toEqual(original);
  });

  it("returns empty array for empty input", () => {
    expect(sortDepthLevelsBySide([], "ask")).toEqual([]);
  });
});

describe("toBucketPrice", () => {
  it("rounds price to nearest tick", () => {
    expect(toBucketPrice(100.13, "0.1")).toBe(100.1);
    expect(toBucketPrice(100.15, "0.1")).toBe(100.2);
  });

  it("handles tick size of 1", () => {
    expect(toBucketPrice(99.7, "1")).toBe(100);
    expect(toBucketPrice(99.4, "1")).toBe(99);
  });

  it("handles large tick sizes", () => {
    expect(toBucketPrice(234, "100")).toBe(200);
    expect(toBucketPrice(260, "100")).toBe(300);
  });

  it("handles floating-point precision (0.1 drift)", () => {
    // 0.1 + 0.2 = 0.30000000000000004 in JS — should bucket correctly
    expect(toBucketPrice(0.3, "0.1")).toBe(0.3);
    expect(toBucketPrice(0.30000000000000004, "0.1")).toBe(0.3);
  });

  it("returns price unchanged for invalid tick size", () => {
    expect(toBucketPrice(123.45, "0")).toBe(123.45);
    expect(toBucketPrice(123.45, "NaN")).toBe(123.45);
    expect(toBucketPrice(123.45, "-1")).toBe(123.45);
  });

  it("handles exact multiples without drift", () => {
    expect(toBucketPrice(100, "0.01")).toBe(100);
  });
});
