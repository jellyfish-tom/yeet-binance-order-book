import { describe, expect, it } from "bun:test";
import {
  formatAmount,
  formatConvertedPrice,
  formatConvertedPriceWithPrecision,
  formatPrice,
  formatPriceWithPrecision,
  formatTotal,
} from "@pages/OrderBook/utils/format";

describe("formatPrice", () => {
  it("formats with precision derived from tick size", () => {
    expect(formatPrice(100.5, "0.01")).toBe("100.50");
    expect(formatPrice(100.5, "0.1")).toBe("100.5");
    expect(formatPrice(100, "1")).toBe("100");
  });

  it("returns '-' for non-finite values", () => {
    expect(formatPrice(NaN, "0.01")).toBe("-");
    expect(formatPrice(Infinity, "0.01")).toBe("-");
    expect(formatPrice(-Infinity, "0.01")).toBe("-");
  });

  it("formats zero with correct precision", () => {
    expect(formatPrice(0, "0.01")).toBe("0.00");
  });

  it("formats large values with commas", () => {
    expect(formatPrice(100000, "1")).toBe("100,000");
  });
});

describe("formatPriceWithPrecision", () => {
  it("formats to exact decimal places", () => {
    expect(formatPriceWithPrecision(1234.5, 2)).toBe("1,234.50");
    expect(formatPriceWithPrecision(1234.5, 0)).toBe("1,235");
  });

  it("returns '-' for non-finite values", () => {
    expect(formatPriceWithPrecision(NaN, 2)).toBe("-");
  });
});

describe("formatAmount", () => {
  it("formats with up to 5 decimal places", () => {
    expect(formatAmount(1.123456)).toBe("1.12346");
    expect(formatAmount(1.1)).toBe("1.1");
  });

  it("formats whole numbers without decimals", () => {
    expect(formatAmount(5)).toBe("5");
  });

  it("formats zero", () => {
    expect(formatAmount(0)).toBe("0");
  });

  it("returns '-' for non-finite values", () => {
    expect(formatAmount(NaN)).toBe("-");
  });

  it("formats large amounts with commas", () => {
    expect(formatAmount(1000000)).toBe("1,000,000");
  });
});

describe("formatTotal", () => {
  it("formats with up to 5 decimal places", () => {
    expect(formatTotal(12345.6789)).toBe("12,345.6789");
  });

  it("formats zero", () => {
    expect(formatTotal(0)).toBe("0");
  });

  it("returns '-' for non-finite values", () => {
    expect(formatTotal(Infinity)).toBe("-");
  });
});

describe("formatConvertedPrice", () => {
  it("prepends $ for USDT", () => {
    expect(formatConvertedPrice(100, "0.01", "USDT")).toBe("$100.00");
  });

  it("prepends $ for USDC", () => {
    expect(formatConvertedPrice(100, "0.01", "USDC")).toBe("$100.00");
  });

  it("prepends $ for USD", () => {
    expect(formatConvertedPrice(100, "0.01", "USD")).toBe("$100.00");
  });

  it("appends asset symbol for non-dollar assets", () => {
    expect(formatConvertedPrice(0.05, "0.01", "BTC")).toBe("0.05 BTC");
    expect(formatConvertedPrice(1.5, "0.1", "ETH")).toBe("1.5 ETH");
  });

  it("returns '-' for non-finite value", () => {
    expect(formatConvertedPrice(NaN, "0.01", "USDT")).toBe("-");
  });
});

describe("formatConvertedPriceWithPrecision", () => {
  it("prepends $ for dollar-quoted assets", () => {
    expect(formatConvertedPriceWithPrecision(99999.99, 2, "USDT")).toBe(
      "$99,999.99",
    );
  });

  it("appends asset for non-dollar assets", () => {
    expect(formatConvertedPriceWithPrecision(0.0012, 4, "BTC")).toBe(
      "0.0012 BTC",
    );
  });

  it("returns '-' for non-finite value", () => {
    expect(formatConvertedPriceWithPrecision(Infinity, 2, "USDT")).toBe("-");
  });

  it("precision is passed through correctly", () => {
    expect(formatConvertedPriceWithPrecision(1, 4, "USDT")).toBe("$1.0000");
  });
});
