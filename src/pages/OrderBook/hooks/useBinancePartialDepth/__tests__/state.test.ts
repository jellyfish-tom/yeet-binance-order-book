import { describe, expect, it } from "bun:test";
import {
  clearBookErrorMessage,
  createBookFromPayload,
  updateBookStatus,
} from "@pages/OrderBook/hooks/useBinancePartialDepth/state";
import type { BinancePartialDepthMessage } from "@pages/OrderBook/model/binance";

const SYMBOL = "BTCUSDT" as ReturnType<
  typeof import("@pages/OrderBook/model/markets").getMarketConfig
>["symbol"];

const validPayload: BinancePartialDepthMessage = {
  lastUpdateId: 123456,
  bids: [
    ["50000.00", "1.5"],
    ["49900.00", "2.0"],
  ],
  asks: [
    ["50100.00", "0.5"],
    ["50200.00", "1.0"],
  ],
};

describe("createBookFromPayload", () => {
  it("produces a book with status 'live'", () => {
    const book = createBookFromPayload(SYMBOL, validPayload);
    expect(book.status).toBe("live");
  });

  it("stores the lastUpdateId", () => {
    const book = createBookFromPayload(SYMBOL, validPayload);
    expect(book.lastUpdateId).toBe(123456);
  });

  it("normalizes bids and asks arrays", () => {
    const book = createBookFromPayload(SYMBOL, validPayload);
    expect(book.bids).toHaveLength(2);
    expect(book.asks).toHaveLength(2);
    expect(book.bids[0]?.price).toBe(50000);
    expect(book.asks[0]?.price).toBe(50100);
  });

  it("sets errorMessage to null", () => {
    const book = createBookFromPayload(SYMBOL, validPayload);
    expect(book.errorMessage).toBeNull();
  });

  it("stores the symbol", () => {
    const book = createBookFromPayload(SYMBOL, validPayload);
    expect(book.symbol).toBe(SYMBOL);
  });

  it("sets lastUpdateId to null when not a number", () => {
    const payload = {
      ...validPayload,
      lastUpdateId: "bad" as unknown as number,
    };
    const book = createBookFromPayload(SYMBOL, payload);
    expect(book.lastUpdateId).toBeNull();
  });
});

describe("updateBookStatus", () => {
  it("creates empty book when currentBook is null", () => {
    const book = updateBookStatus(null, SYMBOL, "connecting");
    expect(book.status).toBe("connecting");
    expect(book.bids).toEqual([]);
    expect(book.asks).toEqual([]);
  });

  it("resets book when symbol changes", () => {
    const existing = createBookFromPayload(SYMBOL, validPayload);
    const updated = updateBookStatus(
      existing,
      "ETHUSDT" as typeof SYMBOL,
      "connecting",
    );
    expect(updated.bids).toEqual([]);
    expect(updated.status).toBe("connecting");
  });

  it("preserves existing book data when symbol is unchanged", () => {
    const existing = createBookFromPayload(SYMBOL, validPayload);
    const updated = updateBookStatus(existing, SYMBOL, "reconnecting");
    expect(updated.bids).toHaveLength(2);
    expect(updated.status).toBe("reconnecting");
  });

  it("does not mutate the original book", () => {
    const existing = createBookFromPayload(SYMBOL, validPayload);
    const originalStatus = existing.status;
    updateBookStatus(existing, SYMBOL, "error", "something went wrong");
    expect(existing.status).toBe(originalStatus);
  });

  it("sets errorMessage when provided", () => {
    const book = updateBookStatus(null, SYMBOL, "error", "connection refused");
    expect(book.errorMessage).toBe("connection refused");
  });
});

describe("clearBookErrorMessage", () => {
  it("returns null when book is null", () => {
    expect(clearBookErrorMessage(null)).toBeNull();
  });

  it("nullifies errorMessage on a book", () => {
    const book = updateBookStatus(
      null,
      SYMBOL,
      "error",
      "something went wrong",
    );
    const cleared = clearBookErrorMessage(book);
    expect(cleared?.errorMessage).toBeNull();
  });

  it("does not mutate the original book", () => {
    const book = updateBookStatus(null, SYMBOL, "error", "err");
    clearBookErrorMessage(book);
    expect(book.errorMessage).toBe("err");
  });
});
